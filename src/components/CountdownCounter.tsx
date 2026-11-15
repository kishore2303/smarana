import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  BackHandler,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HeaderBackButton } from './HeaderBackButton';
import { FontSizeControl, ReadingFontSize } from './FontSizeControl';
import { MalaProgressRing } from './MalaProgressRing';
import { getAppSettings } from '../db/database';
import { computeMalaProgress } from '../engine/malaEngine';
import { useBackTap } from '../engine/useBackTap';
import { useLanguage } from '../i18n/LanguageContext';
import { getTabBarStyle } from '../navigation/tabBarStyle';
import type { RootTabParamList } from '../navigation/types';
import {
  getNativePocketState,
  isPocketModeSupported,
  pauseNativePocketMode,
  resumeNativePocketMode,
  startNativePocketMode,
  stopNativePocketMode,
  subscribePocketTapUpdates,
  syncNativePocketCount,
} from '../native/pocketJapa';
import {
  DEFAULT_APP_SETTINGS,
  type AppSettings,
  type AshtothramName,
  type MantraScript,
  type PracticeSession,
} from '../types/practice';
import { colors } from '../theme/colors';
import {
  triggerCompletionFeedback,
  triggerCountHaptic,
  triggerMalaCompletionHaptic,
} from '../utils/haptics';
import { sendCompletionNotification } from '../utils/notifications';

interface CountdownCounterProps {
  session: PracticeSession;
  fallbackLabel: string;
  mantraText?: string;
  ashtothramNames?: AshtothramName[];
  preferredScript?: MantraScript;
  onDecrement: () => void;
  onUndo: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onClear: () => void;
}

const KEEP_AWAKE_TAG = 'smarana-active-session';

export function CountdownCounter({
  session,
  fallbackLabel,
  mantraText,
  ashtothramNames,
  preferredScript,
  onDecrement,
  onUndo,
  onPause,
  onResume,
  onReset,
  onClear,
}: CountdownCounterProps) {
  const { language, t } = useLanguage();
  const navigation = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();
  const displayLabel = session.label || fallbackLabel;
  const completedCount = session.targetCount - session.remainingCount;
  const isPaused = session.status === 'paused';
  const isCompleted = session.status === 'completed';
  const isSessionInProgress = !isCompleted;
  const canUndo =
    (session.status === 'active' || session.status === 'paused') &&
    session.remainingCount < session.targetCount;

  const [settings, setSettings] = useState<AppSettings>(DEFAULT_APP_SETTINGS);
  const [isDimMode, setIsDimMode] = useState(false);
  const [isPocketModeActive, setIsPocketModeActive] = useState(false);
  const [isMantraTextVisible, setIsMantraTextVisible] = useState(false);
  const [readerFontSize, setReaderFontSize] = useState<ReadingFontSize>('normal');

  const readerFontConfig = {
    normal: { mantra: 14, mantraLine: 20, nama: 15, namaLine: 21 },
    large: { mantra: 17, mantraLine: 24, nama: 18, namaLine: 24 },
    xlarge: { mantra: 21, mantraLine: 28, nama: 22, namaLine: 28 },
    jumbo: { mantra: 25, mantraLine: 34, nama: 26, namaLine: 33 },
  }[readerFontSize];

  useFocusEffect(
    useCallback(() => {
      try {
        setSettings(getAppSettings());
      } catch {
        // Fallback to default settings if DB isn't ready
      }
    }, [])
  );

  // Sync Pocket Mode active badge with native service state
  useEffect(() => {
    if (!isPocketModeSupported) {
      return;
    }
    void getNativePocketState().then((pocket) => {
      if (pocket && pocket.sessionId === session.id) {
        setIsPocketModeActive(pocket.isActive);
      }
    });
    const unsub = subscribePocketTapUpdates((event) => {
      if (event.sessionId === session.id) {
        setIsPocketModeActive(event.isActive);
      }
    });
    return unsub;
  }, [session.id]);

  // Keep screen awake strictly while focused, session is active, and setting is enabled
  useEffect(() => {
    if (isFocused && session.status === 'active' && settings.keepScreenAwake) {
      void activateKeepAwakeAsync(KEEP_AWAKE_TAG).catch(() => {});
      return () => {
        void deactivateKeepAwake(KEEP_AWAKE_TAG).catch(() => {});
      };
    }
    void deactivateKeepAwake(KEEP_AWAKE_TAG).catch(() => {});
    return undefined;
  }, [isFocused, session.status, settings.keepScreenAwake]);

  // Automatically exit Dim Mode & Pocket Mode upon completion
  useEffect(() => {
    if (isCompleted) {
      if (isDimMode) {
        setIsDimMode(false);
      }
      if (isPocketModeActive) {
        stopNativePocketMode();
        setIsPocketModeActive(false);
      }
    }
  }, [isCompleted, isDimMode, isPocketModeActive]);

  const lastNotifiedRef = useRef<string | null>(null);

  const malaProgress = computeMalaProgress({
    completedCount,
    targetCount: session.targetCount,
    beadsPerMala: settings.malaSize,
  });

  const lastMalaBoundaryRef = useRef<number>(malaProgress.completedMalas);
  const [isMeruBannerVisible, setIsMeruBannerVisible] = useState(false);

  // Sync baseline Mala tracker on session change or size change
  useEffect(() => {
    lastMalaBoundaryRef.current = Math.floor(
      (session.targetCount - session.remainingCount) / settings.malaSize
    );
    setIsMeruBannerVisible(false);
  }, [session.id, settings.malaSize]);

  // Detect mid-session Mala completion milestones (e.g. 108, 216...)
  useEffect(() => {
    if (session.mode !== 'japa') {
      return;
    }

    if (malaProgress.completedMalas < lastMalaBoundaryRef.current) {
      lastMalaBoundaryRef.current = malaProgress.completedMalas;
      setIsMeruBannerVisible(false);
      return;
    }

    if (
      session.status === 'active' &&
      malaProgress.isJustCompletedMala &&
      !isCompleted &&
      malaProgress.completedMalas > lastMalaBoundaryRef.current
    ) {
      lastMalaBoundaryRef.current = malaProgress.completedMalas;
      setIsMeruBannerVisible(true);

      if (settings.malaHapticEnabled) {
        void triggerMalaCompletionHaptic();
      }
      if (settings.meruBehavior === 'pause') {
        if (isPocketModeActive) {
          pauseNativePocketMode();
        }
        onPause();
      }
    }
  }, [
    session.mode,
    session.status,
    malaProgress.isJustCompletedMala,
    malaProgress.completedMalas,
    isCompleted,
    settings.malaHapticEnabled,
    settings.meruBehavior,
    isPocketModeActive,
    onPause,
  ]);

  // Auto-hide Meru visual highlight after 2.4s when continuing seamlessly
  useEffect(() => {
    if (!isMeruBannerVisible || settings.meruBehavior === 'pause') {
      return undefined;
    }
    const timer = setTimeout(() => {
      setIsMeruBannerVisible(false);
    }, 2400);
    return () => clearTimeout(timer);
  }, [isMeruBannerVisible, settings.meruBehavior]);

  useEffect(() => {
    if (session.status !== 'completed') {
      lastNotifiedRef.current = null;
      return;
    }

    const completionKey = `${session.id}:${session.completedAt ?? 'done'}`;
    if (lastNotifiedRef.current === completionKey) {
      return;
    }
    lastNotifiedRef.current = completionKey;

    void triggerCompletionFeedback();
    void sendCompletionNotification(
      session.mode,
      displayLabel,
      session.targetCount,
      language
    );
  }, [
    session.status,
    session.id,
    session.completedAt,
    session.mode,
    session.targetCount,
    displayLabel,
    language,
  ]);

  const handleCountInput = useCallback(() => {
    if (session.status !== 'active' || session.remainingCount <= 0) {
      return;
    }
    if (session.remainingCount > 1) {
      void triggerCountHaptic();
    }
    if (isPocketModeActive) {
      syncNativePocketCount(Math.max(0, session.remainingCount - 1));
    }
    onDecrement();
  }, [session.status, session.remainingCount, isPocketModeActive, onDecrement]);

  const handleUndo = () => {
    if (isPocketModeActive && canUndo) {
      syncNativePocketCount(Math.min(session.targetCount, session.remainingCount + 1));
    }
    onUndo();
  };

  const handlePauseResume = () => {
    if (isPaused) {
      setIsMeruBannerVisible(false);
      if (isPocketModeActive) {
        resumeNativePocketMode();
      }
      onResume();
    } else {
      if (isPocketModeActive) {
        pauseNativePocketMode();
      }
      onPause();
    }
  };

  const handleTogglePocketMode = () => {
    if (!isPocketModeSupported) {
      Alert.alert(t.counter.pocketMode, t.counter.pocketModeUnavailable);
      return;
    }
    if (isPocketModeActive) {
      stopNativePocketMode();
      setIsPocketModeActive(false);
      return;
    }
    startNativePocketMode({
      sessionId: session.id,
      mode: session.mode,
      label: displayLabel,
      targetCount: session.targetCount,
      remainingCount: session.remainingCount,
      sensitivity: settings.backTapSensitivity,
    });
    setIsPocketModeActive(true);
  };

  const handleConfirmReset = () => {
    const performReset = () => {
      if (isPocketModeActive) {
        stopNativePocketMode();
        setIsPocketModeActive(false);
      }
      onReset();
    };

    if (completedCount === 0) {
      performReset();
      return;
    }
    Alert.alert(t.counter.confirmResetTitle, t.counter.confirmResetBody, [
      { text: t.common.cancel, style: 'cancel' },
      { text: t.common.confirm, style: 'destructive', onPress: performReset },
    ]);
  };

  const handleConfirmExit = useCallback(() => {
    const performExit = () => {
      if (isPocketModeActive) {
        stopNativePocketMode();
        setIsPocketModeActive(false);
      }
      onClear();
    };

    if (completedCount === 0 || isCompleted) {
      performExit();
      return;
    }
    Alert.alert(t.counter.confirmExitTitle, t.counter.confirmExitBody, [
      { text: t.common.cancel, style: 'cancel' },
      { text: t.common.confirm, style: 'destructive', onPress: performExit },
    ]);
  }, [completedCount, isCompleted, isPocketModeActive, onClear, t]);

  const handleGuardedHome = useCallback(() => {
    const navigateHome = () => {
      if (!isPocketModeActive && session.status === 'active') {
        onPause();
      }
      navigation.navigate('Home');
    };

    if (!isSessionInProgress || completedCount === 0) {
      navigateHome();
      return;
    }

    Alert.alert(t.counter.confirmHomeTitle, t.counter.confirmHomeBody, [
      { text: t.common.cancel, style: 'cancel' },
      { text: t.counter.confirmHomeAction, onPress: navigateHome },
    ]);
  }, [
    isPocketModeActive,
    session.status,
    isSessionInProgress,
    completedCount,
    onPause,
    navigation,
    t,
  ]);

  // Hide bottom tab bar and guard header BackChevron while session is in progress
  useEffect(() => {
    navigation.setOptions({
      tabBarStyle: isSessionInProgress
        ? { display: 'none' }
        : getTabBarStyle(insets.bottom),
      headerLeft: () => (
        <HeaderBackButton
          onPress={handleGuardedHome}
          accessibilityLabel={t.common.backHome}
        />
      ),
    });

    return () => {
      navigation.setOptions({
        tabBarStyle: getTabBarStyle(insets.bottom),
        headerLeft: () => (
          <HeaderBackButton
            onPress={() => navigation.navigate('Home')}
            accessibilityLabel={t.common.backHome}
          />
        ),
      });
    };
  }, [
    navigation,
    isSessionInProgress,
    insets.bottom,
    handleGuardedHome,
    t.common.backHome,
  ]);

  // Intercept Android hardware back button & gesture while this screen is focused
  useEffect(() => {
    if (!isFocused) {
      return undefined;
    }

    const onBackPress = () => {
      if (isDimMode) {
        setIsDimMode(false);
        return true;
      }
      if (isCompleted) {
        onClear();
        return true;
      }
      handleGuardedHome();
      return true;
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, [isFocused, isDimMode, isCompleted, onClear, handleGuardedHome]);

  // Disable JS foreground back-tap when tab is unfocused or Pocket Mode owns sensors
  useBackTap({
    enabled:
      isFocused &&
      settings.backTapEnabled &&
      session.status === 'active' &&
      !isPocketModeActive,
    sensitivity: settings.backTapSensitivity,
    onDoubleTap: handleCountInput,
  });

  if (isCompleted) {
    const unitLabel =
      session.mode === 'pradakshina'
        ? t.counter.completePradakshina
        : t.counter.completeJapa;

    return (
      <View style={styles.container}>
        <View style={styles.completionCard}>
          <Text style={styles.completionEyebrow}>{t.counter.completeEyebrow}</Text>
          <Text style={styles.completionCount}>0</Text>
          <Text style={styles.completionTitle}>{displayLabel}</Text>
          <Text style={styles.completionSubtitle}>
            {session.targetCount} {unitLabel}
            {session.mode === 'japa' && malaProgress.completedMalas > 0
              ? ` · ${malaProgress.completedMalas} ${
                  malaProgress.completedMalas === 1
                    ? t.counter.malaSingular
                    : t.counter.malaPlural
                }`
              : ''}
          </Text>

          <View style={styles.completionActions}>
            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={onReset}
              accessibilityRole="button"
            >
              <Text style={styles.primaryButtonText}>
                {t.counter.repeat} ({session.targetCount})
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={onClear}
              accessibilityRole="button"
            >
              <Text style={styles.secondaryButtonText}>{t.common.backSetup}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  const sensitivityLabel = t.settings[settings.backTapSensitivity];
  const malaUnitLabel =
    malaProgress.completedMalas === 1
      ? t.counter.malaSingular
      : t.counter.malaPlural;
  const malaProgressText = `${malaProgress.completedMalas} ${malaUnitLabel} · ${malaProgress.currentMalaBeads}/${settings.malaSize}`;
  const isMeruPaused =
    isPaused &&
    session.mode === 'japa' &&
    malaProgress.isJustCompletedMala &&
    settings.meruBehavior === 'pause';

  const hasAshtothram = Boolean(ashtothramNames && ashtothramNames.length > 0);
  const currentNamaIndex = hasAshtothram
    ? Math.min(ashtothramNames!.length - 1, Math.max(0, completedCount))
    : 0;
  const currentNama = hasAshtothram ? ashtothramNames![currentNamaIndex] : null;
  const scriptKey = preferredScript || (language === 'te' ? 'telugu' : 'sanskrit');
  const currentNamaText = currentNama
    ? scriptKey === 'sanskrit'
      ? currentNama.sanskrit
      : scriptKey === 'telugu'
        ? currentNama.telugu
        : currentNama.english
    : undefined;

  const counterCore = (
    <>
      <Text style={styles.remainingLabel}>{t.counter.remaining}</Text>
      <Text
        style={[styles.countNumber, isPaused && styles.countNumberPaused]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {session.remainingCount}
      </Text>
      {session.mode === 'japa' ? (
        <View
          style={[
            styles.malaBadge,
            (isMeruBannerVisible || malaProgress.isJustCompletedMala) &&
              styles.malaBadgeMeru,
          ]}
        >
          <Text style={styles.malaBadgeText}>{malaProgressText}</Text>
        </View>
      ) : null}
      {currentNama && currentNamaText ? (
        <View style={styles.namaPill}>
          <View style={styles.namaPillHeader}>
            <Text style={styles.namaPillNum}>
              {t.ashtothram.currentNama} {currentNama.num} / {ashtothramNames?.length}
            </Text>
            <FontSizeControl
              size={readerFontSize}
              onChangeSize={setReaderFontSize}
              compact
            />
          </View>
          <Text
            style={[
              styles.namaPillText,
              {
                fontSize: readerFontConfig.nama,
                lineHeight: readerFontConfig.namaLine,
              },
            ]}
            numberOfLines={2}
          >
            {currentNamaText}
          </Text>
        </View>
      ) : null}
    </>
  );

  return (
    <View style={styles.container}>
      <Modal
        visible={isDimMode}
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setIsDimMode(false)}
      >
        <StatusBar hidden={isDimMode} style="light" />
        <View
          style={[
            styles.dimContainer,
            {
              paddingTop: Math.max(insets.top, 24) + 16,
              paddingBottom: Math.max(insets.bottom, 24) + 16,
            },
          ]}
        >
          <Text style={styles.dimLabel} numberOfLines={1}>
            {displayLabel}
          </Text>

          <Pressable
            style={styles.dimTapArea}
            onPress={handleCountInput}
            disabled={isPaused}
            accessibilityRole="button"
            accessibilityLabel={`${session.remainingCount}`}
          >
            {session.mode === 'japa' ? (
              <MalaProgressRing
                completed={completedCount}
                target={session.targetCount}
                beadsPerMala={settings.malaSize}
                ratio={malaProgress.ratioInCurrentMala}
                isMeruHighlighted={
                  malaProgress.isJustCompletedMala || isMeruBannerVisible
                }
                size={256}
              >
                <Text
                  style={styles.dimCount}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {session.remainingCount}
                </Text>
                <Text style={styles.dimMalaText}>{malaProgressText}</Text>
              </MalaProgressRing>
            ) : (
              <Text style={styles.dimCount}>{session.remainingCount}</Text>
            )}
            {currentNama && currentNamaText ? (
              <View style={styles.dimNamaPill}>
                <Text style={styles.dimNamaNum}>
                  {currentNama.num} / {ashtothramNames?.length}
                </Text>
                <Text style={styles.dimNamaText} numberOfLines={2}>
                  {currentNamaText}
                </Text>
              </View>
            ) : null}
            <Text style={styles.dimHint}>
              {isMeruPaused
                ? t.counter.meruPausedHint
                : isPaused
                  ? t.counter.tapHintPaused
                  : isMeruBannerVisible
                    ? t.counter.meruReached
                    : t.counter.tapHintScreen}
            </Text>
          </Pressable>

          <View style={styles.dimActionsRow}>
            <Pressable
              style={styles.dimButton}
              onPress={handlePauseResume}
              accessibilityRole="button"
            >
              <Text style={styles.dimButtonText}>
                {isPaused ? t.counter.resume : t.counter.pause}
              </Text>
            </Pressable>

            <Pressable
              style={styles.dimButton}
              onPress={() => setIsDimMode(false)}
              accessibilityRole="button"
            >
              <Text style={styles.dimButtonText}>{t.counter.exitDim}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <View style={styles.topActionsRow}>
        <Pressable
          style={({ pressed }) => [
            styles.backSetupButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleConfirmExit}
          accessibilityRole="button"
          accessibilityLabel={t.common.backSetup}
        >
          <Text style={styles.backSetupText}>{t.common.backSetup}</Text>
        </Pressable>

        <View style={styles.topRightActions}>
          <Pressable
            style={({ pressed }) => [
              styles.backSetupButton,
              isPocketModeActive && styles.pocketActiveButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleTogglePocketMode}
            accessibilityRole="button"
          >
            <Text style={styles.backSetupText}>
              {isPocketModeActive ? t.counter.stopPocketMode : t.counter.pocketMode}
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.backSetupButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => setIsDimMode(true)}
            accessibilityRole="button"
            accessibilityLabel={t.counter.alwaysOnDim}
          >
            <Text style={styles.backSetupText}>{t.counter.alwaysOnDim}</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.topBar}>
        <View style={styles.labelBlock}>
          <Text style={styles.modeTag}>
            {session.mode === 'pradakshina'
              ? t.tabs.pradakshina.toUpperCase()
              : t.tabs.japa.toUpperCase()}
          </Text>
          <Text style={styles.sessionLabel} numberOfLines={1}>
            {displayLabel}
          </Text>
        </View>
        <View style={styles.topBarRight}>
          <Text style={styles.progressText}>
            {completedCount} / {session.targetCount}
          </Text>
          {mantraText ? (
            <Pressable
              style={styles.mantraViewButton}
              onPress={() => setIsMantraTextVisible((prev) => !prev)}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Toggle mantra text"
            >
              <Text style={styles.mantraViewButtonText}>
                {isMantraTextVisible ? '▲' : '▼ 🕉'}
              </Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      {mantraText && isMantraTextVisible ? (
        <View style={styles.activeMantraCard}>
          <View style={styles.activeMantraCardHeader}>
            <Text style={styles.activeMantraCardTag}>🕉 {displayLabel}</Text>
            <FontSizeControl
              size={readerFontSize}
              onChangeSize={setReaderFontSize}
              compact
            />
          </View>
          <Text
            style={[
              styles.activeMantraCardText,
              {
                fontSize: readerFontConfig.mantra,
                lineHeight: readerFontConfig.mantraLine,
              },
            ]}
          >
            {mantraText}
          </Text>
        </View>
      ) : null}

      <Pressable
        style={({ pressed }) => [
          styles.tapArea,
          isPaused && styles.tapAreaPaused,
          pressed && !isPaused && styles.tapAreaPressed,
        ]}
        onPress={handleCountInput}
        disabled={isPaused}
        accessibilityRole="button"
        accessibilityLabel={`${session.remainingCount}`}
      >
        {session.mode === 'japa' ? (
          <MalaProgressRing
            completed={completedCount}
            target={session.targetCount}
            beadsPerMala={settings.malaSize}
            ratio={malaProgress.ratioInCurrentMala}
            isMeruHighlighted={
              malaProgress.isJustCompletedMala || isMeruBannerVisible
            }
            size={248}
          >
            {counterCore}
          </MalaProgressRing>
        ) : (
          counterCore
        )}
        <Text style={styles.tapHint}>
          {isMeruPaused
            ? t.counter.meruPausedHint
            : isPaused
              ? t.counter.tapHintPaused
              : isMeruBannerVisible
                ? t.counter.meruReached
                : isPocketModeActive
                  ? t.counter.pocketModeActive
                  : settings.backTapEnabled
                    ? `${t.counter.tapHintBackTap} (${sensitivityLabel})`
                    : t.counter.tapHintScreen}
        </Text>
      </Pressable>

      <View style={styles.controlsRow}>
        <Pressable
          style={({ pressed }) => [
            styles.controlButton,
            !canUndo && styles.controlButtonDisabled,
            pressed && canUndo && styles.buttonPressed,
          ]}
          onPress={handleUndo}
          disabled={!canUndo}
          accessibilityRole="button"
        >
          <Text
            style={[
              styles.controlButtonText,
              !canUndo && styles.controlButtonTextDisabled,
            ]}
          >
            {t.counter.undo}
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.controlButton,
            styles.pauseButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handlePauseResume}
          accessibilityRole="button"
        >
          <Text style={styles.controlButtonText}>
            {isPaused ? t.counter.resume : t.counter.pause}
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.controlButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleConfirmReset}
          accessibilityRole="button"
        >
          <Text style={styles.controlButtonText}>{t.counter.reset}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    justifyContent: 'space-between',
  },
  topActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  topRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backSetupButton: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  pocketActiveButton: {
    borderColor: colors.goldSoft,
    backgroundColor: colors.earth,
  },
  backSetupText: {
    color: colors.goldSoft,
    fontSize: 13,
    fontWeight: '600',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  labelBlock: {
    flex: 1,
    marginRight: 12,
  },
  modeTag: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  sessionLabel: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
  },
  progressText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mantraViewButton: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.gold,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  mantraViewButtonText: {
    color: colors.goldSoft,
    fontSize: 12,
    fontWeight: '700',
  },
  activeMantraCard: {
    backgroundColor: colors.surface,
    borderColor: colors.gold,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.gold,
  },
  activeMantraCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  activeMantraCardTag: {
    color: colors.goldSoft,
    fontSize: 12,
    fontWeight: '700',
  },
  activeMantraCardText: {
    color: colors.ivoryWarm,
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  namaPill: {
    backgroundColor: '#0D241C',
    borderColor: colors.gold,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 8,
    alignItems: 'center',
    maxWidth: 290,
  },
  namaPillHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 4,
    gap: 8,
  },
  namaPillNum: {
    color: colors.goldSoft,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  namaPillText: {
    color: colors.ivoryWarm,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 21,
  },
  dimNamaPill: {
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#0D1A15',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  dimNamaNum: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 2,
  },
  dimNamaText: {
    color: colors.ivoryWarm,
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  tapArea: {
    flex: 1,
    marginVertical: 18,
    backgroundColor: colors.surface,
    borderColor: colors.gold,
    borderWidth: 1.5,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  tapAreaPressed: {
    backgroundColor: colors.surfaceAlt,
  },
  tapAreaPaused: {
    borderColor: colors.earthLight,
    opacity: 0.75,
  },
  remainingLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.8,
    marginBottom: 8,
  },
  countNumber: {
    color: colors.goldSoft,
    fontSize: 78,
    fontWeight: '700',
    lineHeight: 86,
  },
  countNumberPaused: {
    color: colors.textMuted,
  },
  malaBadge: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 6,
  },
  malaBadgeMeru: {
    backgroundColor: colors.earth,
    borderColor: colors.gold,
  },
  malaBadgeText: {
    color: colors.goldSoft,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  dimMalaText: {
    color: colors.goldSoft,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 6,
    letterSpacing: 0.5,
  },
  tapHint: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 14,
    textAlign: 'center',
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  controlButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  pauseButton: {
    backgroundColor: colors.earth,
    borderColor: colors.earthLight,
  },
  controlButtonDisabled: {
    opacity: 0.45,
  },
  controlButtonText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  controlButtonTextDisabled: {
    color: colors.textMuted,
  },
  dimContainer: {
    flex: 1,
    backgroundColor: '#000000',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dimLabel: {
    color: colors.textMuted,
    fontSize: 16,
    fontWeight: '600',
  },
  dimTapArea: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dimCount: {
    color: colors.gold,
    fontSize: 88,
    fontWeight: '700',
  },
  dimHint: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 22,
  },
  dimActionsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  dimButton: {
    flex: 1,
    backgroundColor: '#0D1A15',
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  dimButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  completionCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderColor: colors.success,
    borderWidth: 1.5,
    borderRadius: 24,
    padding: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completionEyebrow: {
    color: colors.success,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.6,
    marginBottom: 10,
  },
  completionCount: {
    color: colors.goldSoft,
    fontSize: 76,
    fontWeight: '700',
    marginBottom: 8,
  },
  completionTitle: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  completionSubtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 28,
  },
  completionActions: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: colors.gold,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: 0.85,
  },
});
