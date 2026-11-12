import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import { MantraLibraryModal } from '../components/MantraLibraryModal';
import {
  deletePreset,
  getAllMantras,
  getSavedPresets,
  savePreset,
} from '../db/database';
import { useCountdownSession } from '../engine/useCountdownSession';
import { getMantraDisplayText } from '../engine/mantraLibrary';
import { useLanguage } from '../i18n/LanguageContext';
import { useAppMenu } from '../navigation/MenuContext';
import { colors } from '../theme/colors';
import {
  DEFAULT_JAPA_TARGET,
  JAPA_SUGGESTED_TARGETS,
  type MantraEntry,
  type MantraScript,
  type SavedPreset,
} from '../types/practice';

export function JapaScreen() {
  const { language, t } = useLanguage();
  const [mantraName, setMantraName] = useState('');
  const [targetInput, setTargetInput] = useState(String(DEFAULT_JAPA_TARGET));
  const [shouldSavePreset, setShouldSavePreset] = useState(true);
  const [presets, setPresets] = useState<SavedPreset[]>([]);
  const [allMantras, setAllMantras] = useState<MantraEntry[]>([]);
  const [selectedMantra, setSelectedMantra] = useState<MantraEntry | null>(null);
  const [preferredScript, setPreferredScript] = useState<MantraScript>(
    language === 'te' ? 'telugu' : 'sanskrit'
  );
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isMantraTextExpanded, setIsMantraTextExpanded] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { selectedAshtothramForJapa, clearSelectedAshtothram } = useAppMenu();

  const { session, start, decrement, undo, pause, resume, reset, clear } =
    useCountdownSession('japa');

  // Keep script updated if user changes app language and hasn't manually overridden
  useEffect(() => {
    setPreferredScript(language === 'te' ? 'telugu' : 'sanskrit');
  }, [language]);

  const handleSelectMantra = useCallback((mantra: MantraEntry) => {
    setMantraName(mantra.name);
    setTargetInput(String(mantra.defaultTarget));
    setSelectedMantra(mantra);
    setIsMantraTextExpanded(true);
    setErrorMessage(null);
  }, []);

  // When triggered from Ashtothram menu or modal, auto-fill and prepare session
  useEffect(() => {
    if (selectedAshtothramForJapa) {
      handleSelectMantra(selectedAshtothramForJapa);
      clearSelectedAshtothram();
    }
  }, [selectedAshtothramForJapa, handleSelectMantra, clearSelectedAshtothram]);

  const refreshData = useCallback(() => {
    try {
      setPresets(getSavedPresets('japa'));
      setAllMantras(getAllMantras());
    } catch {
      // Ignore if DB unavailable
    }
  }, []);

  useFocusEffect(refreshData);

  // Match selected mantra when user edits or selects
  const activeMantraEntry = useMemo(() => {
    if (selectedMantra && selectedMantra.name.toLowerCase() === mantraName.trim().toLowerCase()) {
      return selectedMantra;
    }
    const trimmed = mantraName.trim().toLowerCase();
    if (!trimmed) {
      return null;
    }
    return (
      allMantras.find(
        (m) =>
          m.name.toLowerCase() === trimmed ||
          (m.textEnglish && m.textEnglish.toLowerCase().includes(trimmed))
      ) ?? null
    );
  }, [selectedMantra, mantraName, allMantras]);

  const activeMantraText = activeMantraEntry
    ? getMantraDisplayText(activeMantraEntry, preferredScript)
    : undefined;

  const favoriteMantras = useMemo(
    () => allMantras.filter((m) => m.isFavorite),
    [allMantras]
  );

  const parsedTarget = Number.parseInt(targetInput, 10);

  const handleStart = () => {
    if (!Number.isFinite(parsedTarget) || parsedTarget < 1) {
      setErrorMessage(t.japa.errorTarget);
      return;
    }

    const trimmedMantra = mantraName.trim();
    if (shouldSavePreset && trimmedMantra) {
      savePreset('japa', trimmedMantra, parsedTarget);
      refreshData();
    }

    setErrorMessage(null);
    start(trimmedMantra, parsedTarget);
  };

  if (session) {
    return (
      <CountdownCounter
        session={session}
        fallbackLabel={t.japa.fallbackLabel}
        mantraText={activeMantraText}
        ashtothramNames={activeMantraEntry?.names}
        preferredScript={preferredScript}
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
        <Text style={styles.eyebrow}>{t.japa.eyebrow}</Text>
        <Text style={styles.title}>{t.japa.title}</Text>
        <Text style={styles.subtitle}>{t.japa.subtitle}</Text>

        {/* Favorite Mantras Quick Bar */}
        {favoriteMantras.length > 0 ? (
          <View style={styles.field}>
            <Text style={styles.label}>★ {t.japa.favoriteMantras}</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.favoritesRow}
            >
              {favoriteMantras.map((fav) => {
                const isSelected = activeMantraEntry?.id === fav.id;
                return (
                  <Pressable
                    key={fav.id}
                    style={[
                      styles.favoriteChip,
                      isSelected && styles.favoriteChipSelected,
                    ]}
                    onPress={() => handleSelectMantra(fav)}
                    accessibilityRole="button"
                  >
                    <Text
                      style={[
                        styles.favoriteChipText,
                        isSelected && styles.favoriteChipTextSelected,
                      ]}
                      numberOfLines={1}
                    >
                      ★ {fav.name} · {fav.defaultTarget}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        ) : null}

        {/* Saved Presets */}
        {presets.length > 0 ? (
          <View style={styles.field}>
            <Text style={styles.label}>{t.common.savedPresets}</Text>
            <View style={styles.presetsWrap}>
              {presets.map((preset) => (
                <View key={preset.id} style={styles.presetChip}>
                  <Pressable
                    onPress={() => {
                      setMantraName(preset.label);
                      setTargetInput(String(preset.targetCount));
                      setSelectedMantra(null);
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
                      refreshData();
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

        {/* Mantra Input with Browse Library Button */}
        <View style={styles.field}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>{t.japa.mantraLabel}</Text>
            <Pressable
              style={styles.browseButton}
              onPress={() => setIsLibraryOpen(true)}
              accessibilityRole="button"
            >
              <Text style={styles.browseButtonText}>
                📖 {t.japa.browseLibrary}
              </Text>
            </Pressable>
          </View>
          <TextInput
            style={styles.input}
            value={mantraName}
            onChangeText={(text) => {
              setMantraName(text);
              if (selectedMantra && selectedMantra.name !== text) {
                setSelectedMantra(null);
              }
            }}
            placeholder={t.japa.mantraPlaceholder}
            placeholderTextColor={colors.textMuted}
            returnKeyType="next"
          />
        </View>

        {/* Active Mantra Sacred Text Card (Collapsible) */}
        {activeMantraEntry && activeMantraText ? (
          <View style={styles.mantraTextCard}>
            <View style={styles.mantraTextHeader}>
              <View style={styles.mantraTextHeaderTitle}>
                <Text style={styles.mantraTextName}>
                  {activeMantraEntry.name}
                </Text>
                {activeMantraEntry.deity ? (
                  <Text style={styles.mantraTextDeity}>
                    ({activeMantraEntry.deity})
                  </Text>
                ) : null}
              </View>

              <View style={styles.scriptMiniSwitcher}>
                <Pressable
                  onPress={() => setPreferredScript('sanskrit')}
                  style={[
                    styles.scriptMiniTab,
                    preferredScript === 'sanskrit' && styles.scriptMiniTabActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.scriptMiniTabText,
                      preferredScript === 'sanskrit' &&
                        styles.scriptMiniTabTextActive,
                    ]}
                  >
                    संस्कृत
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setPreferredScript('telugu')}
                  style={[
                    styles.scriptMiniTab,
                    preferredScript === 'telugu' && styles.scriptMiniTabActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.scriptMiniTabText,
                      preferredScript === 'telugu' &&
                        styles.scriptMiniTabTextActive,
                    ]}
                  >
                    తెలుగు
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setPreferredScript('english')}
                  style={[
                    styles.scriptMiniTab,
                    preferredScript === 'english' && styles.scriptMiniTabActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.scriptMiniTabText,
                      preferredScript === 'english' &&
                        styles.scriptMiniTabTextActive,
                    ]}
                  >
                    En
                  </Text>
                </Pressable>
              </View>
            </View>

            {isMantraTextExpanded ? (
              <View style={styles.mantraTextBody}>
                <Text style={styles.mantraTextContent}>
                  {activeMantraText}
                </Text>
              </View>
            ) : null}

            <Pressable
              style={styles.mantraTextToggle}
              onPress={() => setIsMantraTextExpanded((prev) => !prev)}
            >
              <Text style={styles.mantraTextToggleText}>
                {isMantraTextExpanded
                  ? t.japa.hideMantraCard
                  : t.japa.viewMantraCard}
              </Text>
            </Pressable>
          </View>
        ) : null}

        {/* Suggested Targets */}
        <View style={styles.field}>
          <Text style={styles.label}>{t.japa.suggestedLabel}</Text>
          <View style={styles.chipsRow}>
            {JAPA_SUGGESTED_TARGETS.map((preset) => {
              const isSelected = parsedTarget === preset;
              return (
                <Pressable
                  key={preset}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                  onPress={() => setTargetInput(String(preset))}
                  accessibilityRole="button"
                >
                  <Text
                    style={[
                      styles.chipText,
                      isSelected && styles.chipTextSelected,
                    ]}
                  >
                    {preset}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Custom Target Input */}
        <View style={styles.field}>
          <Text style={styles.label}>{t.japa.customLabel}</Text>
          <TextInput
            style={styles.input}
            value={targetInput}
            onChangeText={setTargetInput}
            keyboardType="number-pad"
            placeholder="108"
            placeholderTextColor={colors.textMuted}
          />
        </View>

        {/* Save Preset Switch */}
        {mantraName.trim().length > 0 ? (
          <View style={styles.saveRow}>
            <Text style={styles.saveLabel}>{t.common.savePreset}</Text>
            <Switch
              value={shouldSavePreset}
              onValueChange={setShouldSavePreset}
              trackColor={{ false: colors.surfaceAlt, true: colors.gold }}
              thumbColor={colors.textPrimary}
            />
          </View>
        ) : null}

        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

        <Pressable
          style={({ pressed }) => [
            styles.startButton,
            pressed && styles.startButtonPressed,
          ]}
          onPress={handleStart}
          accessibilityRole="button"
        >
          <Text style={styles.startButtonText}>{t.japa.startButton}</Text>
        </Pressable>
      </ScrollView>

      {/* Mantra Library Modal */}
      <MantraLibraryModal
        visible={isLibraryOpen}
        onClose={() => {
          setIsLibraryOpen(false);
          refreshData();
        }}
        onSelectMantra={handleSelectMantra}
        preferredScript={preferredScript}
        onChangeScript={setPreferredScript}
      />
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
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  browseButton: {
    backgroundColor: colors.surface,
    borderColor: colors.gold,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  browseButtonText: {
    color: colors.goldSoft,
    fontSize: 12,
    fontWeight: '700',
  },
  favoritesRow: {
    gap: 8,
    paddingBottom: 4,
  },
  favoriteChip: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  favoriteChipSelected: {
    backgroundColor: colors.earth,
    borderColor: colors.gold,
  },
  favoriteChipText: {
    color: colors.goldSoft,
    fontSize: 13,
    fontWeight: '600',
  },
  favoriteChipTextSelected: {
    color: colors.ivoryWarm,
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
  mantraTextCard: {
    backgroundColor: colors.surface,
    borderColor: colors.gold,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  mantraTextHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mantraTextHeaderTitle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  mantraTextName: {
    color: colors.goldSoft,
    fontSize: 15,
    fontWeight: '700',
  },
  mantraTextDeity: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  scriptMiniSwitcher: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceAlt,
    borderRadius: 8,
    padding: 2,
    gap: 2,
  },
  scriptMiniTab: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  scriptMiniTabActive: {
    backgroundColor: colors.earth,
  },
  scriptMiniTabText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  scriptMiniTabTextActive: {
    color: colors.goldSoft,
    fontWeight: '700',
  },
  mantraTextBody: {
    marginTop: 10,
    padding: 10,
    backgroundColor: colors.surfaceAlt,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: colors.gold,
  },
  mantraTextContent: {
    color: colors.ivoryWarm,
    fontSize: 15,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  mantraTextToggle: {
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  mantraTextToggleText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  chipSelected: {
    backgroundColor: colors.earth,
    borderColor: colors.gold,
  },
  chipText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '700',
  },
  chipTextSelected: {
    color: colors.goldSoft,
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

