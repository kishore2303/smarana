import React, { useMemo, useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontSizeControl, ReadingFontSize } from './FontSizeControl';
import { TabIcon } from './TabIcon';
import { TopLanguageToggle } from './TopLanguageToggle';
import {
  getPoojaStepsForMode,
  PoojaMode,
  PoojaStep,
} from '../data/nityaPoojaSteps';
import { ALL_ASHTOTHRAMS } from '../data/ashtothrams';
import { getDeityImage } from '../data/deityImages';
import { generateSankalpa, getPanchanga } from '../engine/panchangamEngine';
import { useLanguage } from '../i18n/LanguageContext';
import { colors } from '../theme/colors';

interface NityaPoojaModalProps {
  visible: boolean;
  onClose: () => void;
}

export function NityaPoojaModal({ visible, onClose }: NityaPoojaModalProps) {
  const insets = useSafeAreaInsets();
  const { language, t } = useLanguage();
  const isTelugu = language === 'te';

  // Mode: 'laghu' (5 mins) or 'shodasa' (16 steps)
  const [mode, setMode] = useState<PoojaMode>('shodasa');

  // Active step index
  const [stepIndex, setStepIndex] = useState(0);

  // Selected deity for Pushparchana step
  const [selectedDeityId, setSelectedDeityId] = useState('builtin-ashtothram-ganesha');
  const [showDeityPicker, setShowDeityPicker] = useState(false);

  // Font scaling for reading from a distance
  const [readingFontSize, setReadingFontSize] = useState<ReadingFontSize>('large');

  // Whether user reached completion screen
  const [isCompleted, setIsCompleted] = useState(false);

  // Font config for distance viewing
  const fontConfig = {
    normal: { action: 14, actionLine: 21, mantra: 15, mantraLine: 24, meaning: 12, meaningLine: 18 },
    large: { action: 16, actionLine: 24, mantra: 18, mantraLine: 28, meaning: 14, meaningLine: 20 },
    xlarge: { action: 19, actionLine: 28, mantra: 21, mantraLine: 32, meaning: 16, meaningLine: 24 },
    jumbo: { action: 22, actionLine: 32, mantra: 25, mantraLine: 38, meaning: 18, meaningLine: 27 },
  }[readingFontSize];

  // Active steps based on mode
  const steps: PoojaStep[] = useMemo(() => {
    return getPoojaStepsForMode(mode);
  }, [mode]);

  // Current active step
  const currentStep = steps[stepIndex] || steps[0];
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === steps.length - 1;

  // Selected Ashtottaram object
  const activeAshtothram = useMemo(() => {
    return ALL_ASHTOTHRAMS.find((a) => a.id === selectedDeityId) || ALL_ASHTOTHRAMS[0];
  }, [selectedDeityId]);

  // Today's Panchangam & Sankalpam for step 4
  const todaySankalpam = useMemo(() => {
    const panchanga = getPanchanga(new Date());
    return generateSankalpa(panchanga, { type: 'pooja', tradition: 'smartha' });
  }, []);

  // Handlers
  const handleNextStep = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (isLastStep) {
      setIsCompleted(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    } else {
      setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrevStep = () => {
    Haptics.selectionAsync().catch(() => {});
    setStepIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleModeChange = (newMode: PoojaMode) => {
    Haptics.selectionAsync().catch(() => {});
    setMode(newMode);
    setStepIndex(0);
    setIsCompleted(false);
  };

  const handleCloseModal = () => {
    setIsCompleted(false);
    setStepIndex(0);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleCloseModal}
    >
      <View
        style={[
          styles.container,
          {
            paddingTop: Math.max(insets.top, 16),
            paddingBottom: Math.max(insets.bottom, 16),
          },
        ]}
      >
        {/* Top Header Bar */}
        <View style={styles.topHeader}>
          <View style={styles.brandRow}>
            <TabIcon name="Pooja" color={colors.gold} size={18} />
            <Text style={styles.brandTitle}>{t.nityaPooja.title}</Text>
          </View>

          <View style={styles.topActions}>
            <FontSizeControl
              size={readingFontSize}
              onChangeSize={setReadingFontSize}
              compact
            />
            <TopLanguageToggle compact />
            <Pressable
              style={styles.closeBtn}
              onPress={handleCloseModal}
              accessibilityRole="button"
              accessibilityLabel="Close"
              hitSlop={8}
            >
              <Text style={styles.closeBtnText}>✕</Text>
            </Pressable>
          </View>
        </View>

        {/* Mode Selector Pill: Laghu (5 Mins) vs Shodasa (16 Steps) */}
        <View style={styles.modeSelectorRow}>
          <Pressable
            style={[
              styles.modeTab,
              mode === 'shodasa' && styles.modeTabActive,
            ]}
            onPress={() => handleModeChange('shodasa')}
            accessibilityRole="button"
          >
            <Text
              style={[
                styles.modeTabText,
                mode === 'shodasa' && styles.modeTabTextActive,
              ]}
            >
              🪷 {t.nityaPooja.modeShodasa}
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.modeTab,
              mode === 'laghu' && styles.modeTabActive,
            ]}
            onPress={() => handleModeChange('laghu')}
            accessibilityRole="button"
          >
            <Text
              style={[
                styles.modeTabText,
                mode === 'laghu' && styles.modeTabTextActive,
              ]}
            >
              ⚡ {t.nityaPooja.modeLaghu}
            </Text>
          </Pressable>
        </View>

        {/* Progress Bar Line */}
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${Math.round(((stepIndex + 1) / steps.length) * 100)}%` },
            ]}
          />
        </View>

        {/* Completion Screen vs Active Stepper */}
        {isCompleted ? (
          <View style={styles.completionContainer}>
            <Text style={styles.completionLotus}>🪷</Text>
            <Text style={styles.completionTitle}>
              {t.nityaPooja.poojaCompletedTitle}
            </Text>
            <Text style={styles.completionSloka}>
              శ్రీ కృష్ణార్పణమస్తు | సర్వం శ్రీపరమేశ్వరార్పణమస్తు
            </Text>
            <Text style={styles.completionDesc}>
              {t.nityaPooja.poojaCompletedDesc}
            </Text>

            <Pressable
              style={styles.completionDoneBtn}
              onPress={handleCloseModal}
              accessibilityRole="button"
            >
              <Text style={styles.completionDoneBtnText}>
                {t.nityaPooja.poojaDoneButton}
              </Text>
            </Pressable>
          </View>
        ) : (
          <>
            {/* Scrollable Step Content (Guarantees zero cutoff on all screen sizes) */}
            <ScrollView
              style={styles.stepScroll}
              contentContainerStyle={styles.stepScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* Step Badge & Step Title Header */}
              <View style={styles.stepHeaderRow}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepBadgeText}>
                    {currentStep.icon} {t.nityaPooja.stepCount} {stepIndex + 1} / {steps.length}
                  </Text>
                </View>
                {mode === 'laghu' ? (
                  <View style={styles.laghuTag}>
                    <Text style={styles.laghuTagText}>5 Mins</Text>
                  </View>
                ) : null}
              </View>

              <Text style={styles.stepTitle}>
                {isTelugu ? currentStep.title.telugu : currentStep.title.english}
              </Text>
              {currentStep.subtitle ? (
                <Text style={styles.stepSubtitle}>
                  {isTelugu ? currentStep.subtitle.telugu : currentStep.subtitle.english}
                </Text>
              ) : null}

              {/* TIER 1: PHYSICAL ACTION (స్పష్టమైన క్రియ) */}
              <View style={styles.actionCard}>
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.actionCardIcon}>🖐️</Text>
                  <Text style={styles.actionCardTitle}>
                    {t.nityaPooja.actionTitle}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.actionCardText,
                    {
                      fontSize: fontConfig.action,
                      lineHeight: fontConfig.actionLine,
                    },
                  ]}
                >
                  {isTelugu ? currentStep.action.telugu : currentStep.action.english}
                </Text>
              </View>

              {/* TIER 2: MANTRA / SLOKA (శ్లోకం / మంత్రం) */}
              <View style={styles.mantraCard}>
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.mantraCardIcon}>🕉️</Text>
                  <Text style={styles.mantraCardTitle}>
                    {t.nityaPooja.mantraTitle}
                  </Text>
                </View>

                {/* Special Case: Dynamic Daily Sankalpam */}
                {currentStep.specialType === 'sankalpam' ? (
                  <View style={styles.specialSankalpaBox}>
                    <Text style={styles.sankalpaDateTag}>
                      📅 {todaySankalpam.tokens.samvatsara} · {todaySankalpam.tokens.masa} · {todaySankalpam.tokens.tithi}
                    </Text>
                    <Text
                      style={[
                        styles.mantraCardText,
                        {
                          fontSize: fontConfig.mantra,
                          lineHeight: fontConfig.mantraLine,
                        },
                      ]}
                    >
                      {isTelugu
                        ? todaySankalpam.telugu.fullText
                        : todaySankalpam.english.fullText}
                    </Text>
                  </View>
                ) : currentStep.specialType === 'ashtothram' ? (
                  /* Special Case: 108 Ashtottaram Names for Selected Deity */
                  <View style={styles.specialAshtothraBox}>
                    {/* Active Deity Header Row */}
                    <View style={styles.deityActiveRow}>
                      <View style={styles.deityAvatarWrap}>
                        {getDeityImage(selectedDeityId) ? (
                          <Image
                            source={getDeityImage(selectedDeityId)!}
                            style={styles.deityAvatar}
                          />
                        ) : null}
                      </View>
                      <View style={styles.deityNameInfo}>
                        <Text style={styles.deityNameText}>
                          {isTelugu
                            ? activeAshtothram.name
                            : activeAshtothram.deity || activeAshtothram.name}
                        </Text>
                        <Text style={styles.deityCountTag}>
                          108 {t.nityaPooja.ashtothramNamesCount}
                        </Text>
                      </View>
                      <Pressable
                        style={styles.changeDeityBtn}
                        onPress={() => setShowDeityPicker(true)}
                        hitSlop={6}
                        accessibilityRole="button"
                      >
                        <Text style={styles.changeDeityText}>
                          {t.nityaPooja.changeDeity} ▾
                        </Text>
                      </Pressable>
                    </View>

                    {/* Pre-invocation sloka */}
                    <Text
                      style={[
                        styles.mantraCardText,
                        {
                          fontSize: fontConfig.mantra,
                          lineHeight: fontConfig.mantraLine,
                          marginBottom: 10,
                        },
                      ]}
                    >
                      {isTelugu ? currentStep.mantra.telugu : currentStep.mantra.english}
                    </Text>

                    {/* 108 Names Preview List */}
                    <View style={styles.namesListContainer}>
                      {activeAshtothram.names?.slice(0, 10).map((n) => (
                        <View key={n.num} style={styles.nameRow}>
                          <Text style={styles.nameNum}>{n.num}.</Text>
                          <Text style={styles.nameText}>
                            {isTelugu ? n.telugu : n.english}
                          </Text>
                        </View>
                      ))}
                      <Text style={styles.moreNamesHint}>
                        ... మరియు మిగిలిన 108 నామాలు (And all 108 names) ...
                      </Text>
                    </View>
                  </View>
                ) : (
                  /* Standard Mantra Text */
                  <Text
                    style={[
                      styles.mantraCardText,
                      {
                        fontSize: fontConfig.mantra,
                        lineHeight: fontConfig.mantraLine,
                      },
                    ]}
                  >
                    {isTelugu ? currentStep.mantra.telugu : currentStep.mantra.english}
                  </Text>
                )}
              </View>

              {/* TIER 3: SACRED MEANING (భావార్థం) */}
              <View style={styles.meaningCard}>
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.meaningCardIcon}>💡</Text>
                  <Text style={styles.meaningCardTitle}>
                    {t.nityaPooja.meaningTitle}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.meaningCardText,
                    {
                      fontSize: fontConfig.meaning,
                      lineHeight: fontConfig.meaningLine,
                    },
                  ]}
                >
                  {isTelugu ? currentStep.meaning.telugu : currentStep.meaning.english}
                </Text>
              </View>
            </ScrollView>

            {/* Bottom Sticky Action Bar (Giant Water-Friendly Touch Targets) */}
            <View style={styles.bottomBar}>
              <Pressable
                style={[
                  styles.prevBtn,
                  isFirstStep && styles.prevBtnDisabled,
                ]}
                onPress={handlePrevStep}
                disabled={isFirstStep}
                accessibilityRole="button"
                accessibilityLabel="Previous Step"
              >
                <Text
                  style={[
                    styles.prevBtnText,
                    isFirstStep && styles.prevBtnTextDisabled,
                  ]}
                >
                  {t.nityaPooja.prevStep}
                </Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.nextBtn,
                  isLastStep && styles.completeBtn,
                  pressed && styles.nextBtnPressed,
                ]}
                onPress={handleNextStep}
                accessibilityRole="button"
                accessibilityLabel={
                  isLastStep
                    ? t.nityaPooja.completePooja
                    : t.nityaPooja.nextStep
                }
              >
                <Text style={styles.nextBtnText}>
                  {isLastStep
                    ? t.nityaPooja.completePooja
                    : t.nityaPooja.nextStep}
                </Text>
              </Pressable>
            </View>
          </>
        )}

        {/* Modal: Deity Selector for Pushparchana */}
        <Modal
          visible={showDeityPicker}
          animationType="fade"
          transparent
          onRequestClose={() => setShowDeityPicker(false)}
        >
          <View style={styles.pickerOverlay}>
            <View style={styles.pickerCard}>
              <Text style={styles.pickerTitle}>
                {t.nityaPooja.selectDeityPrompt}
              </Text>
              <ScrollView style={styles.pickerList}>
                {ALL_ASHTOTHRAMS.map((deity) => {
                  const isSelected = deity.id === selectedDeityId;
                  const img = getDeityImage(deity.id);
                  return (
                    <Pressable
                      key={deity.id}
                      style={[
                        styles.pickerItem,
                        isSelected && styles.pickerItemSelected,
                      ]}
                      onPress={() => {
                        setSelectedDeityId(deity.id);
                        setShowDeityPicker(false);
                      }}
                    >
                      <View style={styles.pickerAvatarWrap}>
                        {img ? (
                          <Image source={img} style={styles.pickerAvatar} />
                        ) : null}
                      </View>
                      <Text
                        style={[
                          styles.pickerItemText,
                          isSelected && styles.pickerItemTextSelected,
                        ]}
                      >
                        {isTelugu ? deity.name : deity.deity || deity.name}
                      </Text>
                      {isSelected ? (
                        <Text style={styles.pickerCheck}>✓</Text>
                      ) : null}
                    </Pressable>
                  );
                })}
              </ScrollView>
              <Pressable
                style={styles.pickerCloseBtn}
                onPress={() => setShowDeityPicker(false)}
              >
                <Text style={styles.pickerCloseBtnText}>
                  {t.common.cancel}
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A120E', // Sacred dark slate
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandTitle: {
    color: colors.gold,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '700',
  },

  /* Mode Selector */
  modeSelectorRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 3,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modeTab: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeTabActive: {
    backgroundColor: colors.earth,
    borderColor: colors.gold,
    borderWidth: 1,
  },
  modeTabText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  modeTabTextActive: {
    color: colors.goldSoft,
    fontWeight: '800',
  },

  /* Progress Bar */
  progressBarBackground: {
    height: 4,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    marginHorizontal: 16,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.gold,
    borderRadius: 2,
  },

  /* Stepper Content */
  stepScroll: {
    flex: 1,
  },
  stepScrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  stepHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  stepBadge: {
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    borderColor: colors.gold,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  stepBadgeText: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: '700',
  },
  laghuTag: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  laghuTagText: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '600',
  },
  stepTitle: {
    color: colors.ivoryWarm,
    fontSize: 20,
    fontWeight: '800',
    marginTop: 4,
  },
  stepSubtitle: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
    marginBottom: 12,
  },

  /* Tier 1: Action Card */
  actionCard: {
    backgroundColor: '#16241C',
    borderColor: 'rgba(212, 175, 55, 0.5)',
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 13,
    marginBottom: 12,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  actionCardIcon: {
    fontSize: 16,
  },
  actionCardTitle: {
    color: colors.goldSoft,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  actionCardText: {
    color: colors.ivoryWarm,
    fontWeight: '700',
  },

  /* Tier 2: Mantra Card */
  mantraCard: {
    backgroundColor: '#101B15',
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  mantraCardIcon: {
    fontSize: 16,
  },
  mantraCardTitle: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  mantraCardText: {
    color: colors.ivoryWarm,
    fontWeight: '600',
    fontStyle: 'italic',
  },

  /* Special Sankalpa Box */
  specialSankalpaBox: {
    gap: 8,
  },
  sankalpaDateTag: {
    color: colors.goldSoft,
    fontSize: 11,
    fontWeight: '700',
  },

  /* Special Ashtothra Box */
  specialAshtothraBox: {
    gap: 8,
  },
  deityActiveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface,
    padding: 8,
    borderRadius: 10,
    marginBottom: 6,
  },
  deityAvatarWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.gold,
  },
  deityAvatar: {
    width: '100%',
    height: '100%',
  },
  deityNameInfo: {
    flex: 1,
  },
  deityNameText: {
    color: colors.ivoryWarm,
    fontSize: 14,
    fontWeight: '700',
  },
  deityCountTag: {
    color: colors.goldSoft,
    fontSize: 10,
    fontWeight: '600',
  },
  changeDeityBtn: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  changeDeityText: {
    color: colors.goldSoft,
    fontSize: 11,
    fontWeight: '700',
  },
  namesListContainer: {
    backgroundColor: '#0D1612',
    borderRadius: 10,
    padding: 10,
    gap: 5,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  nameNum: {
    color: colors.goldSoft,
    fontSize: 11,
    fontWeight: '700',
    width: 22,
  },
  nameText: {
    color: colors.ivoryWarm,
    fontSize: 13,
    fontWeight: '600',
  },
  moreNamesHint: {
    color: colors.textMuted,
    fontSize: 11,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 4,
  },

  /* Tier 3: Meaning Card */
  meaningCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  meaningCardIcon: {
    fontSize: 14,
  },
  meaningCardTitle: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  meaningCardText: {
    color: colors.textSecondary,
    lineHeight: 18,
  },

  /* Bottom Action Bar */
  bottomBar: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: '#0A120E',
  },
  prevBtn: {
    paddingHorizontal: 16,
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prevBtnDisabled: {
    opacity: 0.35,
  },
  prevBtnText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
  },
  prevBtnTextDisabled: {
    color: colors.textMuted,
  },
  nextBtn: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.gold,
    elevation: 3,
  },
  completeBtn: {
    backgroundColor: '#1EBE5D',
  },
  nextBtnPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  nextBtnText: {
    color: colors.textOnGold,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  /* Completion View */
  completionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 12,
  },
  completionLotus: {
    fontSize: 56,
    marginBottom: 8,
  },
  completionTitle: {
    color: colors.gold,
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
  },
  completionSloka: {
    color: colors.goldSoft,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  completionDesc: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 320,
    marginBottom: 16,
  },
  completionDoneBtn: {
    backgroundColor: colors.gold,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  completionDoneBtnText: {
    color: colors.textOnGold,
    fontSize: 15,
    fontWeight: '800',
  },

  /* Deity Picker Sheet */
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  pickerCard: {
    backgroundColor: colors.surface,
    borderColor: colors.gold,
    borderWidth: 1,
    borderRadius: 16,
    width: '100%',
    maxHeight: 440,
    padding: 16,
  },
  pickerTitle: {
    color: colors.gold,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  pickerList: {
    maxHeight: 320,
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 4,
  },
  pickerItemSelected: {
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    borderColor: colors.gold,
    borderWidth: 1,
  },
  pickerAvatarWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.gold,
  },
  pickerAvatar: {
    width: '100%',
    height: '100%',
  },
  pickerItemText: {
    color: colors.ivoryWarm,
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  pickerItemTextSelected: {
    color: colors.gold,
    fontWeight: '700',
  },
  pickerCheck: {
    color: colors.gold,
    fontSize: 16,
    fontWeight: '800',
  },
  pickerCloseBtn: {
    marginTop: 10,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    borderRadius: 10,
  },
  pickerCloseBtnText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
  },
});
