import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { BackTapCalibrationState } from '../engine/useBackTapCalibration';
import { useLanguage } from '../i18n/LanguageContext';
import { colors } from '../theme/colors';

interface LiveCalibrationCardProps {
  calibration: BackTapCalibrationState;
}

const MAX_METER_G = 0.5;

export function LiveCalibrationCard({ calibration }: LiveCalibrationCardProps) {
  const { t } = useLanguage();
  const {
    isRunning,
    status,
    peakImpulseG,
    lastPeakG,
    thresholdG,
    detectedCount,
    start,
    stop,
    resetCounter,
  } = calibration;

  const meterPercent = Math.min(100, (peakImpulseG / MAX_METER_G) * 100);
  const thresholdPercent = Math.min(98, (thresholdG / MAX_METER_G) * 100);
  const meetsThreshold = peakImpulseG >= thresholdG;

  const statusText = (() => {
    switch (status) {
      case 'listening':
        return t.settings.calibrationListening;
      case 'tap1':
        return t.settings.calibrationTap1;
      case 'detected':
        return t.settings.calibrationDetected;
      case 'gyroRejected':
        return t.settings.calibrationGyroRejected;
      case 'unavailable':
        return t.settings.calibrationUnavailable;
      case 'idle':
      default:
        return t.settings.calibrationIdle;
    }
  })();

  const isSuccess = status === 'detected';
  const isWarning = status === 'gyroRejected' || status === 'unavailable';
  const isTap1 = status === 'tap1';

  return (
    <View style={[styles.card, isRunning && styles.cardActive]}>
      <View style={styles.headerRow}>
        <Text style={styles.cardTitle}>{t.settings.calibrationTitle}</Text>
        {isRunning ? (
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveBadgeText}>LIVE</Text>
          </View>
        ) : null}
      </View>

      <Text style={styles.cardDescription}>{t.settings.calibrationDesc}</Text>

      <View
        style={[
          styles.statusBox,
          isSuccess && styles.statusBoxSuccess,
          isWarning && styles.statusBoxWarning,
          isTap1 && styles.statusBoxTap1,
        ]}
      >
        <Text
          style={[
            styles.statusText,
            isSuccess && styles.statusTextSuccess,
            isWarning && styles.statusTextWarning,
            isTap1 && styles.statusTextTap1,
          ]}
        >
          {statusText}
        </Text>
      </View>

      <View style={styles.meterSection}>
        <View style={styles.meterTrack}>
          <View
            style={[
              styles.meterFill,
              {
                width: `${meterPercent}%`,
                backgroundColor: meetsThreshold ? colors.success : colors.gold,
              },
            ]}
          />
          <View
            style={[styles.thresholdMarker, { left: `${thresholdPercent}%` }]}
          />
        </View>
        <View style={styles.meterScaleRow}>
          <Text style={styles.meterScaleText}>0.00g</Text>
          <Text style={styles.meterScaleText}>
            {t.settings.calibrationThreshold}: {thresholdG.toFixed(2)}g
          </Text>
          <Text style={styles.meterScaleText}>{MAX_METER_G.toFixed(2)}g</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>{t.settings.calibrationPeak}</Text>
          <Text style={styles.statValue}>{lastPeakG.toFixed(2)}g</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statLabel}>{t.settings.calibrationThreshold}</Text>
          <Text style={styles.statValue}>{thresholdG.toFixed(2)}g</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statLabel}>
            {t.settings.calibrationDetectedCount}
          </Text>
          <Text style={[styles.statValue, styles.statValueGold]}>
            {detectedCount}
          </Text>
        </View>
      </View>

      <View style={styles.actionsRow}>
        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            isRunning && styles.stopButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={isRunning ? stop : start}
          accessibilityRole="button"
        >
          <Text
            style={[
              styles.primaryButtonText,
              isRunning && styles.stopButtonText,
            ]}
          >
            {isRunning ? t.settings.calibrationStop : t.settings.calibrationStart}
          </Text>
        </Pressable>

        {detectedCount > 0 || lastPeakG > 0 ? (
          <Pressable
            style={({ pressed }) => [
              styles.resetButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={resetCounter}
            accessibilityRole="button"
          >
            <Text style={styles.resetButtonText}>
              {t.settings.calibrationReset}
            </Text>
          </Pressable>
        ) : null}
      </View>

      {isRunning ? (
        <Text style={styles.switchHint}>{t.settings.calibrationSwitchHint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
  },
  cardActive: {
    borderColor: colors.gold,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cardTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.gold,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  liveBadgeText: {
    color: colors.goldSoft,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  cardDescription: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
  statusBox: {
    marginTop: 14,
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  statusBoxSuccess: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.success,
  },
  statusBoxWarning: {
    borderColor: colors.danger,
  },
  statusBoxTap1: {
    borderColor: colors.gold,
  },
  statusText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  statusTextSuccess: {
    color: colors.success,
  },
  statusTextWarning: {
    color: colors.danger,
  },
  statusTextTap1: {
    color: colors.goldSoft,
  },
  meterSection: {
    marginTop: 14,
  },
  meterTrack: {
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  meterFill: {
    height: '100%',
    borderRadius: 6,
  },
  thresholdMarker: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: colors.ivorySoft,
  },
  meterScaleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  meterScaleText: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 2,
  },
  statValue: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  statValueGold: {
    color: colors.goldSoft,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: colors.gold,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopButton: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.gold,
    borderWidth: 1,
  },
  primaryButtonText: {
    color: colors.textOnGold,
    fontSize: 15,
    fontWeight: '700',
  },
  stopButtonText: {
    color: colors.goldSoft,
  },
  resetButton: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '700',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  switchHint: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 10,
    lineHeight: 17,
  },
});
