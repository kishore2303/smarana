import { useCallback, useEffect, useRef, useState } from 'react';
import { Accelerometer, Gyroscope } from 'expo-sensors';
import type { BackTapSensitivity } from '../types/practice';
import { triggerCountHaptic } from '../utils/haptics';
import {
  BackTapDetector,
  getSensitivityConfig,
  type DetectorPhase,
} from './backTapDetector';

export type CalibrationStatus =
  | 'idle'
  | 'listening'
  | 'tap1'
  | 'detected'
  | 'gyroRejected'
  | 'unavailable';

export interface BackTapCalibrationState {
  isRunning: boolean;
  status: CalibrationStatus;
  peakImpulseG: number;
  lastPeakG: number;
  thresholdG: number;
  detectedCount: number;
  start: () => void;
  stop: () => void;
  resetCounter: () => void;
}

const SENSOR_INTERVAL_MS = 10;
const UI_REFRESH_INTERVAL_MS = 75;
const STATUS_HOLD_MS = 1100;
const PEAK_HOLD_MS = 1400;

export function useBackTapCalibration(
  sensitivity: BackTapSensitivity
): BackTapCalibrationState {
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState<CalibrationStatus>('idle');
  const [peakImpulseG, setPeakImpulseG] = useState(0);
  const [lastPeakG, setLastPeakG] = useState(0);
  const [detectedCount, setDetectedCount] = useState(0);

  const detectorRef = useRef(new BackTapDetector(sensitivity));
  const livePeakRef = useRef(0);
  const recentPeakRef = useRef(0);
  const recentPeakAtRef = useRef(0);
  const statusHoldUntilRef = useRef(0);
  const stickyStatusRef = useRef<CalibrationStatus>('listening');
  const phaseRef = useRef<DetectorPhase>('IDLE');

  const thresholdG = getSensitivityConfig(sensitivity).impulseThresholdG;

  useEffect(() => {
    detectorRef.current.setSensitivity(sensitivity);
  }, [sensitivity]);

  const stop = useCallback(() => {
    setIsRunning(false);
    detectorRef.current.reset();
    livePeakRef.current = 0;
    recentPeakRef.current = 0;
    phaseRef.current = 'IDLE';
    setPeakImpulseG(0);
    setStatus((prev) => (prev === 'unavailable' ? 'unavailable' : 'idle'));
  }, []);

  const start = useCallback(() => {
    livePeakRef.current = 0;
    recentPeakRef.current = 0;
    recentPeakAtRef.current = 0;
    statusHoldUntilRef.current = 0;
    stickyStatusRef.current = 'listening';
    phaseRef.current = 'IDLE';
    setPeakImpulseG(0);
    setLastPeakG(0);
    setStatus('listening');
    setIsRunning(true);
  }, []);

  const resetCounter = useCallback(() => {
    setDetectedCount(0);
    setLastPeakG(0);
    recentPeakRef.current = 0;
  }, []);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    let isMounted = true;
    let accelSub: { remove: () => void } | null = null;
    let gyroSub: { remove: () => void } | null = null;
    let uiTimer: ReturnType<typeof setInterval> | null = null;

    detectorRef.current.reset();

    const beginListening = async () => {
      try {
        const accelAvailable = await Accelerometer.isAvailableAsync();
        if (!isMounted) {
          return;
        }
        if (!accelAvailable) {
          setStatus('unavailable');
          setIsRunning(false);
          return;
        }

        Accelerometer.setUpdateInterval(SENSOR_INTERVAL_MS);
        accelSub = Accelerometer.addListener((accelData) => {
          if (!isMounted) {
            return;
          }
          const now = Date.now();
          const snap = detectorRef.current.processAccelerometerWithSnapshot(
            accelData,
            now
          );
          phaseRef.current = snap.phase;

          if (snap.linearImpulseG > livePeakRef.current) {
            livePeakRef.current = snap.linearImpulseG;
          }

          if (
            snap.linearImpulseG >= 0.05 &&
            (now - recentPeakAtRef.current > PEAK_HOLD_MS ||
              snap.linearImpulseG > recentPeakRef.current)
          ) {
            recentPeakRef.current = snap.linearImpulseG;
            recentPeakAtRef.current = now;
          }

          if (snap.detected) {
            setDetectedCount((prev) => prev + 1);
            void triggerCountHaptic();
            stickyStatusRef.current = 'detected';
            statusHoldUntilRef.current = now + STATUS_HOLD_MS;
            setStatus('detected');
          } else if (
            snap.rejectedByGyro &&
            snap.linearImpulseG >= snap.thresholdG * 0.6
          ) {
            stickyStatusRef.current = 'gyroRejected';
            statusHoldUntilRef.current = now + STATUS_HOLD_MS;
            setStatus('gyroRejected');
          } else if (
            snap.phase === 'WAIT_TAP2' &&
            now >= statusHoldUntilRef.current
          ) {
            setStatus('tap1');
          }
        });

        try {
          const gyroAvailable = await Gyroscope.isAvailableAsync();
          if (isMounted && gyroAvailable) {
            Gyroscope.setUpdateInterval(SENSOR_INTERVAL_MS);
            gyroSub = Gyroscope.addListener((gyroData) => {
              if (!isMounted) {
                return;
              }
              detectorRef.current.updateGyroscope(gyroData);
            });
          }
        } catch {
          // Gyroscope is optional on budget devices
        }

        uiTimer = setInterval(() => {
          if (!isMounted) {
            return;
          }
          const now = Date.now();
          livePeakRef.current =
            livePeakRef.current < 0.008 ? 0 : livePeakRef.current * 0.78;
          setPeakImpulseG(livePeakRef.current);
          setLastPeakG(recentPeakRef.current);

          if (now >= statusHoldUntilRef.current) {
            setStatus(phaseRef.current === 'WAIT_TAP2' ? 'tap1' : 'listening');
          } else {
            setStatus(stickyStatusRef.current);
          }
        }, UI_REFRESH_INTERVAL_MS);
      } catch {
        if (isMounted) {
          setStatus('unavailable');
          setIsRunning(false);
        }
      }
    };

    void beginListening();

    return () => {
      isMounted = false;
      accelSub?.remove();
      gyroSub?.remove();
      if (uiTimer !== null) {
        clearInterval(uiTimer);
      }
      detectorRef.current.reset();
    };
  }, [isRunning]);

  return {
    isRunning,
    status,
    peakImpulseG,
    lastPeakG,
    thresholdG,
    detectedCount,
    start,
    stop,
    resetCounter,
  };
}
