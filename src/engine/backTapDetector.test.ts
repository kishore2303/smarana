import test from 'node:test';
import assert from 'node:assert/strict';
import { BackTapDetector } from './backTapDetector.ts';

const REST = { x: 0, y: 0, z: 1.0 };
const NORMAL_TAP = { x: 0, y: 0, z: 1.38 }; // ~0.38g crisp finger tap

test('detects a clean double-tap with quiet valley between taps', () => {
  const detector = new BackTapDetector('medium');

  assert.equal(detector.processAccelerometer(REST, 0), false);
  assert.equal(detector.processAccelerometer(REST, 10), false);

  // Tap 1 spike + settle back to rest within 40ms
  assert.equal(detector.processAccelerometer(NORMAL_TAP, 100), false);
  assert.equal(detector.processAccelerometer(REST, 130), false);
  assert.equal(detector.processAccelerometer(REST, 180), false);

  // Tap 2 spike 180ms after Tap 1
  assert.equal(detector.processAccelerometer(NORMAL_TAP, 280), true);
});

test('detects Samsung back-taps when phone is upright in hand or pocket', () => {
  const detector = new BackTapDetector('medium');
  const uprightRest = { x: 0.08, y: -0.98, z: 0.06 };
  // ~0.22g Z-axis tap perpendicular to gravity (would have been <0.03g scalar)
  const uprightBackTap = { x: 0.08, y: -0.98, z: 0.28 };

  assert.equal(detector.processAccelerometer(uprightRest, 0), false);
  assert.equal(detector.processAccelerometer(uprightRest, 10), false);

  // Tap 1 + negative chassis rebound + settle inside 115ms
  assert.equal(detector.processAccelerometer(uprightBackTap, 100), false);
  assert.equal(
    detector.processAccelerometer({ x: 0.08, y: -0.98, z: -0.05 }, 115),
    false
  );
  assert.equal(detector.processAccelerometer(uprightRest, 150), false);

  // Tap 2 ~210ms after Tap 1
  assert.equal(detector.processAccelerometer(uprightBackTap, 310), true);
});

test('tolerates Samsung case ring-down up to 110ms and rebound', () => {
  const detector = new BackTapDetector('medium');
  const uprightRest = { x: 0, y: -1.0, z: 0 };
  detector.processAccelerometer(uprightRest, 0);

  // Tap 1 with ring-down settling at +100ms
  assert.equal(
    detector.processAccelerometer({ x: 0, y: -1.0, z: 0.24 }, 100),
    false
  );
  assert.equal(
    detector.processAccelerometer({ x: 0, y: -1.0, z: -0.12 }, 125),
    false
  );
  assert.equal(
    detector.processAccelerometer({ x: 0, y: -1.0, z: 0.05 }, 200),
    false
  );

  // Tap 2 at +280ms
  assert.equal(
    detector.processAccelerometer({ x: 0, y: -1.0, z: 0.23 }, 380),
    true
  );
});

test('recovers cleanly after phone orientation changes', () => {
  const detector = new BackTapDetector('medium');
  detector.processAccelerometer(REST, 0);

  // Simulate rotating phone from flat (z=1) to upright (y=-1) with gyro active
  detector.updateGyroscope({ x: 3.6, y: 0, z: 0 });
  const upright = { x: 0, y: -1.0, z: 0 };
  for (let t = 20; t <= 200; t += 20) {
    assert.equal(detector.processAccelerometer(upright, t), false);
  }

  // Stop rotating and double-tap the back in the new upright orientation
  detector.updateGyroscope({ x: 0.1, y: 0, z: 0 });
  assert.equal(detector.processAccelerometer(upright, 250), false);
  assert.equal(
    detector.processAccelerometer({ x: 0, y: -1.0, z: 0.24 }, 300),
    false
  );
  assert.equal(detector.processAccelerometer(upright, 340), false);
  assert.equal(
    detector.processAccelerometer({ x: 0, y: -1.0, z: 0.24 }, 500),
    true
  );
});

test('rejects smooth walking / hand-swing movement waves across sensitivities', () => {
  const walkSamples = [
    [10, 1.08],
    [20, 1.18],
    [30, 1.28],
    [40, 1.38],
    [50, 1.42],
    [60, 1.4],
    [70, 1.36],
    [80, 1.32],
    [90, 1.28],
    [100, 1.25],
    [110, 1.22],
    [120, 1.15],
    [130, 1.05],
    [140, 1.0],
    [250, 1.38],
  ] as const;

  for (const sensitivity of ['low', 'medium', 'high'] as const) {
    const detector = new BackTapDetector(sensitivity);
    detector.processAccelerometer(REST, 0);

    for (const [t, z] of walkSamples) {
      assert.equal(
        detector.processAccelerometer({ x: 0, y: 0, z }, t),
        false
      );
    }
  }
});

test('ignores single-tap ring-down within 90ms', () => {
  const detector = new BackTapDetector('medium');
  detector.processAccelerometer(REST, 0);

  assert.equal(detector.processAccelerometer(NORMAL_TAP, 100), false);
  assert.equal(detector.processAccelerometer(REST, 120), false);
  // Bounce 50ms after tap 1 must not trigger
  assert.equal(detector.processAccelerometer(NORMAL_TAP, 150), false);
});

test('rejects taps when gyroscope indicates heavy rotation or shaking', () => {
  const detector = new BackTapDetector('medium');
  detector.processAccelerometer(REST, 0);

  detector.updateGyroscope({ x: 3.5, y: 0, z: 0 });
  const snap1 = detector.processAccelerometerWithSnapshot(NORMAL_TAP, 100);
  assert.equal(snap1.detected, false);
  assert.equal(snap1.rejectedByGyro, true);

  assert.equal(detector.processAccelerometer(REST, 130), false);
  assert.equal(detector.processAccelerometer(NORMAL_TAP, 280), false);
});

test('enforces cooldown so a triple-tap counts only once', () => {
  const detector = new BackTapDetector('medium');
  detector.processAccelerometer(REST, 0);

  assert.equal(detector.processAccelerometer(NORMAL_TAP, 100), false);
  assert.equal(detector.processAccelerometer(REST, 130), false);
  assert.equal(detector.processAccelerometer(NORMAL_TAP, 280), true);

  // Third tap inside 500ms cooldown must be ignored
  assert.equal(detector.processAccelerometer(REST, 320), false);
  assert.equal(detector.processAccelerometer(NORMAL_TAP, 480), false);
});

test('respects low vs high sensitivity thresholds', () => {
  const lightTap = { x: 0, y: 0, z: 1.25 }; // ~0.25g light tap

  const lowDetector = new BackTapDetector('low');
  lowDetector.processAccelerometer(REST, 0);
  assert.equal(lowDetector.processAccelerometer(lightTap, 100), false);
  assert.equal(lowDetector.processAccelerometer(REST, 130), false);
  assert.equal(lowDetector.processAccelerometer(lightTap, 280), false);

  const highDetector = new BackTapDetector('high');
  highDetector.processAccelerometer(REST, 0);
  assert.equal(highDetector.processAccelerometer(lightTap, 100), false);
  assert.equal(highDetector.processAccelerometer(REST, 130), false);
  assert.equal(highDetector.processAccelerometer(lightTap, 280), true);
});

test('exposes calibration snapshot telemetry', () => {
  const detector = new BackTapDetector('medium');
  const initSnap = detector.processAccelerometerWithSnapshot(REST, 0);
  assert.equal(initSnap.phase, 'IDLE');
  assert.equal(initSnap.thresholdG, 0.2);

  const tap1Snap = detector.processAccelerometerWithSnapshot(
    { x: 0, y: 0, z: 1.24 },
    100
  );
  assert.ok(tap1Snap.linearImpulseG >= 0.23);
  assert.equal(tap1Snap.phase, 'TAP1_ACTIVE');
  assert.equal(tap1Snap.detected, false);

  const quietSnap = detector.processAccelerometerWithSnapshot(REST, 130);
  assert.equal(quietSnap.phase, 'WAIT_TAP2');

  const tap2Snap = detector.processAccelerometerWithSnapshot(
    { x: 0, y: 0, z: 1.24 },
    280
  );
  assert.equal(tap2Snap.detected, true);
});
