import test from 'node:test';
import assert from 'node:assert/strict';
import { computeMalaProgress } from './malaEngine.ts';

test('matches roadmap example for 1008 target with 108-bead Mala', () => {
  // Roadmap example: "target of 1008 repetitions: 3 completed Malas, 16/108 current Mala progress and 668 repetitions remaining."
  const completed = 3 * 108 + 16; // 340
  const progress = computeMalaProgress({
    completedCount: completed,
    targetCount: 1008,
    beadsPerMala: 108,
  });

  assert.equal(progress.completedMalas, 3);
  assert.equal(progress.currentMalaBeads, 16);
  assert.equal(progress.remainingCount, 668);
  assert.equal(progress.totalCompletedCount, 340);
  assert.equal(progress.totalTargetCount, 1008);
  assert.equal(progress.totalMalasInTarget, 9);
  assert.equal(progress.extraBeadsInTarget, 36);
  assert.equal(progress.isJustCompletedMala, false);
});

test('handles 108 target exactly at 0, midway, and completion', () => {
  const atStart = computeMalaProgress({
    completedCount: 0,
    targetCount: 108,
    beadsPerMala: 108,
  });
  assert.equal(atStart.completedMalas, 0);
  assert.equal(atStart.currentMalaBeads, 0);
  assert.equal(atStart.remainingCount, 108);
  assert.equal(atStart.ratioInCurrentMala, 0);

  const midway = computeMalaProgress({
    completedCount: 54,
    targetCount: 108,
    beadsPerMala: 108,
  });
  assert.equal(midway.completedMalas, 0);
  assert.equal(midway.currentMalaBeads, 54);
  assert.equal(midway.remainingCount, 54);
  assert.equal(midway.ratioInCurrentMala, 0.5);
  assert.equal(midway.isJustCompletedMala, false);

  const atComplete = computeMalaProgress({
    completedCount: 108,
    targetCount: 108,
    beadsPerMala: 108,
  });
  assert.equal(atComplete.completedMalas, 1);
  assert.equal(atComplete.currentMalaBeads, 0);
  assert.equal(atComplete.remainingCount, 0);
  assert.equal(atComplete.ratioInCurrentMala, 1.0);
  assert.equal(atComplete.isJustCompletedMala, true);
});

test('supports 27-bead Mala mode accurately', () => {
  const progress = computeMalaProgress({
    completedCount: 27,
    targetCount: 108,
    beadsPerMala: 27,
  });

  assert.equal(progress.completedMalas, 1);
  assert.equal(progress.currentMalaBeads, 0);
  assert.equal(progress.remainingCount, 81);
  assert.equal(progress.ratioInCurrentMala, 1.0);
  assert.equal(progress.isJustCompletedMala, true);

  const nextBead = computeMalaProgress({
    completedCount: 28,
    targetCount: 108,
    beadsPerMala: 27,
  });
  assert.equal(nextBead.completedMalas, 1);
  assert.equal(nextBead.currentMalaBeads, 1);
  assert.equal(nextBead.remainingCount, 80);
  assert.equal(nextBead.isJustCompletedMala, false);
});

test('detects successive Mala boundaries across multiple Malas', () => {
  for (let m = 1; m <= 5; m++) {
    const atBoundary = computeMalaProgress({
      completedCount: m * 108,
      targetCount: 1008,
      beadsPerMala: 108,
    });
    assert.equal(atBoundary.completedMalas, m);
    assert.equal(atBoundary.isJustCompletedMala, true);
    assert.equal(atBoundary.ratioInCurrentMala, 1.0);

    const afterBoundary = computeMalaProgress({
      completedCount: m * 108 + 1,
      targetCount: 1008,
      beadsPerMala: 108,
    });
    assert.equal(afterBoundary.completedMalas, m);
    assert.equal(afterBoundary.currentMalaBeads, 1);
    assert.equal(afterBoundary.isJustCompletedMala, false);
  }
});

test('safely clamps completed counts exceeding target', () => {
  const clamped = computeMalaProgress({
    completedCount: 200,
    targetCount: 108,
    beadsPerMala: 108,
  });
  assert.equal(clamped.totalCompletedCount, 108);
  assert.equal(clamped.remainingCount, 0);
  assert.equal(clamped.completedMalas, 1);
  assert.equal(clamped.ratioInCurrentMala, 1.0);
});
