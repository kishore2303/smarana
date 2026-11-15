import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ALL_ASHTOTHRAMS } from '../data/ashtothrams';
import { getDeityImage } from '../data/deityImages';
import { FontSizeControl, ReadingFontSize } from './FontSizeControl';
import { TabIcon } from './TabIcon';
import { TopLanguageToggle } from './TopLanguageToggle';
import { useLanguage } from '../i18n/LanguageContext';
import { colors } from '../theme/colors';
import type { AshtothramName, MantraEntry, MantraScript } from '../types/practice';

interface AshtothramModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectAshtothram: (ashtothram: MantraEntry) => void;
  preferredScript?: MantraScript;
  onChangeScript?: (script: MantraScript) => void;
}

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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [textSize, setTextSize] = useState<ReadingFontSize>('large');
  const [bookmarkedNama, setBookmarkedNama] = useState<number | null>(null);

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

  const handleBackToCatalog = () => {
    setSelectedDeity(null);
    setSearchQuery('');
    setIsSearchOpen(false);
    setBookmarkedNama(null);
  };

  const fontSizeConfig = {
    normal: { primary: 16, secondary: 13, line: 24 },
    large: { primary: 19, secondary: 14, line: 28 },
    xlarge: { primary: 23, secondary: 15, line: 33 },
    jumbo: { primary: 27, secondary: 17, line: 38 },
  }[textSize];

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
            paddingTop: Math.max(insets.top, 14),
            paddingBottom: Math.max(insets.bottom, 12),
          },
        ]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* VIEW 1: Deity Selection Catalog (2-Column Visual Grid) */}
        {!selectedDeity ? (
          <View style={styles.flex}>
            {/* Catalog Header */}
            <View style={styles.catalogHeader}>
              <View style={styles.catalogTitleBlock}>
                <View style={styles.eyebrowRow}>
                  <TabIcon name="Ashtothram" color={colors.goldSoft} size={15} />
                  <Text style={styles.catalogEyebrow}>{t.ashtothram.badge}</Text>
                </View>
                <Text style={styles.catalogTitle}>{t.ashtothram.title}</Text>
                <Text style={styles.catalogSubtitle} numberOfLines={1}>
                  {t.ashtothram.subtitle}
                </Text>
              </View>

              <View style={styles.catalogRightActions}>
                <TopLanguageToggle compact />
                <Pressable
                  style={styles.circleCloseButton}
                  onPress={onClose}
                  accessibilityRole="button"
                  accessibilityLabel={t.common.cancel}
                  hitSlop={10}
                >
                  <Text style={styles.circleCloseText}>✕</Text>
                </Pressable>
              </View>
            </View>

            {/* Search Input Bar */}
            <View style={styles.searchBarWrapper}>
              <View style={styles.searchInputContainer}>
                <Text style={styles.searchIconText}>🔍</Text>
                <TextInput
                  style={styles.searchInputField}
                  placeholder={t.ashtothram.searchPlaceholder}
                  placeholderTextColor={colors.textMuted}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  clearButtonMode="while-editing"
                />
                {searchQuery.length > 0 ? (
                  <Pressable
                    onPress={() => setSearchQuery('')}
                    hitSlop={8}
                    style={styles.clearSearchBtn}
                  >
                    <Text style={styles.clearSearchText}>✕</Text>
                  </Pressable>
                ) : null}
              </View>
            </View>

            {/* Compact Deities List with Full Portrait Avatars */}
            <FlatList
              data={filteredDeities}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.deityListContainer}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => {
                const imageSrc = getDeityImage(item.id);
                return (
                  <Pressable
                    style={({ pressed }) => [
                      styles.deityListItem,
                      pressed && styles.deityListItemPressed,
                    ]}
                    onPress={() => {
                      setSelectedDeity(item);
                      setSearchQuery('');
                      setIsSearchOpen(false);
                      setBookmarkedNama(null);
                    }}
                    accessibilityRole="button"
                  >
                    {imageSrc ? (
                      <Image
                        source={imageSrc}
                        style={styles.deityAvatar}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={styles.deityAvatarFallback}>
                        <TabIcon
                          name="Ashtothram"
                          color={colors.goldSoft}
                          size={24}
                        />
                      </View>
                    )}

                    <View style={styles.deityListInfo}>
                      <Text style={styles.deityListTitle} numberOfLines={1}>
                        {item.name.replace(' Ashtottara Shatanamavali', '')}
                      </Text>
                      {item.deity ? (
                        <Text style={styles.deityListSubtitle} numberOfLines={1}>
                          {item.deity}
                        </Text>
                      ) : null}
                    </View>

                    <Text style={styles.deityListChevron}>›</Text>
                  </Pressable>
                );
              }}
            />
          </View>
        ) : (
          /* VIEW 2: 108 Sacred Names Reader (Ultra-Clean, Large Readable Area) */
          <View style={styles.flex}>
            {/* Streamlined Minimalist Header */}
            <View style={styles.readerHeader}>
              <Pressable
                style={styles.readerBackButton}
                onPress={handleBackToCatalog}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel={t.ashtothram.allDeities}
              >
                <Text style={styles.readerBackArrow}>←</Text>
              </Pressable>

              <View style={styles.readerTitleBlock}>
                {getDeityImage(selectedDeity.id) ? (
                  <Image
                    source={getDeityImage(selectedDeity.id)!}
                    style={styles.readerAvatar}
                    resizeMode="cover"
                  />
                ) : null}
                <View style={styles.readerTitleTextWrap}>
                  <Text style={styles.readerTitle} numberOfLines={1}>
                    {selectedDeity.name.replace(' Ashtottara Shatanamavali', '')}
                  </Text>
                  <Text style={styles.readerCount}>
                    {selectedDeity.names?.length ?? 108} {t.ashtothram.namesCount}
                  </Text>
                </View>
              </View>

              <View style={styles.readerHeaderActions}>
                {/* Font Size Adjuster Control (A- / A+) for Elderly devotees */}
                <FontSizeControl
                  size={textSize}
                  onChangeSize={setTextSize}
                  compact
                />

                {/* Collapsible Search Toggle Button */}
                <Pressable
                  style={[
                    styles.readerActionBtn,
                    isSearchOpen && styles.readerActionBtnActive,
                  ]}
                  onPress={() => {
                    setIsSearchOpen((prev) => !prev);
                    if (isSearchOpen) setSearchQuery('');
                  }}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel="Toggle search"
                >
                  <Text style={styles.readerActionText}>🔍</Text>
                </Pressable>

                {/* Close Modal Button */}
                <Pressable
                  style={styles.readerCloseBtn}
                  onPress={onClose}
                  hitSlop={10}
                  accessibilityRole="button"
                  accessibilityLabel={t.common.cancel}
                >
                  <Text style={styles.readerCloseText}>✕</Text>
                </Pressable>
              </View>
            </View>

            {/* Collapsible Search Input Bar */}
            {isSearchOpen ? (
              <View style={styles.readerSearchRow}>
                <TextInput
                  style={styles.readerSearchInput}
                  placeholder={t.ashtothram.searchPlaceholder}
                  placeholderTextColor={colors.textMuted}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus
                  clearButtonMode="while-editing"
                />
                {searchQuery.length > 0 ? (
                  <Pressable
                    onPress={() => setSearchQuery('')}
                    hitSlop={8}
                    style={styles.readerClearBtn}
                  >
                    <Text style={styles.readerClearText}>✕</Text>
                  </Pressable>
                ) : null}
              </View>
            ) : null}



            {/* Tap-to-Bookmark Hint */}
            <View style={styles.bookmarkHintRow}>
              <Text style={styles.bookmarkHintText}>
                {bookmarkedNama
                  ? `${t.ashtothram.currentNama} ${bookmarkedNama} / 108`
                  : t.ashtothram.tapToHighlight}
              </Text>
            </View>

            {/* 108 Names List: Sacred Book Layout (No Clutter, Open Spacing) */}
            <FlatList
              data={filteredNames}
              keyExtractor={(item) => String(item.num)}
              contentContainerStyle={styles.namesListContent}
              keyboardShouldPersistTaps="handled"
              initialNumToRender={20}
              maxToRenderPerBatch={30}
              windowSize={11}
              renderItem={({ item }: { item: AshtothramName }) => {
                const isTelugu = language === 'te';
                const primaryText = isTelugu ? item.telugu : item.english || item.sanskrit;
                const secondaryText = isTelugu ? item.sanskrit : item.telugu;

                const isBookmarked = bookmarkedNama === item.num;

                return (
                  <Pressable
                    style={({ pressed }) => [
                      styles.namaRow,
                      isBookmarked && styles.namaRowBookmarked,
                      pressed && styles.namaRowPressed,
                    ]}
                    onPress={() =>
                      setBookmarkedNama((prev) =>
                        prev === item.num ? null : item.num
                      )
                    }
                  >
                    <View style={styles.namaNumColumn}>
                      <Text
                        style={[
                          styles.namaNumText,
                          isBookmarked && styles.namaNumTextBookmarked,
                        ]}
                      >
                        {item.num < 10 ? `0${item.num}` : item.num}
                      </Text>
                      {isBookmarked ? (
                        <View style={styles.bookmarkDot} />
                      ) : null}
                    </View>

                    <View style={styles.namaTextColumn}>
                      <Text
                        style={[
                          styles.namaPrimaryText,
                          {
                            fontSize: fontSizeConfig.primary,
                            lineHeight: fontSizeConfig.line,
                          },
                          isBookmarked && styles.namaPrimaryTextBookmarked,
                        ]}
                      >
                        {primaryText}
                      </Text>

                      {isTelugu ? (
                        <Text
                          style={[
                            styles.namaSecondaryText,
                            { fontSize: fontSizeConfig.secondary },
                          ]}
                        >
                          {item.english}
                        </Text>
                      ) : (
                        <Text
                          style={[
                            styles.namaSecondaryText,
                            { fontSize: fontSizeConfig.secondary },
                          ]}
                        >
                          {secondaryText}
                        </Text>
                      )}
                    </View>
                  </Pressable>
                );
              }}
            />

            {/* Floating "Start Archana" Bottom Bar */}
            <View style={styles.floatingBarContainer}>
              <Pressable
                style={({ pressed }) => [
                  styles.floatingStartButton,
                  pressed && styles.floatingStartButtonPressed,
                ]}
                onPress={() => handleStartArchana(selectedDeity)}
                accessibilityRole="button"
                accessibilityLabel={t.ashtothram.startArchana}
              >
                <TabIcon name="Ashtothram" color={colors.background} size={16} />
                <Text style={styles.floatingStartButtonText}>
                  {t.ashtothram.startArchana}
                </Text>
              </Pressable>
            </View>
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
  flex: {
    flex: 1,
  },

  /* Catalog View Styles */
  catalogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 10,
  },
  catalogTitleBlock: {
    flex: 1,
    marginRight: 12,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  catalogEyebrow: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  catalogTitle: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  catalogSubtitle: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 3,
  },
  catalogRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  circleCloseButton: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 18,
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  circleCloseText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
  searchBarWrapper: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIconText: {
    fontSize: 14,
    marginRight: 8,
    opacity: 0.7,
  },
  searchInputField: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 14,
    paddingVertical: 0,
  },
  clearSearchBtn: {
    padding: 4,
  },
  clearSearchText: {
    color: colors.textMuted,
    fontSize: 13,
  },

  /* Compact Deities List Layout */
  deityListContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 8,
  },
  deityListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    gap: 12,
  },
  deityListItemPressed: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.gold,
  },
  deityAvatar: {
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  deityAvatarFallback: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deityListInfo: {
    flex: 1,
  },
  deityListTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  deityListSubtitle: {
    color: colors.goldSoft,
    fontSize: 12,
    fontWeight: '500',
  },
  deityListChevron: {
    color: colors.textMuted,
    fontSize: 22,
    fontWeight: '300',
    paddingRight: 4,
  },

  /* Reader View (108 Names) Minimalist Header */
  readerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  readerBackButton: {
    paddingRight: 10,
    paddingVertical: 4,
  },
  readerBackArrow: {
    color: colors.goldSoft,
    fontSize: 20,
    fontWeight: '700',
  },
  readerTitleBlock: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  readerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  readerTitleTextWrap: {
    flex: 1,
  },
  readerTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  readerCount: {
    color: colors.goldSoft,
    fontSize: 11,
    fontWeight: '600',
  },
  readerHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  readerActionBtn: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  readerActionBtnActive: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.gold,
  },
  readerActionText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  readerActionSup: {
    fontSize: 9,
    color: colors.goldSoft,
    fontWeight: '800',
  },
  readerCloseBtn: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  readerCloseText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },

  /* Reader Collapsible Search */
  readerSearchRow: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  readerSearchInput: {
    flex: 1,
    height: 34,
    color: colors.textPrimary,
    fontSize: 13,
    paddingHorizontal: 8,
  },
  readerClearBtn: {
    padding: 6,
  },
  readerClearText: {
    color: colors.textMuted,
    fontSize: 13,
  },

  /* Slim Segmented Script Switcher */
  scriptSegmentBar: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 2,
    height: 32,
  },
  scriptSegment: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  scriptSegmentActive: {
    backgroundColor: colors.earth,
  },
  scriptSegmentText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  scriptSegmentTextActive: {
    color: colors.goldSoft,
    fontWeight: '700',
  },

  /* Bookmark Hint Row */
  bookmarkHintRow: {
    paddingHorizontal: 18,
    paddingVertical: 3,
  },
  bookmarkHintText: {
    color: colors.textMuted,
    fontSize: 11,
    fontStyle: 'italic',
  },

  /* Names List Content - Sacred Stotram Open Layout */
  namesListContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 85, // Generous padding so floating button doesn't hide last items
  },
  namaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(212, 175, 55, 0.15)',
    borderRadius: 8,
  },
  namaRowBookmarked: {
    backgroundColor: 'rgba(212, 175, 55, 0.10)',
    borderLeftWidth: 3,
    borderLeftColor: colors.gold,
  },
  namaRowPressed: {
    backgroundColor: 'rgba(212, 175, 55, 0.05)',
  },
  namaNumColumn: {
    width: 28,
    paddingTop: 2,
    alignItems: 'center',
    marginRight: 10,
  },
  namaNumText: {
    color: colors.goldSoft,
    fontSize: 12,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    opacity: 0.8,
  },
  namaNumTextBookmarked: {
    color: colors.gold,
    opacity: 1,
  },
  bookmarkDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.gold,
    marginTop: 4,
  },
  namaTextColumn: {
    flex: 1,
  },
  namaPrimaryText: {
    color: colors.textPrimary,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  namaPrimaryTextBookmarked: {
    color: colors.ivoryWarm,
    fontWeight: '700',
  },
  namaSecondaryText: {
    color: colors.goldSoft,
    marginTop: 2,
    fontStyle: 'italic',
    opacity: 0.85,
  },

  /* Floating Bottom "Start Archana" Pill */
  floatingBarContainer: {
    position: 'absolute',
    bottom: 12,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  floatingStartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.gold,
    borderRadius: 24,
    paddingVertical: 11,
    paddingHorizontal: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 6,
  },
  floatingStartButtonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  floatingStartButtonText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
