import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useLanguage } from '../i18n/LanguageContext';
import { colors } from '../theme/colors';

interface TopLanguageToggleProps {
  compact?: boolean;
}

export function TopLanguageToggle({ compact = false }: TopLanguageToggleProps) {
  const { language, setLanguage } = useLanguage();
  const isTelugu = language === 'te';

  const handleToggle = () => {
    Haptics.selectionAsync().catch(() => {});
    setLanguage(isTelugu ? 'en' : 'te');
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.pillContainer,
        compact && styles.pillCompact,
        pressed && styles.pillPressed,
      ]}
      onPress={handleToggle}
      accessibilityRole="button"
      accessibilityLabel={isTelugu ? 'Switch app language to English' : 'యాప్ భాషను తెలుగులోకి మార్చు'}
      hitSlop={8}
    >
      <Text
        style={[
          styles.langText,
          isTelugu && styles.langTextActive,
        ]}
      >
        తెలుగు
      </Text>
      <Text style={styles.divider}>|</Text>
      <Text
        style={[
          styles.langText,
          !isTelugu && styles.langTextActive,
        ]}
      >
        EN
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pillContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 34,
    backgroundColor: '#10221A',
    borderColor: 'rgba(212, 175, 55, 0.45)',
    borderWidth: 1,
    borderRadius: 17,
    paddingHorizontal: 10,
    gap: 5,
  },
  pillCompact: {
    height: 28,
    paddingHorizontal: 8,
    borderRadius: 14,
    gap: 4,
  },
  pillPressed: {
    borderColor: colors.gold,
    backgroundColor: '#193327',
  },
  langText: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  langTextActive: {
    color: colors.gold,
    fontWeight: '800',
  },
  divider: {
    color: 'rgba(212, 175, 55, 0.3)',
    fontSize: 10,
    fontWeight: '400',
  },
});
