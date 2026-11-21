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
  lapPacedEstimate: boolean;
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
const PEAK_DEVIATION_G = 0.14; // Foot strike impulse threshold
const VALLEY_DEVIATION_G = -0.10; // Ground rebound threshold
const MIN_SWING_G = 0.24; // Peak-to-valley swing required to reject few-inch hand motions
const MIN_STEP_INTERVAL_MS = 360; // Max 2.7 steps/sec human cadence
const MIN_LOOP_ROTATION_DEG = 280; // Minimum circular circuit rotation required for a closed loop

export class PradakshinaLoopDetector {
  private phase: PradakshinaPhase = 'IDLE';
  private gravityMag = 1.0;
  private hasSeenPeak = false;
  private peakMag = 0;
  private lastStepTimeMs = 0;
  private calibrationStartMs = 0;
  private lapStartMs = 0;

  // Heading & loop circuit tracking
  private startHeadingDeg: number | null = null;
  private prevHeadingDeg: number | null = null;
  private accumulatedRotationDeg = 0;
  private hasCompass = false;

  private currentLapSteps = 0;
  private completedLaps = 0;
  private profile: PradakshinaLoopProfile | null = null;
  private autoConfirmLaps = false;

  constructor(profile?: PradakshinaLoopProfile, options?: { autoConfirmLaps?: boolean }) {
    if (profile) {
      this.profile = profile;
      this.phase = 'TRACKING';
    }
    if (options?.autoConfirmLaps !== undefined) {
      this.autoConfirmLaps = options.autoConfirmLaps;
    }
  }

  setAutoConfirmLaps(enabled: boolean): void {
    this.autoConfirmLaps = enabled;
  }

  isAutoConfirmLaps(): boolean {
    return this.autoConfirmLaps;
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

  getAccumulatedRotationDeg(): number {
    return this.accumulatedRotationDeg;
  }

  isCompassActive(): boolean {
    return this.hasCompass;
  }

  getLapProgress(): number {
    if (!this.profile || this.profile.baselineSteps === 0) {
      return 0;
    }
    return Math.min(1.0, this.currentLapSteps / this.profile.baselineSteps);
  }

  /**
   * Update device magnetic heading (in degrees: 0° to 360°).
   * Tracks continuous angular traversal to verify that the devotee actually
   * completed a 360° closed circuit around the shrine rather than walking straight or roaming.
   */
  updateHeading(headingDeg: number): void {
    this.hasCompass = true;
    if (this.startHeadingDeg === null || this.prevHeadingDeg === null) {
      this.startHeadingDeg = headingDeg;
      this.prevHeadingDeg = headingDeg;
      this.accumulatedRotationDeg = 0;
      return;
    }

    // Shortest angular difference between consecutive heading samples (-180° to +180°)
    const diff = ((headingDeg - this.prevHeadingDeg + 540) % 360) - 180;
    // Reject small step swing micro-jitter (< 3 deg) from phone leg swings
    if (Math.abs(diff) < 3.0) {
      return;
    }
    this.prevHeadingDeg = headingDeg;
    this.accumulatedRotationDeg += diff;
  }

  /**
   * Record a completed lap at the Deity Checkpoint (or when devotee confirms round completion).
   * Increments completed laps, resets lap step accumulator to 0 for next round,
   * and resets circuit heading tracking.
   */
  recordLap(nowMs: number = Date.now()): PradakshinaLapEvent {
    if (this.phase === 'TRACKING') {
      this.completedLaps++;
      this.currentLapSteps = 0;
      this.accumulatedRotationDeg = 0;
      this.prevHeadingDeg = null;
      this.startHeadingDeg = null;
      this.lapStartMs = nowMs;
    }

    return {
      stepDetected: false,
      lapDetected: true,
      lapPacedEstimate: false,
      completedLaps: this.completedLaps,
      currentLapSteps: this.currentLapSteps,
      baselineSteps: this.profile?.baselineSteps ?? this.currentLapSteps,
      lapProgress: this.getLapProgress(),
    };
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
    this.peakMag = 0;
    this.gravityMag = 1.0;
    this.startHeadingDeg = null;
    this.prevHeadingDeg = null;
    this.accumulatedRotationDeg = 0;
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
    this.accumulatedRotationDeg = 0;
    this.prevHeadingDeg = null;
    this.startHeadingDeg = null;
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
    let lapPacedEstimate = false;

    for (let i = 0; i < stepCount; i++) {
      this.currentLapSteps++;

      if (this.phase === 'TRACKING' && this.profile) {
        const timeInLapMs = nowMs - this.lapStartMs;
        const reachedBaseline = this.currentLapSteps >= this.profile.baselineSteps;
        const reachedMinStepsWithTime =
          this.currentLapSteps >= this.profile.minStepsPerLap &&
          timeInLapMs >= this.profile.baselineDurationMs * 0.82;

        // If compass is active, verify that a closed 360° circular traversal was completed
        const reachedClosedLoop =
          !this.hasCompass ||
          Math.abs(this.accumulatedRotationDeg) >= MIN_LOOP_ROTATION_DEG;

        if (reachedBaseline || (reachedMinStepsWithTime && reachedClosedLoop)) {
          lapPacedEstimate = true;

          // Auto-confirm lap only if autoConfirmLaps is enabled and closed loop criteria met
          if (this.autoConfirmLaps && reachedClosedLoop) {
            lapDetected = true;
            this.completedLaps++;
            this.currentLapSteps = 0;
            this.accumulatedRotationDeg = 0;
            this.prevHeadingDeg = null;
            this.startHeadingDeg = null;
            this.lapStartMs = nowMs;
            break; // Lap triggered
          }
        }
      }
    }

    return {
      stepDetected: stepCount > 0,
      lapDetected,
      lapPacedEstimate,
      completedLaps: this.completedLaps,
      currentLapSteps: this.currentLapSteps,
      baselineSteps: this.profile?.baselineSteps ?? this.currentLapSteps,
      lapProgress: this.getLapProgress(),
    };
  }

  /**
   * Process an accelerometer sample to detect human walking steps.
   * Enforces realistic walking biomechanics: requires a dynamic peak (+0.14g),
   * a ground rebound valley (-0.10g), and a minimum total swing of 0.24g,
   * completely rejecting hand motions and micro-movements of a few inches.
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
      this.peakMag = Math.max(this.peakMag, rawMag);
    } else if (this.hasSeenPeak && deviation <= VALLEY_DEVIATION_G) {
      const swing = this.peakMag - rawMag;
      // Require genuine full-body walking swing (>= 0.24g) and cadence interval
      if (swing >= MIN_SWING_G && timeSinceLastStep >= MIN_STEP_INTERVAL_MS) {
        stepDetected = true;
        this.lastStepTimeMs = nowMs;
      }
      this.hasSeenPeak = false;
      this.peakMag = 0;
    }

    if (stepDetected) {
      return this.addSteps(1, nowMs);
    }

    const lapPacedEstimate =
      this.phase === 'TRACKING' &&
      this.profile !== null &&
      this.currentLapSteps >= this.profile.baselineSteps;

    return {
      stepDetected: false,
      lapDetected: false,
      lapPacedEstimate,
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
    this.peakMag = 0;
    this.lastStepTimeMs = 0;
    this.calibrationStartMs = 0;
    this.lapStartMs = 0;
    this.startHeadingDeg = null;
    this.prevHeadingDeg = null;
    this.accumulatedRotationDeg = 0;
    this.currentLapSteps = 0;
    this.completedLaps = 0;
    this.profile = null;
  }
}
