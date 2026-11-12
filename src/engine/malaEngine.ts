import type { MalaSize } from '../types/practice';

export interface MalaProgress {
  completedMalas: number;
  currentMalaBeads: number;
  beadsPerMala: MalaSize;
  totalCompletedCount: number;
  totalTargetCount: number;
  remainingCount: number;
  ratioInCurrentMala: number;
  isJustCompletedMala: boolean;
  totalMalasInTarget: number;
  extraBeadsInTarget: number;
}

export function computeMalaProgress(params: {
  completedCount: number;
  targetCount: number;
  beadsPerMala: MalaSize;
}): MalaProgress {
  const { completedCount, targetCount, beadsPerMala } = params;
  const clampedCompleted = Math.max(0, Math.min(targetCount, completedCount));
  const remainingCount = Math.max(0, targetCount - clampedCompleted);

  const completedMalas = Math.floor(clampedCompleted / beadsPerMala);
  const currentMalaBeads = clampedCompleted % beadsPerMala;
  const isJustCompletedMala =
    clampedCompleted > 0 && clampedCompleted % beadsPerMala === 0;

  const totalMalasInTarget = Math.floor(targetCount / beadsPerMala);
  const extraBeadsInTarget = targetCount % beadsPerMala;

  // When a Mala is just completed (e.g. 108/108), the ring shows 100% full (1.0)
  // before transitioning to the next Mala on the 109th bead (1/108).
  const ratioInCurrentMala =
    isJustCompletedMala
      ? 1.0
      : currentMalaBeads / beadsPerMala;

  return {
    completedMalas,
    currentMalaBeads,
    beadsPerMala,
    totalCompletedCount: clampedCompleted,
    totalTargetCount: targetCount,
    remainingCount,
    ratioInCurrentMala,
    isJustCompletedMala,
    totalMalasInTarget,
    extraBeadsInTarget,
  };
}
