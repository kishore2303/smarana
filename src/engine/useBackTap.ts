import { useEffect, useRef } from 'react';
import { Accelerometer, Gyroscope } from 'expo-sensors';
import type { BackTapSensitivity } from '../types/practice';
import { BackTapDetector } from './backTapDetector';

interface UseBackTapOptions {
  enabled: boolean;
  sensitivity: BackTapSensitivity;
  onDoubleTap: () => void;
}

const SENSOR_INTERVAL_MS = 10; // 100 Hz sampling to catch brief tap peaks

export function useBackTap({
  enabled,
  sensitivity,
  onDoubleTap,
}: UseBackTapOptions): void {
  const detectorRef = useRef(new BackTapDetector(sensitivity));
  const onDoubleTapRef = useRef(onDoubleTap);

  useEffect(() => {
    onDoubleTapRef.current = onDoubleTap;
  }, [onDoubleTap]);

  useEffect(() => {
    detectorRef.current.setSensitivity(sensitivity);
  }, [sensitivity]);

  useEffect(() => {
    if (!enabled) {
      detectorRef.current.reset();
      return;
    }

    let isMounted = true;
    let gyroSub: { remove: () => void } | null = null;
    detectorRef.current.reset();

    Accelerometer.setUpdateInterval(SENSOR_INTERVAL_MS);
    const accelSub = Accelerometer.addListener((accelData) => {
      if (!isMounted) {
        return;
      }
      const detected = detectorRef.current.processAccelerometer(
        accelData,
        Date.now()
      );
      if (detected) {
        onDoubleTapRef.current();
      }
    });

    void Gyroscope.isAvailableAsync()
      .then((available) => {
        if (!isMounted || !available) {
          return;
        }
        Gyroscope.setUpdateInterval(SENSOR_INTERVAL_MS);
        gyroSub = Gyroscope.addListener((gyroData) => {
          if (!isMounted) {
            return;
          }
          detectorRef.current.updateGyroscope(gyroData);
        });
      })
      .catch(() => {
        // Gyroscope is optional on devices without hardware gyro
      });

    return () => {
      isMounted = false;
      accelSub.remove();
      gyroSub?.remove();
    };
  }, [enabled]);
}
