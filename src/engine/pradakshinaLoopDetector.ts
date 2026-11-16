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
  stepDetected: boolean;
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

const GRAVITY_ALPHA = 0.90;
const MIN_CALIBRATION_STEPS = 8;
const PEAK_DEVIATION_G = 0.04;
const VALLEY_DEVIATION_G = -0.03;
const MIN_STEP_INTERVAL_MS = 240;

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
    this.lastStepTimeMs = 0; // 0 permits immediate first step detection without lockout
    this.hasSeenPeak = false;
    this.gravityMag = 1.0;
    this.profile = null;
  }

  /**
   * Adjust steps manually (e.g. from +/- buttons during calibration).
   */
  adjustSteps(delta: number): number {
    this.currentLapSteps = Math.max(0, this.currentLapSteps + delta);
    return this.currentLapSteps;
  }

  /**
   * Set steps count directly.
   */
  setSteps(steps: number): void {
    this.currentLapSteps = Math.max(0, steps);
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
      stepDetected: stepCount > 0,
      lapDetected,
      completedLaps: this.completedLaps,
      currentLapSteps: this.currentLapSteps,
      baselineSteps: this.profile?.baselineSteps ?? this.currentLapSteps,
      lapProgress: this.getLapProgress(),
    };
  }

  /**
   * Process an accelerometer sample to detect human walking steps.
   * Uses dynamic gravity tracking and deviation thresholds for sensitive
   * detection of gentle, mindful temple walking without timeouts.
   */
  updateAccelerometer(
    sample: Vector3D,
    nowMs: number = Date.now()
  ): PradakshinaLapEvent {
    const rawMag = Math.sqrt(
      sample.x * sample.x + sample.y * sample.y + sample.z * sample.z
    );

    // Track dynamic baseline gravity with low-pass filter
    this.gravityMag = GRAVITY_ALPHA * this.gravityMag + (1 - GRAVITY_ALPHA) * rawMag;
    const deviation = rawMag - this.gravityMag;

    let stepDetected = false;
    const timeSinceLastStep =
      this.lastStepTimeMs === 0 ? Infinity : nowMs - this.lastStepTimeMs;

    // Detect walking step: positive impulse (peak) followed by rebound (valley)
    if (deviation >= PEAK_DEVIATION_G) {
      this.hasSeenPeak = true;
    } else if (this.hasSeenPeak && deviation <= VALLEY_DEVIATION_G) {
      if (timeSinceLastStep >= MIN_STEP_INTERVAL_MS) {
        stepDetected = true;
        this.lastStepTimeMs = nowMs;
      }
      this.hasSeenPeak = false;
    }

    if (stepDetected) {
      return this.addSteps(1, nowMs);
    }

    return {
      stepDetected: false,
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
