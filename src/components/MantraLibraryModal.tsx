import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getDeityImage } from '../data/deityImages';
import { TabIcon } from './TabIcon';
import {
  deleteCustomMantra,
  getAllMantras,
  getMantraHistoryStatsMap,
  saveCustomMantra,
  toggleMantraFavorite,
} from '../db/database';
import {
  filterMantras,
  getMantraDisplayText,
  getStatsForMantra,
  type MantraFilterTab,
} from '../engine/mantraLibrary';
import { useLanguage } from '../i18n/LanguageContext';
import { colors } from '../theme/colors';
import type {
  MantraEntry,
  MantraHistoryStats,
  MantraScript,
} from '../types/practice';

interface MantraLibraryModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectMantra: (mantra: MantraEntry) => void;
  preferredScript?: MantraScript;
  onChangeScript?: (script: MantraScript) => void;
}

export function MantraLibraryModal({
  visible,
  onClose,
  onSelectMantra,
  preferredScript: propPreferredScript,
}: MantraLibraryModalProps) {
  const insets = useSafeAreaInsets();
  const { language, t } = useLanguage();
  const preferredScript = propPreferredScript || (language === 'te' ? 'telugu' : 'english');

  const [mantras, setMantras] = useState<MantraEntry[]>([]);
  const [statsMap, setStatsMap] = useState<Record<string, MantraHistoryStats>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<MantraFilterTab>('all');
  const [isCreating, setIsCreating] = useState(false);

  // Custom mantra creation form state
  const [name, setName] = useState('');
  const [deity, setDeity] = useState('');
  const [textSanskrit, setTextSanskrit] = useState('');
  const [textTelugu, setTextTelugu] = useState('');
  const [textEnglish, setTextEnglish] = useState('');
  const [defaultTarget, setDefaultTarget] = useState('108');
  const [formError, setFormError] = useState<string | null>(null);

  const refreshData = useCallback(() => {
    try {
      setMantras(getAllMantras());
      setStatsMap(getMantraHistoryStatsMap());
    } catch {
      // Ignore if DB not ready
    }
  }, []);

  useEffect(() => {
    if (visible) {
      refreshData();
      setIsCreating(false);
      setFormError(null);
    }
  }, [visible, refreshData]);

  const handleToggleFavorite = (mantraId: string) => {
    toggleMantraFavorite(mantraId);
    refreshData();
  };

  const handleDeleteCustom = (mantra: MantraEntry) => {
    Alert.alert(
      t.common.confirm,
      `${mantra.name} — ${t.counter.confirmResetBody.replace('session progress', 'mantra')}`,
      [
        { text: t.common.cancel, style: 'cancel' },
        {
          text: t.history.clearButton,
          style: 'destructive',
          onPress: () => {
            deleteCustomMantra(mantra.id);
            refreshData();
          },
        },
      ]
    );
  };

  const handleSaveCustomMantra = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setFormError(t.japa.mantraNameField);
      return;
    }
    const parsedTarget = Number.parseInt(defaultTarget, 10);
    if (!Number.isFinite(parsedTarget) || parsedTarget < 1) {
      setFormError(t.japa.errorTarget);
      return;
    }

    const created = saveCustomMantra({
      name: trimmedName,
      deity: deity.trim() || undefined,
      textSanskrit: textSanskrit.trim() || undefined,
      textTelugu: textTelugu.trim() || undefined,
      textEnglish: textEnglish.trim() || undefined,
      defaultTarget: parsedTarget,
    });

    setName('');
    setDeity('');
    setTextSanskrit('');
    setTextTelugu('');
    setTextEnglish('');
    setDefaultTarget('108');
    setFormError(null);
    setIsCreating(false);
    refreshData();
    onSelectMantra(created);
    onClose();
  };

  const filteredMantras = filterMantras(mantras, searchQuery, activeTab);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={[
          styles.modalContainer,
          {
            paddingTop: Math.max(insets.top, 16),
            paddingBottom: Math.max(insets.bottom, 16),
          },
        ]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header Bar */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerEyebrow}>{t.tabs.japa.toUpperCase()}</Text>
            <Text style={styles.headerTitle}>{t.japa.browseLibrary}</Text>
          </View>
          <Pressable
            style={styles.closeButton}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel={t.common.cancel}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </Pressable>
        </View>



        {/* Search & New Mantra Button */}
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder={t.japa.searchMantras}
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
          <Pressable
            style={[
              styles.createToggleBtn,
              isCreating && styles.createToggleBtnActive,
            ]}
            onPress={() => {
              setIsCreating((prev) => !prev);
              setFormError(null);
            }}
          >
            <Text
              style={[
                styles.createToggleBtnText,
                isCreating && styles.createToggleBtnTextActive,
              ]}
            >
              {isCreating ? t.common.cancel : t.japa.newMantra}
            </Text>
          </Pressable>
        </View>

        {/* Create Custom Mantra Form (Collapsible) */}
        {isCreating ? (
          <ScrollView
            style={styles.formContainer}
            contentContainerStyle={styles.formContent}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.formTitle}>{t.japa.createMantraTitle}</Text>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>{t.japa.mantraNameField} *</Text>
              <TextInput
                style={styles.formInput}
                value={name}
                onChangeText={setName}
                placeholder="e.g. Gayatri Mantra"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>{t.japa.deityField}</Text>
              <TextInput
                style={styles.formInput}
                value={deity}
                onChangeText={setDeity}
                placeholder="e.g. Savitr / Surya"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>{t.japa.defaultTargetField} *</Text>
              <TextInput
                style={styles.formInput}
                value={defaultTarget}
                onChangeText={setDefaultTarget}
                keyboardType="number-pad"
                placeholder="108"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>{t.japa.sanskritTextField}</Text>
              <TextInput
                style={[styles.formInput, styles.formInputMultiline]}
                value={textSanskrit}
                onChangeText={setTextSanskrit}
                placeholder="ॐ भूर्भुवः स्वः..."
                placeholderTextColor={colors.textMuted}
                multiline
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>{t.japa.teluguTextField}</Text>
              <TextInput
                style={[styles.formInput, styles.formInputMultiline]}
                value={textTelugu}
                onChangeText={setTextTelugu}
                placeholder="ఓం భూర్భువస్స్వః..."
                placeholderTextColor={colors.textMuted}
                multiline
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>{t.japa.englishTextField}</Text>
              <TextInput
                style={[styles.formInput, styles.formInputMultiline]}
                value={textEnglish}
                onChangeText={setTextEnglish}
                placeholder="Om bhūr bhuvaḥ svaḥ..."
                placeholderTextColor={colors.textMuted}
                multiline
              />
            </View>

            {formError ? <Text style={styles.formError}>{formError}</Text> : null}

            <Pressable
              style={styles.saveMantraButton}
              onPress={handleSaveCustomMantra}
            >
              <Text style={styles.saveMantraButtonText}>
                {t.japa.saveMantraButton}
              </Text>
            </Pressable>
          </ScrollView>
        ) : null}

        {/* Filter Tabs (All / Favorites / Custom) */}
        {!isCreating ? (
          <View style={styles.filterTabs}>
            <Pressable
              style={[
                styles.filterTab,
                activeTab === 'all' && styles.filterTabSelected,
              ]}
              onPress={() => setActiveTab('all')}
            >
              <Text
                style={[
                  styles.filterTabText,
                  activeTab === 'all' && styles.filterTabTextSelected,
                ]}
              >
                {t.japa.allMantras} ({mantras.length})
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.filterTab,
                activeTab === 'favorites' && styles.filterTabSelected,
              ]}
              onPress={() => setActiveTab('favorites')}
            >
              <Text
                style={[
                  styles.filterTabText,
                  activeTab === 'favorites' && styles.filterTabTextSelected,
                ]}
              >
                ★ {t.japa.favoriteMantras} (
                {mantras.filter((m) => m.isFavorite).length})
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.filterTab,
                activeTab === 'ashtothram' && styles.filterTabSelected,
              ]}
              onPress={() => setActiveTab('ashtothram')}
            >
              <View style={styles.tabInlineWrap}>
                <TabIcon
                  name="Ashtothram"
                  color={
                    activeTab === 'ashtothram'
                      ? colors.goldSoft
                      : colors.textSecondary
                  }
                  size={13}
                />
                <Text
                  style={[
                    styles.filterTabText,
                    activeTab === 'ashtothram' && styles.filterTabTextSelected,
                  ]}
                >
                  {t.ashtothram.title} (
                  {mantras.filter((m) => m.category === 'ashtothram').length})
                </Text>
              </View>
            </Pressable>

            <Pressable
              style={[
                styles.filterTab,
                activeTab === 'custom' && styles.filterTabSelected,
              ]}
              onPress={() => setActiveTab('custom')}
            >
              <Text
                style={[
                  styles.filterTabText,
                  activeTab === 'custom' && styles.filterTabTextSelected,
                ]}
              >
                {t.japa.customMantras} (
                {mantras.filter((m) => !m.isBuiltIn).length})
              </Text>
            </Pressable>
          </View>
        ) : null}

        {/* Mantra Cards List */}
        {!isCreating ? (
          <ScrollView
            style={styles.list}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
          >
            {filteredMantras.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>{t.history.empty}</Text>
              </View>
            ) : (
              filteredMantras.map((mantra) => {
                const stats = getStatsForMantra(mantra.name, statsMap);
                const displayText = getMantraDisplayText(mantra, preferredScript);

                return (
                  <Pressable
                    key={mantra.id}
                    style={({ pressed }) => [
                      styles.mantraCard,
                      mantra.isFavorite && styles.mantraCardFavorite,
                      pressed && styles.mantraCardPressed,
                    ]}
                    onPress={() => {
                      onSelectMantra(mantra);
                      onClose();
                    }}
                  >
                    <View style={styles.mantraCardRow}>
                      {getDeityImage(mantra.id) ? (
                        <Image
                          source={getDeityImage(mantra.id)!}
                          style={styles.cardDeityAvatar}
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={styles.cardAvatarFallback}>
                          <TabIcon
                            name={
                              mantra.category === 'ashtothram'
                                ? 'Ashtothram'
                                : 'MantraLibrary'
                            }
                            color={colors.goldSoft}
                            size={18}
                          />
                        </View>
                      )}

                      <View style={styles.mantraMainInfo}>
                        <View style={styles.titleRow}>
                          <Text style={styles.mantraName} numberOfLines={1}>
                            {mantra.name}
                          </Text>
                          {!mantra.isBuiltIn ? (
                            <View style={styles.customBadge}>
                              <Text style={styles.customBadgeText}>
                                {t.japa.customMantras}
                              </Text>
                            </View>
                          ) : null}
                        </View>

                        {displayText ? (
                          <Text
                            style={styles.scriptPreviewText}
                            numberOfLines={1}
                          >
                            {displayText}
                          </Text>
                        ) : mantra.deity ? (
                          <Text style={styles.deitySubText} numberOfLines={1}>
                            {mantra.deity}
                          </Text>
                        ) : null}

                        {stats && stats.sessionsCount > 0 ? (
                          <Text style={styles.compactStatsText}>
                            {stats.sessionsCount} {t.japa.mantraStatsSessions} ·{' '}
                            {stats.totalRepetitions} {t.japa.mantraStatsReps}
                          </Text>
                        ) : null}
                      </View>

                      <View style={styles.cardActions}>
                        <Pressable
                          style={styles.favoriteButton}
                          onPress={() => handleToggleFavorite(mantra.id)}
                          accessibilityRole="button"
                          accessibilityLabel={
                            mantra.isFavorite ? 'Unfavorite' : 'Favorite'
                          }
                          hitSlop={10}
                        >
                          <Text
                            style={[
                              styles.favoriteStar,
                              mantra.isFavorite && styles.favoriteStarActive,
                            ]}
                          >
                            {mantra.isFavorite ? '★' : '☆'}
                          </Text>
                        </Pressable>

                        {!mantra.isBuiltIn ? (
                          <Pressable
                            style={styles.deleteButton}
                            onPress={() => handleDeleteCustom(mantra)}
                            hitSlop={10}
                          >
                            <Text style={styles.deleteButtonText}>✕</Text>
                          </Pressable>
                        ) : null}
                      </View>
                    </View>
                  </Pressable>
                );
              })
            )}
          </ScrollView>
        ) : null}
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerEyebrow: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    marginTop: 2,
  },
  closeButton: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  scriptBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    padding: 4,
    marginHorizontal: 20,
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  scriptTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  scriptTabSelected: {
    backgroundColor: colors.earth,
  },
  scriptTabText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  scriptTabTextSelected: {
    color: colors.goldSoft,
    fontWeight: '700',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: colors.textPrimary,
    fontSize: 14,
  },
  createToggleBtn: {
    backgroundColor: colors.surface,
    borderColor: colors.gold,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  createToggleBtnActive: {
    backgroundColor: colors.earth,
  },
  createToggleBtnText: {
    color: colors.goldSoft,
    fontSize: 13,
    fontWeight: '700',
  },
  createToggleBtnTextActive: {
    color: colors.ivoryWarm,
  },
  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 12,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabInlineWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  filterTabSelected: {
    backgroundColor: colors.earth,
    borderColor: colors.gold,
  },
  filterTabText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  filterTabTextSelected: {
    color: colors.goldSoft,
    fontWeight: '700',
  },
  list: {
    flex: 1,
    marginTop: 10,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 12,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
  },
  mantraCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
  },
  mantraCardFavorite: {
    borderColor: colors.goldSoft,
  },
  mantraCardPressed: {
    backgroundColor: colors.surfaceAlt,
  },
  mantraCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardDeityAvatar: {
    width: 42,
    height: 42,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  cardAvatarFallback: {
    width: 42,
    height: 42,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mantraMainInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  mantraName: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  customBadge: {
    backgroundColor: colors.earth,
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  customBadgeText: {
    color: colors.goldSoft,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  scriptPreviewText: {
    color: colors.goldSoft,
    fontSize: 12,
    marginTop: 2,
    opacity: 0.9,
  },
  deitySubText: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  compactStatsText: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  favoriteButton: {
    padding: 6,
  },
  favoriteStar: {
    color: colors.textMuted,
    fontSize: 20,
    fontWeight: '700',
  },
  favoriteStarActive: {
    color: colors.gold,
  },
  deleteButton: {
    padding: 6,
  },
  deleteButtonText: {
    color: colors.textMuted,
    fontSize: 15,
    fontWeight: '700',
  },
  selectHintText: {
    color: colors.goldSoft,
    fontSize: 13,
    fontWeight: '700',
  },
  formContainer: {
    flex: 1,
    marginTop: 8,
  },
  formContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  formTitle: {
    color: colors.goldSoft,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  formField: {
    marginBottom: 12,
  },
  formLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  formInput: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.textPrimary,
    fontSize: 15,
  },
  formInputMultiline: {
    minHeight: 64,
    textAlignVertical: 'top',
  },
  formError: {
    color: colors.danger,
    fontSize: 13,
    marginBottom: 10,
  },
  saveMantraButton: {
    backgroundColor: colors.gold,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  saveMantraButtonText: {
    color: colors.background,
    fontSize: 15,
    fontWeight: '700',
  },
});
