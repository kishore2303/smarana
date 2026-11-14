export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export type PradakshinaPhase = 'IDLE' | 'CALIBRATING' | 'TRACKING';

export interface PradakshinaLoopProfile {
  baselineSteps: number;
  baselineDurationMs: number;
  minStepsPerLap: number;
  maxStepsPerLap: number;
}

export interface PradakshinaLapEvent {
  lapDetected: boolean;
  completedLaps: number;
  currentLapSteps: number;
  baselineSteps: number;
  lapProgress: number; // 0.0 to 1.0
}

export interface CalibrationResult {
  success: boolean;
  profile?: PradakshinaLoopProfile;
  error?: 'TOO_FEW_STEPS' | 'NOT_CALIBRATING';
}

const GRAVITY_ALPHA = 0.92;
const MIN_CALIBRATION_STEPS = 10;
const STEP_PEAK_THRESHOLD_G = 1.12;
const STEP_VALLEY_THRESHOLD_G = 0.91;
const MIN_STEP_INTERVAL_MS = 280;
const MAX_STEP_INTERVAL_MS = 2500;

export class PradakshinaLoopDetector {
  private phase: PradakshinaPhase = 'IDLE';
  private gravityMag = 1.0;
  private hasSeenPeak = false;
  private lastStepTimeMs = 0;
  private calibrationStartMs = 0;
  private lapStartMs = 0;

  private currentLapSteps = 0;
  private completedLaps = 0;
  private profile: PradakshinaLoopProfile | null = null;

  constructor(profile?: PradakshinaLoopProfile) {
    if (profile) {
      this.profile = profile;
      this.phase = 'TRACKING';
    }
  }

  getPhase(): PradakshinaPhase {
    return this.phase;
  }

  getProfile(): PradakshinaLoopProfile | null {
    return this.profile;
  }

  getCurrentLapSteps(): number {
    return this.currentLapSteps;
  }

  getCompletedLaps(): number {
    return this.completedLaps;
  }

  getLapProgress(): number {
    if (!this.profile || this.profile.baselineSteps === 0) {
      return 0;
    }
    return Math.min(1.0, this.currentLapSteps / this.profile.baselineSteps);
  }

  /**
   * Start Round 1 calibration.
   */
  startCalibration(nowMs: number = Date.now()): void {
    this.phase = 'CALIBRATING';
    this.currentLapSteps = 0;
    this.completedLaps = 0;
    this.calibrationStartMs = nowMs;
    this.lapStartMs = nowMs;
    this.lastStepTimeMs = nowMs;
    this.hasSeenPeak = false;
    this.profile = null;
  }

  /**
   * Complete Round 1 calibration and lock in the baseline loop profile.
   */
  completeCalibration(nowMs: number = Date.now()): CalibrationResult {
    if (this.phase !== 'CALIBRATING') {
      return { success: false, error: 'NOT_CALIBRATING' };
    }

    if (this.currentLapSteps < MIN_CALIBRATION_STEPS) {
      return { success: false, error: 'TOO_FEW_STEPS' };
    }

    const baselineSteps = this.currentLapSteps;
    const baselineDurationMs = Math.max(5000, nowMs - this.calibrationStartMs);
    const minStepsPerLap = Math.max(8, Math.floor(baselineSteps * 0.85));
    const maxStepsPerLap = Math.ceil(baselineSteps * 1.3);

    this.profile = {
      baselineSteps,
      baselineDurationMs,
      minStepsPerLap,
      maxStepsPerLap,
    };

    this.phase = 'TRACKING';
    this.completedLaps = 1; // Round 1 is officially completed!
    this.currentLapSteps = 0;
    this.lapStartMs = nowMs;

    return {
      success: true,
      profile: this.profile,
    };
  }

  /**
   * Directly add steps (e.g. from hardware pedometer or external step detector).
   */
  addSteps(stepCount: number, nowMs: number = Date.now()): PradakshinaLapEvent {
    let lapDetected = false;

    for (let i = 0; i < stepCount; i++) {
      this.currentLapSteps++;

      if (this.phase === 'TRACKING' && this.profile) {
        const timeInLapMs = nowMs - this.lapStartMs;
        const reachedBaseline = this.currentLapSteps >= this.profile.baselineSteps;
        const reachedMinStepsWithTime =
          this.currentLapSteps >= this.profile.minStepsPerLap &&
          timeInLapMs >= this.profile.baselineDurationMs * 0.82;

        if (reachedBaseline || reachedMinStepsWithTime) {
          lapDetected = true;
          this.completedLaps++;
          this.currentLapSteps = 0;
          this.lapStartMs = nowMs;
          break; // Lap triggered
        }
      }
    }

    return {
      lapDetected,
      completedLaps: this.completedLaps,
      currentLapSteps: this.currentLapSteps,
      baselineSteps: this.profile?.baselineSteps ?? this.currentLapSteps,
      lapProgress: this.getLapProgress(),
    };
  }

  /**
   * Process an accelerometer sample to detect human walking steps.
   */
  updateAccelerometer(
    sample: Vector3D,
    nowMs: number = Date.now()
  ): PradakshinaLapEvent {
    const rawMag = Math.sqrt(
      sample.x * sample.x + sample.y * sample.y + sample.z * sample.z
    );

    // Track dynamic gravity
    this.gravityMag = GRAVITY_ALPHA * this.gravityMag + (1 - GRAVITY_ALPHA) * rawMag;

    let stepDetected = false;
    const timeSinceLastStep = nowMs - this.lastStepTimeMs;

    // Walking peak detection
    if (rawMag >= STEP_PEAK_THRESHOLD_G) {
      this.hasSeenPeak = true;
    } else if (this.hasSeenPeak && rawMag <= STEP_VALLEY_THRESHOLD_G) {
      if (
        timeSinceLastStep >= MIN_STEP_INTERVAL_MS &&
        timeSinceLastStep <= MAX_STEP_INTERVAL_MS
      ) {
        stepDetected = true;
        this.lastStepTimeMs = nowMs;
      }
      this.hasSeenPeak = false;
    }

    if (stepDetected) {
      return this.addSteps(1, nowMs);
    }

    return {
      lapDetected: false,
      completedLaps: this.completedLaps,
      currentLapSteps: this.currentLapSteps,
      baselineSteps: this.profile?.baselineSteps ?? this.currentLapSteps,
      lapProgress: this.getLapProgress(),
    };
  }

  reset(): void {
    this.phase = 'IDLE';
    this.gravityMag = 1.0;
    this.hasSeenPeak = false;
    this.lastStepTimeMs = 0;
    this.calibrationStartMs = 0;
    this.lapStartMs = 0;
    this.currentLapSteps = 0;
    this.completedLaps = 0;
    this.profile = null;
  }
}
