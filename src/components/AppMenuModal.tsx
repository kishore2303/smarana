import React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SmaranaLogo } from './SmaranaLogo';
import { TabIcon } from './TabIcon';
import { useLanguage } from '../i18n/LanguageContext';
import { colors } from '../theme/colors';

interface AppMenuModalProps {
  visible: boolean;
  onClose: () => void;
  onOpenAshtothram: () => void;
  onOpenMantraLibrary: () => void;
  onOpenPanchangam: () => void;
  onNavigateTab: (tabName: 'Home' | 'Japa' | 'Pradakshina' | 'History' | 'Settings') => void;
}

export function AppMenuModal({
  visible,
  onClose,
  onOpenAshtothram,
  onOpenMantraLibrary,
  onOpenPanchangam,
  onNavigateTab,
}: AppMenuModalProps) {
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();

  const handleSelectTab = (
    tab: 'Home' | 'Japa' | 'Pradakshina' | 'History' | 'Settings'
  ) => {
    onClose();
    onNavigateTab(tab);
  };

  const handleSelectAshtothram = () => {
    onClose();
    onOpenAshtothram();
  };

  const handleSelectMantraLibrary = () => {
    onClose();
    onOpenMantraLibrary();
  };

  const handleSelectPanchangam = () => {
    onClose();
    onOpenPanchangam();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel={t.common.cancel}
        />

        <View
          style={[
            styles.menuSheet,
            {
              paddingTop: Math.max(insets.top, 20) + 12,
            },
          ]}
        >
          {/* Menu Header with Single Clean Lotus & Brand Block */}
          <View style={styles.menuHeader}>
            <View style={styles.brandRow}>
              <SmaranaLogo variant="symbol" size={42} />
              <View style={styles.brandTextBlock}>
                <View style={styles.brandTitleRow}>
                  <Text style={styles.brandTitle}>SMARANA</Text>
                  <Text style={styles.brandSanskrit}>स्मरण</Text>
                </View>
                <Text style={styles.brandTagline} numberOfLines={1}>
                  {t.home.eyebrow}
                </Text>
              </View>
            </View>

            <Pressable
              style={styles.closeButton}
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel={t.common.cancel}
              hitSlop={10}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </Pressable>
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: Math.max(insets.bottom, 24) + 40 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {/* FEATURED: Ashtothram Card */}
            <Pressable
              style={({ pressed }) => [
                styles.featuredCard,
                pressed && styles.cardPressed,
              ]}
              onPress={handleSelectAshtothram}
              accessibilityRole="button"
            >
              <View style={styles.itemTopRow}>
                <Text style={styles.itemBadge}>108 DIVINE NAMES</Text>
                <TabIcon name="Ashtothram" color={colors.goldSoft} size={20} />
              </View>
              <Text style={styles.featuredTitle}>{t.menu.ashtothramTitle}</Text>
              <Text
                style={styles.featuredDesc}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {t.menu.ashtothramDesc}
              </Text>
            </Pressable>

            {/* Standard Nav Items */}
            <View style={styles.navGroup}>
              {/* Japa */}
              <Pressable
                style={({ pressed }) => [
                  styles.navItem,
                  pressed && styles.cardPressed,
                ]}
                onPress={() => handleSelectTab('Japa')}
                accessibilityRole="button"
              >
                <TabIcon name="Japa" color={colors.goldSoft} size={20} />
                <View style={styles.navItemText}>
                  <Text style={styles.navItemTitle}>{t.menu.japaTitle}</Text>
                  <Text
                    style={styles.navItemDesc}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {t.menu.japaDesc}
                  </Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </Pressable>

              {/* Pradakshina */}
              <Pressable
                style={({ pressed }) => [
                  styles.navItem,
                  pressed && styles.cardPressed,
                ]}
                onPress={() => handleSelectTab('Pradakshina')}
                accessibilityRole="button"
              >
                <TabIcon name="Pradakshina" color={colors.goldSoft} size={20} />
                <View style={styles.navItemText}>
                  <Text style={styles.navItemTitle}>
                    {t.menu.pradakshinaTitle}
                  </Text>
                  <Text
                    style={styles.navItemDesc}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {t.menu.pradakshinaDesc}
                  </Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </Pressable>

              {/* Mantra Library */}
              <Pressable
                style={({ pressed }) => [
                  styles.navItem,
                  pressed && styles.cardPressed,
                ]}
                onPress={handleSelectMantraLibrary}
                accessibilityRole="button"
              >
                <TabIcon name="MantraLibrary" color={colors.goldSoft} size={20} />
                <View style={styles.navItemText}>
                  <Text style={styles.navItemTitle}>
                    {t.menu.mantraLibraryTitle}
                  </Text>
                  <Text
                    style={styles.navItemDesc}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {t.menu.mantraLibraryDesc}
                  </Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </Pressable>

              {/* Telugu Panchangam */}
              <Pressable
                style={({ pressed }) => [
                  styles.navItem,
                  pressed && styles.cardPressed,
                ]}
                onPress={handleSelectPanchangam}
                accessibilityRole="button"
              >
                <TabIcon name="Panchangam" color={colors.goldSoft} size={20} />
                <View style={styles.navItemText}>
                  <Text style={styles.navItemTitle}>
                    {t.menu.panchangamTitle}
                  </Text>
                  <Text
                    style={styles.navItemDesc}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {t.menu.panchangamDesc}
                  </Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </Pressable>

              {/* History */}
              <Pressable
                style={({ pressed }) => [
                  styles.navItem,
                  pressed && styles.cardPressed,
                ]}
                onPress={() => handleSelectTab('History')}
                accessibilityRole="button"
              >
                <TabIcon name="History" color={colors.goldSoft} size={20} />
                <View style={styles.navItemText}>
                  <Text style={styles.navItemTitle}>{t.menu.historyTitle}</Text>
                  <Text
                    style={styles.navItemDesc}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {t.menu.historyDesc}
                  </Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </Pressable>

              {/* Settings */}
              <Pressable
                style={({ pressed }) => [
                  styles.navItem,
                  styles.navItemLast,
                  pressed && styles.cardPressed,
                ]}
                onPress={() => handleSelectTab('Settings')}
                accessibilityRole="button"
              >
                <TabIcon name="Settings" color={colors.goldSoft} size={20} />
                <View style={styles.navItemText}>
                  <Text style={styles.navItemTitle}>
                    {t.menu.settingsTitle}
                  </Text>
                  <Text
                    style={styles.navItemDesc}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {t.menu.settingsDesc}
                  </Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </Pressable>
            </View>

            {/* About Box */}
            <View style={styles.aboutBox}>
              <Text style={styles.aboutTitle}>{t.menu.aboutTitle}</Text>
              <Text style={styles.aboutDesc}>{t.menu.aboutDesc}</Text>
              <Text style={styles.aboutMeta}>
                Offline-First · Privacy-First · v1.0
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.88)',
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
  },
  menuSheet: {
    width: '85%',
    maxWidth: 360,
    backgroundColor: colors.background,
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
    paddingHorizontal: 20,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  brandRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginRight: 10,
  },
  brandTextBlock: {
    flex: 1,
    justifyContent: 'center',
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  brandTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  brandSanskrit: {
    color: colors.goldSoft,
    fontSize: 13,
    fontWeight: '600',
  },
  brandTagline: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  closeButton: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 18,
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  closeButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  scroll: {
    flex: 1,
    marginTop: 14,
  },
  scrollContent: {
    paddingTop: 4,
  },
  featuredCard: {
    backgroundColor: colors.surface,
    borderColor: colors.gold,
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 14,
    marginBottom: 18, // Breathing room between Ashtothram card and menu list
  },
  cardPressed: {
    backgroundColor: colors.surfaceAlt,
    opacity: 0.9,
  },
  itemTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  itemBadge: {
    color: colors.goldSoft,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  featuredTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 3,
  },
  featuredDesc: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  navGroup: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 12,
  },
  navItemLast: {
    borderBottomWidth: 0,
  },
  navItemText: {
    flex: 1,
  },
  navItemTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  navItemDesc: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 16,
  },
  chevron: {
    color: colors.textMuted,
    fontSize: 18,
    fontWeight: '700',
  },
  aboutBox: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
  },
  aboutTitle: {
    color: colors.goldSoft,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  aboutDesc: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 8,
  },
  aboutMeta: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
});
