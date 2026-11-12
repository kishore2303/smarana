import { useCallback, useEffect, useReducer, useRef } from 'react';
import { AppState } from 'react-native';
import {
  deleteActiveSession,
  getActiveSession,
  recordCompletedSession,
  saveActiveSession,
} from '../db/database';
import {
  getNativePocketState,
  subscribePocketTapUpdates,
} from '../native/pocketJapa';
import type { PracticeMode } from '../types/practice';
import { countdownReducer } from './countdownEngine';

export function useCountdownSession(mode: PracticeMode) {
  const [session, dispatch] = useReducer(countdownReducer, null);
  const hasHydratedRef = useRef(false);
  const sessionIdRef = useRef<string | null>(null);

  useEffect(() => {
    sessionIdRef.current = session?.id ?? null;
  }, [session?.id]);

  // Restore unfinished session from SQLite and reconcile with native Pocket Mode state
  useEffect(() => {
    let isMounted = true;
    try {
      const saved = getActiveSession(mode);
      if (saved) {
        dispatch({ type: 'RESTORE', payload: saved });
        sessionIdRef.current = saved.id;
        void getNativePocketState().then((pocket) => {
          if (isMounted && pocket && pocket.sessionId === saved.id) {
            dispatch({
              type: 'SYNC_EXTERNAL',
              payload: {
                remainingCount: pocket.remainingCount,
                isPaused: pocket.isPaused,
              },
            });
          }
        });
      }
    } catch {
      // Safe fallback if DB is unavailable
    } finally {
      hasHydratedRef.current = true;
    }
    return () => {
      isMounted = false;
    };
  }, [mode]);

  // Subscribe to real-time updates from the native foreground service
  useEffect(() => {
    const unsubscribe = subscribePocketTapUpdates((event) => {
      if (event.sessionId && event.sessionId === sessionIdRef.current) {
        dispatch({
          type: 'SYNC_EXTERNAL',
          payload: {
            remainingCount: event.remainingCount,
            isPaused: event.isPaused,
          },
        });
      }
    });
    return unsubscribe;
  }, []);

  // Reconcile when returning from background / screen unlock
  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active' && sessionIdRef.current) {
        void getNativePocketState().then((pocket) => {
          if (pocket && pocket.sessionId === sessionIdRef.current) {
            dispatch({
              type: 'SYNC_EXTERNAL',
              payload: {
                remainingCount: pocket.remainingCount,
                isPaused: pocket.isPaused,
              },
            });
          }
        });
      }
    });
    return () => sub.remove();
  }, []);

  // Persist active progress, completed history, or cleared state
  useEffect(() => {
    if (!hasHydratedRef.current) {
      return;
    }

    try {
      if (!session) {
        deleteActiveSession(mode);
      } else if (session.status === 'completed') {
        recordCompletedSession(session);
      } else {
        saveActiveSession(session);
      }
    } catch {
      // Keep UI responsive even if persistence fails
    }
  }, [session, mode]);

  const start = useCallback(
    (label: string, targetCount: number) => {
      const id = `${mode}-${Date.now()}`;
      dispatch({
        type: 'START',
        payload: {
          id,
          mode,
          label,
          targetCount,
        },
      });
    },
    [mode]
  );

  const decrement = useCallback(() => {
    dispatch({ type: 'DECREMENT' });
  }, []);

  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, []);

  const pause = useCallback(() => {
    dispatch({ type: 'PAUSE' });
  }, []);

  const resume = useCallback(() => {
    dispatch({ type: 'RESUME' });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const clear = useCallback(() => {
    dispatch({ type: 'CLEAR' });
  }, []);

  return {
    session,
    start,
    decrement,
    undo,
    pause,
    resume,
    reset,
    clear,
  };
}
