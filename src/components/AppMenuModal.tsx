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
import { useLanguage } from '../i18n/LanguageContext';
import { colors } from '../theme/colors';

interface AppMenuModalProps {
  visible: boolean;
  onClose: () => void;
  onOpenAshtothram: () => void;
  onOpenMantraLibrary: () => void;
  onNavigateTab: (tabName: 'Home' | 'Japa' | 'Pradakshina' | 'History' | 'Settings') => void;
}

export function AppMenuModal({
  visible,
  onClose,
  onOpenAshtothram,
  onOpenMantraLibrary,
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

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View
          style={[
            styles.menuSheet,
            {
              paddingTop: Math.max(insets.top, 20) + 10,
              paddingBottom: Math.max(insets.bottom, 20) + 10,
            },
          ]}
        >
          {/* Menu Header with Lotus & Brand */}
          <View style={styles.menuHeader}>
            <View style={styles.brandRow}>
              <SmaranaLogo variant="primary" size={38} showSanskrit />
              <View style={styles.brandTextBlock}>
                <Text style={styles.brandTitle}>SMARANA</Text>
                <Text style={styles.brandTagline}>{t.home.eyebrow}</Text>
              </View>
            </View>

            <Pressable
              style={styles.closeButton}
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel={t.common.cancel}
              hitSlop={8}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </Pressable>
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* FEATURED: Ashtothram Card */}
            <Pressable
              style={({ pressed }) => [
                styles.featuredCard,
                pressed && styles.cardPressed,
              ]}
              onPress={handleSelectAshtothram}
            >
              <View style={styles.itemTopRow}>
                <Text style={styles.itemBadge}>108 DIVINE NAMES</Text>
                <Text style={styles.itemIcon}>🌸</Text>
              </View>
              <Text style={styles.featuredTitle}>{t.menu.ashtothramTitle}</Text>
              <Text style={styles.featuredDesc}>{t.menu.ashtothramDesc}</Text>
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
              >
                <Text style={styles.navItemIcon}>📿</Text>
                <View style={styles.navItemText}>
                  <Text style={styles.navItemTitle}>{t.menu.japaTitle}</Text>
                  <Text style={styles.navItemDesc}>{t.menu.japaDesc}</Text>
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
              >
                <Text style={styles.navItemIcon}>🛕</Text>
                <View style={styles.navItemText}>
                  <Text style={styles.navItemTitle}>
                    {t.menu.pradakshinaTitle}
                  </Text>
                  <Text style={styles.navItemDesc}>
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
              >
                <Text style={styles.navItemIcon}>📖</Text>
                <View style={styles.navItemText}>
                  <Text style={styles.navItemTitle}>
                    {t.menu.mantraLibraryTitle}
                  </Text>
                  <Text style={styles.navItemDesc}>
                    {t.menu.mantraLibraryDesc}
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
              >
                <Text style={styles.navItemIcon}>📊</Text>
                <View style={styles.navItemText}>
                  <Text style={styles.navItemTitle}>{t.menu.historyTitle}</Text>
                  <Text style={styles.navItemDesc}>{t.menu.historyDesc}</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </Pressable>

              {/* Settings */}
              <Pressable
                style={({ pressed }) => [
                  styles.navItem,
                  pressed && styles.cardPressed,
                ]}
                onPress={() => handleSelectTab('Settings')}
              >
                <Text style={styles.navItemIcon}>⚙️</Text>
                <View style={styles.navItemText}>
                  <Text style={styles.navItemTitle}>
                    {t.menu.settingsTitle}
                  </Text>
                  <Text style={styles.navItemDesc}>
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
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
  },
  menuSheet: {
    width: '84%',
    maxWidth: 360,
    backgroundColor: colors.background,
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandTextBlock: {
    justifyContent: 'center',
  },
  brandTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  brandTagline: {
    color: colors.goldSoft,
    fontSize: 11,
    fontWeight: '600',
  },
  closeButton: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 18,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingBottom: 20,
    gap: 14,
  },
  featuredCard: {
    backgroundColor: colors.surface,
    borderColor: colors.gold,
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 14,
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
  itemIcon: {
    fontSize: 18,
  },
  featuredTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
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
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 12,
  },
  navItemIcon: {
    fontSize: 20,
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
    padding: 12,
    marginTop: 6,
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
    marginBottom: 6,
  },
  aboutMeta: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
});
