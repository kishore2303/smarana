import { useCallback, useEffect, useRef, useState } from 'react';
import { Accelerometer, Magnetometer } from 'expo-sensors';
import * as Haptics from 'expo-haptics';
import {
  CalibrationResult,
  PradakshinaLapEvent,
  PradakshinaLoopDetector,
  PradakshinaLoopProfile,
  PradakshinaPhase,
} from './pradakshinaLoopDetector';

interface UsePradakshinaLoopOptions {
  enabled: boolean;
  isPaused?: boolean;
  autoConfirm?: boolean;
  onLapDetected: () => void;
}

const ACCEL_INTERVAL_MS = 40; // 25 Hz is optimal & battery-efficient for human walking cadence

export function usePradakshinaLoop({
  enabled,
  isPaused = false,
  autoConfirm = false,
  onLapDetected,
}: UsePradakshinaLoopOptions) {
  const detectorRef = useRef(
    new PradakshinaLoopDetector(undefined, { autoConfirmLaps: autoConfirm })
  );
  const onLapDetectedRef = useRef(onLapDetected);
  const hasNotifiedPaceRef = useRef(false);

  const [phase, setPhase] = useState<PradakshinaPhase>('IDLE');
  const [profile, setProfile] = useState<PradakshinaLoopProfile | null>(null);
  const [currentLapSteps, setCurrentLapSteps] = useState(0);
  const [lapProgress, setLapProgress] = useState(0);
  const [completedLaps, setCompletedLaps] = useState(0);
  const [isLapPacedReady, setIsLapPacedReady] = useState(false);

  useEffect(() => {
    onLapDetectedRef.current = onLapDetected;
  }, [onLapDetected]);

  useEffect(() => {
    detectorRef.current.setAutoConfirmLaps(autoConfirm);
  }, [autoConfirm]);

  const triggerLapFeedback = useCallback(() => {
    // Distinct double-buzz pattern for pocket feedback
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setTimeout(() => {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
    }, 250);
  }, []);

  const handleLapEvent = useCallback(
    (event: PradakshinaLapEvent) => {
      setCurrentLapSteps(event.currentLapSteps);
      setLapProgress(event.lapProgress);
      setCompletedLaps(event.completedLaps);
      setIsLapPacedReady(event.lapPacedEstimate);

      if (event.stepDetected && detectorRef.current.getPhase() === 'CALIBRATING') {
        // Subtle tick indicating step counted
        void Haptics.selectionAsync().catch(() => {});
      }

      if (event.lapPacedEstimate && !hasNotifiedPaceRef.current) {
        hasNotifiedPaceRef.current = true;
        // Paced haptic pulse indicating round distance reached
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      } else if (!event.lapPacedEstimate) {
        hasNotifiedPaceRef.current = false;
      }

      if (event.lapDetected) {
        hasNotifiedPaceRef.current = false;
        setIsLapPacedReady(false);
        triggerLapFeedback();
        onLapDetectedRef.current();
      }
    },
    [triggerLapFeedback]
  );

  const recordLap = useCallback(() => {
    const event = detectorRef.current.recordLap();
    setCurrentLapSteps(event.currentLapSteps);
    setLapProgress(event.lapProgress);
    setCompletedLaps(event.completedLaps);
    setIsLapPacedReady(false);
    hasNotifiedPaceRef.current = false;
    triggerLapFeedback();
  }, [triggerLapFeedback]);

  const adjustSteps = useCallback((delta: number) => {
    const updated = detectorRef.current.adjustSteps(delta);
    setCurrentLapSteps(updated);
    setLapProgress(detectorRef.current.getLapProgress());
    void Haptics.selectionAsync().catch(() => {});
  }, []);

  const setSteps = useCallback((steps: number) => {
    detectorRef.current.setSteps(steps);
    setCurrentLapSteps(steps);
    setLapProgress(detectorRef.current.getLapProgress());
  }, []);

  const startCalibration = useCallback(() => {
    detectorRef.current.startCalibration();
    setPhase('CALIBRATING');
    setProfile(null);
    setCurrentLapSteps(0);
    setLapProgress(0);
    setCompletedLaps(0);
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
  }, []);

  const completeCalibration = useCallback((): CalibrationResult => {
    const result = detectorRef.current.completeCalibration();
    if (result.success && result.profile) {
      setProfile(result.profile);
      setPhase('TRACKING');
      setCurrentLapSteps(0);
      setLapProgress(0);
      setCompletedLaps(1);
      triggerLapFeedback();
      onLapDetectedRef.current(); // Count 1st round as completed!
    } else {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
    }
    return result;
  }, [triggerLapFeedback, onLapDetectedRef]);

  const reset = useCallback(() => {
    detectorRef.current.reset();
    setPhase('IDLE');
    setProfile(null);
    setCurrentLapSteps(0);
    setLapProgress(0);
    setCompletedLaps(0);
    setIsLapPacedReady(false);
    hasNotifiedPaceRef.current = false;
  }, []);

  // Sensor listener loop
  useEffect(() => {
    if (!enabled || isPaused) {
      return;
    }

    let isMounted = true;
    Accelerometer.setUpdateInterval(ACCEL_INTERVAL_MS);

    const sub = Accelerometer.addListener((accelData) => {
      if (!isMounted) return;
      const event = detectorRef.current.updateAccelerometer(accelData, Date.now());
      handleLapEvent(event);
    });

    return () => {
      isMounted = false;
      sub.remove();
    };
  }, [enabled, isPaused, handleLapEvent]);

  // Magnetometer listener for authentic 360° closed loop tracking
  useEffect(() => {
    if (!enabled || isPaused) {
      return;
    }

    let isMounted = true;
    let magSub: { remove: () => void } | null = null;

    void Magnetometer.isAvailableAsync()
      .then((available) => {
        if (!isMounted || !available) return;
        Magnetometer.setUpdateInterval(100); // 10 Hz is optimal for heading tracking
        magSub = Magnetometer.addListener((data) => {
          if (!isMounted) return;
          let angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
          if (angle < 0) {
            angle += 360;
          }
          detectorRef.current.updateHeading(angle);
        });
      })
      .catch(() => {});

    return () => {
      isMounted = false;
      magSub?.remove();
    };
  }, [enabled, isPaused]);

  return {
    phase,
    profile,
    currentLapSteps,
    lapProgress,
    completedLaps,
    isLapPacedReady,
    startCalibration,
    completeCalibration,
    recordLap,
    adjustSteps,
    setSteps,
    reset,
  };
}
