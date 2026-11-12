import type { BackTapSensitivity } from '../types/practice';

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface SensitivityConfig {
  impulseThresholdG: number;
  minJerkG: number;
  maxGyroRadPerSec: number;
}

export type DetectorPhase = 'IDLE' | 'TAP1_ACTIVE' | 'WAIT_TAP2';

export interface TapCalibrationSnapshot {
  linearImpulseG: number;
  jerkG: number;
  gyroMagRadPerSec: number;
  thresholdG: number;
  minJerkG: number;
  maxGyroRadPerSec: number;
  phase: DetectorPhase;
  detected: boolean;
  rejectedByGyro: boolean;
}

/**
 * Sensitivity presets tuned for Samsung Galaxy back-taps (glass/plastic backs
 * and protective cases) across upright, tilted, and flat orientations.
 */
const SENSITIVITY_CONFIG: Record<BackTapSensitivity, SensitivityConfig> = {
  low: {
    impulseThresholdG: 0.34, // Firm tap; strict walking rejection
    minJerkG: 0.21,
    maxGyroRadPerSec: 2.5,
  },
  medium: {
    impulseThresholdG: 0.2, // Balanced Samsung default (works through cases)
    minJerkG: 0.115,
    maxGyroRadPerSec: 3.1,
  },
  high: {
    impulseThresholdG: 0.13, // Light tap for seated Japa
    minJerkG: 0.105,
    maxGyroRadPerSec: 3.8,
  },
};

const GRAVITY_ALPHA_QUIET = 0.88;
const GRAVITY_ALPHA_SPIKE = 0.96; // Slow adaptation during tap spikes so orientation changes never lock
const GRAVITY_ALPHA_ROTATING = 0.7; // Fast tracking when phone rotates
const MAX_TAP_DURATION_MS = 115; // Accommodates Samsung chassis/case ring-down
const MIN_TAP_GAP_MS = 90; // Minimum time between tap 1 and tap 2
const MAX_DOUBLE_TAP_WINDOW_MS = 650; // Maximum time between tap 1 and tap 2
const COOLDOWN_MS = 500;

export function getSensitivityConfig(
  sensitivity: BackTapSensitivity
): SensitivityConfig {
  return SENSITIVITY_CONFIG[sensitivity];
}

/**
 * Pure 3-axis accelerometer + gyroscope double-tap detector.
 * Uses per-axis gravity tracking so back-of-phone Z-axis taps are detected
 * cleanly even when the phone is held upright or carried vertically in a pocket.
 */
export class BackTapDetector {
  private gravity: Vector3D | null = null;
  private prevSample: Vector3D | null = null;
  private phase: DetectorPhase = 'IDLE';
  private tap1StartMs = 0;
  private cooldownUntilMs = 0;
  private latestGyroMag = 0;
  private sensitivity: BackTapSensitivity;

  constructor(sensitivity: BackTapSensitivity = 'medium') {
    this.sensitivity = sensitivity;
  }

  setSensitivity(sensitivity: BackTapSensitivity): void {
    this.sensitivity = sensitivity;
  }

  getConfig(): SensitivityConfig {
    return SENSITIVITY_CONFIG[this.sensitivity];
  }

  reset(): void {
    this.gravity = null;
    this.prevSample = null;
    this.phase = 'IDLE';
    this.tap1StartMs = 0;
    this.cooldownUntilMs = 0;
    this.latestGyroMag = 0;
  }

  updateGyroscope(sample: Vector3D): void {
    this.latestGyroMag = Math.sqrt(
      sample.x * sample.x + sample.y * sample.y + sample.z * sample.z
    );
  }

  /**
   * Processes one accelerometer sample (in g units).
   * Returns true when a valid double-tap gesture is recognized.
   */
  processAccelerometer(sample: Vector3D, timestampMs: number): boolean {
    return this.processAccelerometerWithSnapshot(sample, timestampMs).detected;
  }

  /**
   * Processes one accelerometer sample (in g units) and returns detailed
   * telemetry for live calibration UI without duplicating detection logic.
   */
  processAccelerometerWithSnapshot(
    sample: Vector3D,
    timestampMs: number
  ): TapCalibrationSnapshot {
    const config = SENSITIVITY_CONFIG[this.sensitivity];

    if (this.gravity === null || this.prevSample === null) {
      this.gravity = { x: sample.x, y: sample.y, z: sample.z };
      this.prevSample = { x: sample.x, y: sample.y, z: sample.z };
      return {
        linearImpulseG: 0,
        jerkG: 0,
        gyroMagRadPerSec: this.latestGyroMag,
        thresholdG: config.impulseThresholdG,
        minJerkG: config.minJerkG,
        maxGyroRadPerSec: config.maxGyroRadPerSec,
        phase: this.phase,
        detected: false,
        rejectedByGyro: false,
      };
    }

    const dx = sample.x - this.gravity.x;
    const dy = sample.y - this.gravity.y;
    const dz = sample.z - this.gravity.z;
    const linearImpulse = Math.sqrt(dx * dx + dy * dy + dz * dz);

    const jx = sample.x - this.prevSample.x;
    const jy = sample.y - this.prevSample.y;
    const jz = sample.z - this.prevSample.z;
    const jerk = Math.sqrt(jx * jx + jy * jy + jz * jz);
    this.prevSample = { x: sample.x, y: sample.y, z: sample.z };

    const isRotating = this.latestGyroMag > config.maxGyroRadPerSec;
    const alpha = isRotating
      ? GRAVITY_ALPHA_ROTATING
      : linearImpulse < config.impulseThresholdG * 0.7
        ? GRAVITY_ALPHA_QUIET
        : GRAVITY_ALPHA_SPIKE;

    this.gravity = {
      x: alpha * this.gravity.x + (1 - alpha) * sample.x,
      y: alpha * this.gravity.y + (1 - alpha) * sample.y,
      z: alpha * this.gravity.z + (1 - alpha) * sample.z,
    };

    const buildSnapshot = (
      detected: boolean,
      rejectedByGyro = false
    ): TapCalibrationSnapshot => ({
      linearImpulseG: linearImpulse,
      jerkG: jerk,
      gyroMagRadPerSec: this.latestGyroMag,
      thresholdG: config.impulseThresholdG,
      minJerkG: config.minJerkG,
      maxGyroRadPerSec: config.maxGyroRadPerSec,
      phase: this.phase,
      detected,
      rejectedByGyro,
    });

    if (timestampMs < this.cooldownUntilMs) {
      this.phase = 'IDLE';
      return buildSnapshot(false);
    }

    // Reject motion during phone rotation/shaking
    if (isRotating) {
      this.phase = 'IDLE';
      return buildSnapshot(false, true);
    }

    const isQuiet = linearImpulse < config.impulseThresholdG * 0.45;
    const isSharpPeak =
      linearImpulse >= config.impulseThresholdG && jerk >= config.minJerkG;

    switch (this.phase) {
      case 'IDLE': {
        if (isSharpPeak) {
          this.phase = 'TAP1_ACTIVE';
          this.tap1StartMs = timestampMs;
        }
        return buildSnapshot(false);
      }

      case 'TAP1_ACTIVE': {
        if (timestampMs - this.tap1StartMs > MAX_TAP_DURATION_MS) {
          // Sustained acceleration (walking/movement), not a sharp tap
          this.phase = 'IDLE';
          return buildSnapshot(false);
        }
        if (isQuiet) {
          this.phase = 'WAIT_TAP2';
        }
        return buildSnapshot(false);
      }

      case 'WAIT_TAP2': {
        const elapsed = timestampMs - this.tap1StartMs;
        if (elapsed > MAX_DOUBLE_TAP_WINDOW_MS) {
          this.phase = isSharpPeak ? 'TAP1_ACTIVE' : 'IDLE';
          if (isSharpPeak) {
            this.tap1StartMs = timestampMs;
          }
          return buildSnapshot(false);
        }

        if (elapsed >= MIN_TAP_GAP_MS && isSharpPeak) {
          this.phase = 'IDLE';
          this.cooldownUntilMs = timestampMs + COOLDOWN_MS;
          return buildSnapshot(true);
        }
        return buildSnapshot(false);
      }
    }
  }
}
