import React, { useCallback, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LiveCalibrationCard } from '../components/LiveCalibrationCard';
import { getAppSettings, saveAppSettings } from '../db/database';
import { useBackTapCalibration } from '../engine/useBackTapCalibration';
import { useLanguage } from '../i18n/LanguageContext';
import { colors } from '../theme/colors';
import {
  DEFAULT_APP_SETTINGS,
  type AppLanguage,
  type AppSettings,
  type BackTapSensitivity,
  type MalaSize,
  type MeruBehavior,
} from '../types/practice';

export function SettingsScreen() {
  const { language, setLanguage, t } = useLanguage();
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_APP_SETTINGS);
  const calibration = useBackTapCalibration(settings.backTapSensitivity);
  const stopCalibration = calibration.stop;

  useFocusEffect(
    useCallback(() => {
      setSettings(getAppSettings());
      return () => {
        stopCalibration();
      };
    }, [stopCalibration])
  );

  const updateSettings = (next: AppSettings) => {
    setSettings(next);
    saveAppSettings(next);
  };

  const handleLanguageChange = (nextLang: AppLanguage) => {
    setLanguage(nextLang);
    setSettings((prev) => ({ ...prev, language: nextLang }));
  };

  const sensitivityOptions: {
    value: BackTapSensitivity;
    label: string;
    hint: string;
  }[] = [
    { value: 'low', label: t.settings.low, hint: t.settings.lowHint },
    { value: 'medium', label: t.settings.medium, hint: t.settings.mediumHint },
    { value: 'high', label: t.settings.high, hint: t.settings.highHint },
  ];

  const malaSizeOptions: {
    value: MalaSize;
    label: string;
    hint: string;
  }[] = [
    { value: 108, label: t.settings.mala108, hint: t.settings.mala108Hint },
    { value: 27, label: t.settings.mala27, hint: t.settings.mala27Hint },
  ];

  const meruOptions: {
    value: MeruBehavior;
    label: string;
    hint: string;
  }[] = [
    {
      value: 'continue',
      label: t.settings.meruContinue,
      hint: t.settings.meruContinueHint,
    },
    {
      value: 'pause',
      label: t.settings.meruPause,
      hint: t.settings.meruPauseHint,
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t.settings.languageTitle}</Text>
        <Text style={styles.cardDescription}>{t.settings.languageDesc}</Text>

        <View style={styles.langRow}>
          <Pressable
            style={[
              styles.langButton,
              language === 'en' && styles.langButtonSelected,
            ]}
            onPress={() => handleLanguageChange('en')}
            accessibilityRole="button"
          >
            <Text
              style={[
                styles.langText,
                language === 'en' && styles.langTextSelected,
              ]}
            >
              English
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.langButton,
              language === 'te' && styles.langButtonSelected,
            ]}
            onPress={() => handleLanguageChange('te')}
            accessibilityRole="button"
          >
            <Text
              style={[
                styles.langText,
                language === 'te' && styles.langTextSelected,
              ]}
            >
              తెలుగు (Telugu)
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.textBlock}>
            <Text style={styles.cardTitle}>{t.settings.keepAwakeTitle}</Text>
            <Text style={styles.cardDescription}>{t.settings.keepAwakeDesc}</Text>
          </View>
          <Switch
            value={settings.keepScreenAwake}
            onValueChange={(value) =>
              updateSettings({ ...settings, keepScreenAwake: value })
            }
            trackColor={{ false: colors.surfaceAlt, true: colors.gold }}
            thumbColor={colors.textPrimary}
          />
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.textBlock}>
            <Text style={styles.cardTitle}>{t.settings.backTapTitle}</Text>
            <Text style={styles.cardDescription}>{t.settings.backTapDesc}</Text>
          </View>
          <Switch
            value={settings.backTapEnabled}
            onValueChange={(value) =>
              updateSettings({ ...settings, backTapEnabled: value })
            }
            trackColor={{ false: colors.surfaceAlt, true: colors.gold }}
            thumbColor={colors.textPrimary}
          />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t.settings.sensitivityTitle}</Text>
        <Text style={styles.cardDescription}>{t.settings.sensitivityDesc}</Text>

        <View style={styles.optionsList}>
          {sensitivityOptions.map((option) => {
            const isSelected = settings.backTapSensitivity === option.value;
            return (
              <Pressable
                key={option.value}
                style={[
                  styles.optionRow,
                  isSelected && styles.optionRowSelected,
                ]}
                onPress={() =>
                  updateSettings({
                    ...settings,
                    backTapSensitivity: option.value,
                  })
                }
                accessibilityRole="button"
              >
                <View style={styles.optionHeader}>
                  <Text
                    style={[
                      styles.optionLabel,
                      isSelected && styles.optionLabelSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {isSelected ? (
                    <Text style={styles.selectedTag}>{t.settings.selected}</Text>
                  ) : null}
                </View>
                <Text style={styles.optionHint}>{option.hint}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t.settings.malaTitle}</Text>
        <Text style={styles.cardDescription}>{t.settings.malaDesc}</Text>

        <View style={styles.optionsList}>
          {malaSizeOptions.map((option) => {
            const isSelected = settings.malaSize === option.value;
            return (
              <Pressable
                key={option.value}
                style={[
                  styles.optionRow,
                  isSelected && styles.optionRowSelected,
                ]}
                onPress={() =>
                  updateSettings({
                    ...settings,
                    malaSize: option.value,
                  })
                }
                accessibilityRole="button"
              >
                <View style={styles.optionHeader}>
                  <Text
                    style={[
                      styles.optionLabel,
                      isSelected && styles.optionLabelSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {isSelected ? (
                    <Text style={styles.selectedTag}>{t.settings.selected}</Text>
                  ) : null}
                </View>
                <Text style={styles.optionHint}>{option.hint}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t.settings.meruTitle}</Text>
        <Text style={styles.cardDescription}>{t.settings.meruDesc}</Text>

        <View style={styles.optionsList}>
          {meruOptions.map((option) => {
            const isSelected = settings.meruBehavior === option.value;
            return (
              <Pressable
                key={option.value}
                style={[
                  styles.optionRow,
                  isSelected && styles.optionRowSelected,
                ]}
                onPress={() =>
                  updateSettings({
                    ...settings,
                    meruBehavior: option.value,
                  })
                }
                accessibilityRole="button"
              >
                <View style={styles.optionHeader}>
                  <Text
                    style={[
                      styles.optionLabel,
                      isSelected && styles.optionLabelSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {isSelected ? (
                    <Text style={styles.selectedTag}>{t.settings.selected}</Text>
                  ) : null}
                </View>
                <Text style={styles.optionHint}>{option.hint}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.textBlock}>
            <Text style={styles.cardTitle}>{t.settings.malaHapticTitle}</Text>
            <Text style={styles.cardDescription}>{t.settings.malaHapticDesc}</Text>
          </View>
          <Switch
            value={settings.malaHapticEnabled}
            onValueChange={(value) =>
              updateSettings({ ...settings, malaHapticEnabled: value })
            }
            trackColor={{ false: colors.surfaceAlt, true: colors.gold }}
            thumbColor={colors.textPrimary}
          />
        </View>
      </View>

      <LiveCalibrationCard calibration={calibration} />

      <View style={styles.noteCard}>
        <Text style={styles.noteTitle}>{t.settings.notesTitle}</Text>
        <Text style={styles.noteText}>{t.settings.notesBody}</Text>
      </View>

      <View style={styles.brandFooter}>
        <Text style={styles.brandFooterTitle}>SMARANA · v1.0.0</Text>
        <Text style={styles.brandFooterSub}>Remember the Divine.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    padding: 20,
    gap: 16,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
  },
  langRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  langButton: {
    flex: 1,
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  langButtonSelected: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.gold,
  },
  langText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '700',
  },
  langTextSelected: {
    color: colors.goldSoft,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
  },
  textBlock: {
    flex: 1,
  },
  cardTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardDescription: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
  optionsList: {
    marginTop: 14,
    gap: 10,
  },
  optionRow: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  optionRowSelected: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.gold,
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  optionLabel: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  optionLabelSelected: {
    color: colors.goldSoft,
  },
  selectedTag: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: '700',
  },
  optionHint: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
  },
  noteCard: {
    backgroundColor: colors.surface,
    borderColor: colors.earthLight,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  noteTitle: {
    color: colors.goldSoft,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  noteText: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
  brandFooter: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  brandFooterTitle: {
    color: colors.goldSoft,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 2.5,
  },
  brandFooterSub: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 3,
  },
});
