import React, { useMemo, useState } from 'react';
import {
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
import { ALL_ASHTOTHRAMS } from '../data/ashtothrams';
import { useLanguage } from '../i18n/LanguageContext';
import { colors } from '../theme/colors';
import type { MantraEntry, MantraScript } from '../types/practice';

interface AshtothramModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectAshtothram: (ashtothram: MantraEntry) => void;
  preferredScript?: MantraScript;
  onChangeScript?: (script: MantraScript) => void;
}

const DEITY_ICONS: Record<string, string> = {
  'builtin-ashtothram-ganesha': '🐘',
  'builtin-ashtothram-shiva': '🔱',
  'builtin-ashtothram-venkateswara': '🛕',
  'builtin-ashtothram-lakshmi': '🪷',
  'builtin-ashtothram-hanuman': '🚩',
  'builtin-ashtothram-krishna': '🦚',
  'builtin-ashtothram-rama': '🏹',
  'builtin-ashtothram-durga': '🦁',
};

export function AshtothramModal({
  visible,
  onClose,
  onSelectAshtothram,
  preferredScript,
  onChangeScript,
}: AshtothramModalProps) {
  const insets = useSafeAreaInsets();
  const { language, t } = useLanguage();

  const [selectedDeity, setSelectedDeity] = useState<MantraEntry | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [internalScript, setInternalScript] = useState<MantraScript>(
    preferredScript || (language === 'te' ? 'telugu' : 'sanskrit')
  );

  const activeScript = preferredScript || internalScript;

  const handleScriptChange = (s: MantraScript) => {
    setInternalScript(s);
    onChangeScript?.(s);
  };

  const filteredDeities = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return ALL_ASHTOTHRAMS as MantraEntry[];
    }
    return (ALL_ASHTOTHRAMS as MantraEntry[]).filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        (d.deity && d.deity.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const filteredNames = useMemo(() => {
    if (!selectedDeity || !selectedDeity.names) {
      return [];
    }
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return selectedDeity.names;
    }
    return selectedDeity.names.filter(
      (n) =>
        String(n.num) === q ||
        n.english.toLowerCase().includes(q) ||
        n.telugu.toLowerCase().includes(q) ||
        n.sanskrit.toLowerCase().includes(q)
    );
  }, [selectedDeity, searchQuery]);

  const handleStartArchana = (deity: MantraEntry) => {
    onSelectAshtothram(deity);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={[
          styles.container,
          {
            paddingTop: Math.max(insets.top, 16),
            paddingBottom: Math.max(insets.bottom, 16),
          },
        ]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTitleBlock}>
            {selectedDeity ? (
              <Pressable
                style={styles.backButton}
                onPress={() => {
                  setSelectedDeity(null);
                  setSearchQuery('');
                }}
                hitSlop={8}
              >
                <Text style={styles.backButtonText}>← {t.ashtothram.allDeities}</Text>
              </Pressable>
            ) : (
              <Text style={styles.headerEyebrow}>{t.ashtothram.badge}</Text>
            )}
            <Text style={styles.headerTitle} numberOfLines={1}>
              {selectedDeity ? selectedDeity.name : t.ashtothram.title}
            </Text>
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

        {/* Script Selection Bar */}
        <View style={styles.scriptBar}>
          <Pressable
            style={[
              styles.scriptTab,
              activeScript === 'sanskrit' && styles.scriptTabSelected,
            ]}
            onPress={() => handleScriptChange('sanskrit')}
          >
            <Text
              style={[
                styles.scriptTabText,
                activeScript === 'sanskrit' && styles.scriptTabTextSelected,
              ]}
            >
              {t.japa.sanskritTab}
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.scriptTab,
              activeScript === 'telugu' && styles.scriptTabSelected,
            ]}
            onPress={() => handleScriptChange('telugu')}
          >
            <Text
              style={[
                styles.scriptTabText,
                activeScript === 'telugu' && styles.scriptTabTextSelected,
              ]}
            >
              {t.japa.teluguTab}
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.scriptTab,
              activeScript === 'english' && styles.scriptTabSelected,
            ]}
            onPress={() => handleScriptChange('english')}
          >
            <Text
              style={[
                styles.scriptTabText,
                activeScript === 'english' && styles.scriptTabTextSelected,
              ]}
            >
              {t.japa.englishTab}
            </Text>
          </Pressable>
        </View>

        {/* Search Bar */}
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder={
              selectedDeity
                ? t.ashtothram.searchPlaceholder
                : t.ashtothram.searchPlaceholder
            }
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
        </View>

        {/* VIEW 1: Deity Selection List */}
        {!selectedDeity ? (
          <ScrollView
            style={styles.contentScroll}
            contentContainerStyle={styles.deitiesGrid}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.sectionSubtitle}>
              {t.ashtothram.subtitle}
            </Text>

            {filteredDeities.map((item) => {
              const icon = DEITY_ICONS[item.id] || '🌸';
              return (
                <Pressable
                  key={item.id}
                  style={({ pressed }) => [
                    styles.deityCard,
                    pressed && styles.deityCardPressed,
                  ]}
                  onPress={() => {
                    setSelectedDeity(item);
                    setSearchQuery('');
                  }}
                >
                  <View style={styles.deityCardHeader}>
                    <Text style={styles.deityIcon}>{icon}</Text>
                    <View style={styles.deityBadge}>
                      <Text style={styles.deityBadgeText}>108</Text>
                    </View>
                  </View>

                  <Text style={styles.deityName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  {item.deity ? (
                    <Text style={styles.deitySubtext}>{item.deity}</Text>
                  ) : null}

                  <View style={styles.deityCardFooter}>
                    <Text style={styles.viewLinkText}>
                      {t.ashtothram.viewAllNames} →
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        ) : (
          /* VIEW 2: Selected Deity 108 Names List */
          <View style={styles.namesContainer}>
            {/* Start Archana Action Bar */}
            <View style={styles.actionBar}>
              <View style={styles.actionMeta}>
                <Text style={styles.actionCount}>
                  {selectedDeity.names?.length ?? 108} {t.ashtothram.namesCount}
                </Text>
                <Text style={styles.actionDeity}>
                  {selectedDeity.deity}
                </Text>
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.startArchanaButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={() => handleStartArchana(selectedDeity)}
                accessibilityRole="button"
              >
                <Text style={styles.startArchanaButtonText}>
                  🌸 {t.ashtothram.startArchana}
                </Text>
              </Pressable>
            </View>

            <ScrollView
              style={styles.contentScroll}
              contentContainerStyle={styles.namesListContent}
              keyboardShouldPersistTaps="handled"
            >
              {filteredNames.map((nama) => {
                const primaryText =
                  activeScript === 'sanskrit'
                    ? nama.sanskrit
                    : activeScript === 'telugu'
                      ? nama.telugu
                      : nama.english;

                const secondaryText =
                  activeScript === 'sanskrit'
                    ? nama.telugu
                    : activeScript === 'telugu'
                      ? nama.sanskrit
                      : nama.sanskrit;

                return (
                  <View key={nama.num} style={styles.namaRow}>
                    <View style={styles.namaNumBadge}>
                      <Text style={styles.namaNumText}>{nama.num}</Text>
                    </View>
                    <View style={styles.namaTextBlock}>
                      <Text style={styles.namaPrimaryText}>{primaryText}</Text>
                      {activeScript !== 'english' ? (
                        <Text style={styles.namaSecondaryText}>
                          {nama.english}
                        </Text>
                      ) : (
                        <Text style={styles.namaSecondaryText}>
                          {secondaryText}
                        </Text>
                      )}
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
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
  headerTitleBlock: {
    flex: 1,
    marginRight: 10,
  },
  headerEyebrow: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    marginTop: 2,
  },
  backButton: {
    marginBottom: 2,
  },
  backButtonText: {
    color: colors.goldSoft,
    fontSize: 13,
    fontWeight: '700',
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
    paddingHorizontal: 20,
    marginTop: 12,
  },
  searchInput: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: colors.textPrimary,
    fontSize: 14,
  },
  contentScroll: {
    flex: 1,
  },
  sectionSubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  deitiesGrid: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 12,
  },
  deityCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  deityCardPressed: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.gold,
  },
  deityCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  deityIcon: {
    fontSize: 28,
  },
  deityBadge: {
    backgroundColor: colors.earth,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  deityBadgeText: {
    color: colors.goldSoft,
    fontSize: 12,
    fontWeight: '700',
  },
  deityName: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  deitySubtext: {
    color: colors.goldSoft,
    fontSize: 13,
    fontWeight: '600',
  },
  deityCardFooter: {
    marginTop: 12,
    alignItems: 'flex-end',
  },
  viewLinkText: {
    color: colors.goldSoft,
    fontSize: 13,
    fontWeight: '700',
  },
  namesContainer: {
    flex: 1,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginTop: 8,
    gap: 12,
  },
  actionMeta: {
    flex: 1,
  },
  actionCount: {
    color: colors.goldSoft,
    fontSize: 14,
    fontWeight: '700',
  },
  actionDeity: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  startArchanaButton: {
    backgroundColor: colors.gold,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: 'center',
  },
  startArchanaButtonText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '700',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  namesListContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 10,
  },
  namaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  namaNumBadge: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  namaNumText: {
    color: colors.goldSoft,
    fontSize: 13,
    fontWeight: '700',
  },
  namaTextBlock: {
    flex: 1,
  },
  namaPrimaryText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  namaSecondaryText: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 2,
    fontStyle: 'italic',
  },
});
