import test from 'node:test';
import assert from 'node:assert/strict';
import { PradakshinaLoopDetector } from './pradakshinaLoopDetector.ts';

test('PradakshinaLoopDetector - handles calibration flow', () => {
  const detector = new PradakshinaLoopDetector();
  assert.equal(detector.getPhase(), 'IDLE');

  detector.startCalibration(1000);
  assert.equal(detector.getPhase(), 'CALIBRATING');

  // Attempt to complete with too few steps
  detector.addSteps(5, 5000);
  const failResult = detector.completeCalibration(6000);
  assert.equal(failResult.success, false);
  assert.equal(failResult.error, 'TOO_FEW_STEPS');
  assert.equal(detector.getPhase(), 'CALIBRATING');

  // Add more steps to reach 50 steps
  detector.addSteps(45, 35000);
  assert.equal(detector.getCurrentLapSteps(), 50);

  // Complete calibration
  const successResult = detector.completeCalibration(40000);
  assert.equal(successResult.success, true);
  assert.ok(successResult.profile);
  assert.equal(successResult.profile.baselineSteps, 50);
  assert.equal(successResult.profile.minStepsPerLap, 42); // 50 * 0.85 = 42
  assert.equal(detector.getPhase(), 'TRACKING');
  assert.equal(detector.getCompletedLaps(), 1); // Round 1 marked complete
  assert.equal(detector.getCurrentLapSteps(), 0); // Ready for Round 2
});

test('PradakshinaLoopDetector - detects subsequent auto laps based on step baseline', () => {
  const detector = new PradakshinaLoopDetector();
  detector.startCalibration(1000);
  detector.addSteps(60, 45000);
  detector.completeCalibration(45000);

  assert.equal(detector.getCompletedLaps(), 1);

  // Walk 30 steps of Round 2 (not finished yet)
  let event = detector.addSteps(30, 60000);
  assert.equal(event.lapDetected, false);
  assert.equal(detector.getCurrentLapSteps(), 30);
  assert.equal(detector.getLapProgress(), 0.5); // 30/60 = 50%

  // Walk remaining 30 steps of Round 2
  event = detector.addSteps(30, 85000);
  assert.equal(event.lapDetected, true);
  assert.equal(event.completedLaps, 2);
  assert.equal(detector.getCurrentLapSteps(), 0); // Reset for Round 3

  // Walk Round 3
  event = detector.addSteps(60, 125000);
  assert.equal(event.lapDetected, true);
  assert.equal(event.completedLaps, 3);
  assert.equal(detector.getCurrentLapSteps(), 0);
});

test('PradakshinaLoopDetector - detects steps from accelerometer sinusoidal walking samples', () => {
  const detector = new PradakshinaLoopDetector();
  detector.startCalibration(0);

  let nowMs = 1000;
  // Simulate 12 footsteps: each footstep is a peak (1.25g) followed by valley (0.85g) separated by 500ms
  for (let step = 0; step < 12; step++) {
    // Peak
    detector.updateAccelerometer({ x: 0.1, y: 0.1, z: 1.25 }, nowMs);
    nowMs += 100;
    // Valley
    detector.updateAccelerometer({ x: 0.1, y: 0.1, z: 0.85 }, nowMs);
    nowMs += 400; // Total 500ms per step
  }

  assert.equal(detector.getCurrentLapSteps(), 12);

  // Successfully complete calibration with the 12 accelerometer detected steps
  const result = detector.completeCalibration(nowMs);
  assert.equal(result.success, true);
  assert.equal(result.profile?.baselineSteps, 12);
});

test('PradakshinaLoopDetector - handles delayed start and gentle temple walking without lockout', () => {
  const detector = new PradakshinaLoopDetector();
  detector.startCalibration(1000);

  // User waits 5 seconds before taking first step
  let nowMs = 6000;
  // Walk 15 gentle footsteps: small peak (1.06g) and small valley (0.95g)
  for (let step = 0; step < 15; step++) {
    detector.updateAccelerometer({ x: 0.05, y: 0.1, z: 1.06 }, nowMs);
    nowMs += 200;
    detector.updateAccelerometer({ x: 0.05, y: 0.1, z: 0.95 }, nowMs);
    nowMs += 450; // total 650ms per step
  }

  // Steps should be detected despite delayed start and gentle movements
  assert.ok(detector.getCurrentLapSteps() >= 14, `Expected at least 14 steps, got ${detector.getCurrentLapSteps()}`);

  // Test manual step adjustment
  detector.adjustSteps(3);
  assert.ok(detector.getCurrentLapSteps() >= 17);
  detector.adjustSteps(-2);
  assert.ok(detector.getCurrentLapSteps() >= 15);

  // Pausing in middle: pause 8 seconds
  nowMs += 8000;
  for (let step = 0; step < 5; step++) {
    detector.updateAccelerometer({ x: 0.05, y: 0.1, z: 1.08 }, nowMs);
    nowMs += 200;
    detector.updateAccelerometer({ x: 0.05, y: 0.1, z: 0.94 }, nowMs);
    nowMs += 400;
  }
  assert.ok(detector.getCurrentLapSteps() >= 20);

  // Calibration succeeds
  const calResult = detector.completeCalibration(nowMs);
  assert.equal(calResult.success, true);
});

test('PradakshinaLoopDetector - supports reset', () => {
  const detector = new PradakshinaLoopDetector();
  detector.startCalibration(1000);
  detector.addSteps(25, 20000);
  detector.completeCalibration(20000);

  assert.equal(detector.getPhase(), 'TRACKING');
  detector.reset();
  assert.equal(detector.getPhase(), 'IDLE');
  assert.equal(detector.getCompletedLaps(), 0);
  assert.equal(detector.getCurrentLapSteps(), 0);
  assert.equal(detector.getProfile(), null);
});
