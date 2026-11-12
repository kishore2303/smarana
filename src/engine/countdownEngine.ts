import type { PracticeMode, PracticeSession } from '../types/practice';

export type CountdownState = PracticeSession | null;

export type CountdownAction =
  | {
      type: 'START';
      payload: {
        id: string;
        mode: PracticeMode;
        label: string;
        targetCount: number;
        startedAt?: string;
      };
    }
  | { type: 'RESTORE'; payload: PracticeSession }
  | { type: 'DECREMENT'; payload?: { completedAt?: string } }
  | {
      type: 'SYNC_EXTERNAL';
      payload: {
        remainingCount: number;
        isPaused?: boolean;
        completedAt?: string;
      };
    }
  | { type: 'UNDO' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'RESET' }
  | { type: 'CLEAR' };

export function createPracticeSession(params: {
  id: string;
  mode: PracticeMode;
  label: string;
  targetCount: number;
  startedAt?: string;
}): PracticeSession {
  const sanitizedTarget = Math.floor(params.targetCount);
  if (!Number.isFinite(sanitizedTarget) || sanitizedTarget < 1) {
    throw new Error('Target count must be a positive integer.');
  }

  return {
    id: params.id,
    mode: params.mode,
    label: params.label.trim(),
    targetCount: sanitizedTarget,
    remainingCount: sanitizedTarget,
    status: 'active',
    startedAt: params.startedAt ?? new Date().toISOString(),
  };
}

export function countdownReducer(
  state: CountdownState,
  action: CountdownAction
): CountdownState {
  switch (action.type) {
    case 'START':
      return createPracticeSession(action.payload);

    case 'RESTORE':
      return action.payload;

    case 'DECREMENT': {
      if (!state || state.status !== 'active' || state.remainingCount <= 0) {
        return state;
      }

      const nextRemaining = Math.max(0, state.remainingCount - 1);
      if (nextRemaining === 0) {
        return {
          ...state,
          remainingCount: 0,
          status: 'completed',
          completedAt: action.payload?.completedAt ?? new Date().toISOString(),
        };
      }

      return {
        ...state,
        remainingCount: nextRemaining,
      };
    }

    case 'SYNC_EXTERNAL': {
      if (!state || state.status === 'completed') {
        return state;
      }
      const clamped = Math.max(
        0,
        Math.min(state.targetCount, Math.floor(action.payload.remainingCount))
      );
      if (clamped === 0) {
        return {
          ...state,
          remainingCount: 0,
          status: 'completed',
          completedAt: action.payload.completedAt ?? new Date().toISOString(),
        };
      }
      const nextStatus =
        action.payload.isPaused === undefined
          ? state.status
          : action.payload.isPaused
            ? 'paused'
            : 'active';

      return {
        ...state,
        remainingCount: clamped,
        status: nextStatus,
      };
    }

    case 'UNDO': {
      if (!state) {
        return state;
      }
      if (state.status !== 'active' && state.status !== 'paused') {
        return state;
      }
      if (state.remainingCount >= state.targetCount) {
        return state;
      }

      return {
        ...state,
        remainingCount: state.remainingCount + 1,
      };
    }

    case 'PAUSE': {
      if (!state || state.status !== 'active') {
        return state;
      }
      return {
        ...state,
        status: 'paused',
      };
    }

    case 'RESUME': {
      if (!state || state.status !== 'paused') {
        return state;
      }
      return {
        ...state,
        status: 'active',
      };
    }

    case 'RESET': {
      if (!state) {
        return state;
      }
      return {
        ...state,
        id: `${state.mode}-${Date.now()}`,
        remainingCount: state.targetCount,
        status: 'active',
        startedAt: new Date().toISOString(),
        completedAt: undefined,
      };
    }

    case 'CLEAR':
      return null;

    default:
      return state;
  }
}
