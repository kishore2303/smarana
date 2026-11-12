import React, { useCallback, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { CountdownCounter } from '../components/CountdownCounter';
import { deletePreset, getSavedPresets, savePreset } from '../db/database';
import { useCountdownSession } from '../engine/useCountdownSession';
import { useLanguage } from '../i18n/LanguageContext';
import { colors } from '../theme/colors';
import type { SavedPreset } from '../types/practice';

export function PradakshinaScreen() {
  const { t } = useLanguage();
  const [templeName, setTempleName] = useState('');
  const [targetInput, setTargetInput] = useState('11');
  const [shouldSavePreset, setShouldSavePreset] = useState(true);
  const [presets, setPresets] = useState<SavedPreset[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { session, start, decrement, undo, pause, resume, reset, clear } =
    useCountdownSession('pradakshina');

  const refreshPresets = useCallback(() => {
    try {
      setPresets(getSavedPresets('pradakshina'));
    } catch {
      // Ignore if DB unavailable
    }
  }, []);

  useFocusEffect(refreshPresets);

  const handleStart = () => {
    const trimmedTemple = templeName.trim();
    const parsedTarget = Number.parseInt(targetInput, 10);

    if (!trimmedTemple) {
      setErrorMessage(t.pradakshina.errorTemple);
      return;
    }
    if (!Number.isFinite(parsedTarget) || parsedTarget < 1) {
      setErrorMessage(t.pradakshina.errorTarget);
      return;
    }

    if (shouldSavePreset) {
      savePreset('pradakshina', trimmedTemple, parsedTarget);
      refreshPresets();
    }

    setErrorMessage(null);
    start(trimmedTemple, parsedTarget);
  };

  if (session) {
    return (
      <CountdownCounter
        session={session}
        fallbackLabel={t.pradakshina.fallbackLabel}
        onDecrement={decrement}
        onUndo={undo}
        onPause={pause}
        onResume={resume}
        onReset={reset}
        onClear={clear}
      />
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.eyebrow}>{t.pradakshina.eyebrow}</Text>
        <Text style={styles.title}>{t.pradakshina.title}</Text>
        <Text style={styles.subtitle}>{t.pradakshina.subtitle}</Text>

        {presets.length > 0 ? (
          <View style={styles.field}>
            <Text style={styles.label}>{t.common.savedPresets}</Text>
            <View style={styles.presetsWrap}>
              {presets.map((preset) => (
                <View key={preset.id} style={styles.presetChip}>
                  <Pressable
                    onPress={() => {
                      setTempleName(preset.label);
                      setTargetInput(String(preset.targetCount));
                    }}
                    style={styles.presetSelect}
                  >
                    <Text style={styles.presetText} numberOfLines={1}>
                      {preset.label} · {preset.targetCount}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      deletePreset(preset.id);
                      refreshPresets();
                    }}
                    style={styles.presetDelete}
                    accessibilityRole="button"
                  >
                    <Text style={styles.presetDeleteText}>×</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        <View style={styles.field}>
          <Text style={styles.label}>{t.pradakshina.templeLabel}</Text>
          <TextInput
            style={styles.input}
            value={templeName}
            onChangeText={setTempleName}
            placeholder={t.pradakshina.templePlaceholder}
            placeholderTextColor={colors.textMuted}
            returnKeyType="next"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>{t.pradakshina.targetLabel}</Text>
          <TextInput
            style={styles.input}
            value={targetInput}
            onChangeText={setTargetInput}
            keyboardType="number-pad"
            placeholder="11"
            placeholderTextColor={colors.textMuted}
          />
        </View>

        <View style={styles.saveRow}>
          <Text style={styles.saveLabel}>{t.common.savePreset}</Text>
          <Switch
            value={shouldSavePreset}
            onValueChange={setShouldSavePreset}
            trackColor={{ false: colors.surfaceAlt, true: colors.gold }}
            thumbColor={colors.textPrimary}
          />
        </View>

        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

        <Pressable
          style={({ pressed }) => [
            styles.startButton,
            pressed && styles.startButtonPressed,
          ]}
          onPress={handleStart}
          accessibilityRole="button"
        >
          <Text style={styles.startButtonText}>{t.pradakshina.startButton}</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  eyebrow: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.4,
    marginBottom: 6,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  presetsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.earthLight,
    borderWidth: 1,
    borderRadius: 999,
    maxWidth: '100%',
  },
  presetSelect: {
    paddingLeft: 12,
    paddingVertical: 7,
    paddingRight: 6,
  },
  presetText: {
    color: colors.goldSoft,
    fontSize: 13,
    fontWeight: '600',
    maxWidth: 220,
  },
  presetDelete: {
    paddingRight: 10,
    paddingLeft: 4,
    paddingVertical: 6,
  },
  presetDeleteText: {
    color: colors.textMuted,
    fontSize: 16,
    fontWeight: '700',
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    color: colors.textPrimary,
    fontSize: 16,
  },
  saveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  saveLabel: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  error: {
    color: colors.danger,
    fontSize: 14,
    marginBottom: 14,
  },
  startButton: {
    backgroundColor: colors.gold,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  startButtonPressed: {
    opacity: 0.85,
  },
  startButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '700',
  },
});
