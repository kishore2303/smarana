import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { SmaranaLogo } from '../components/SmaranaLogo';
import { TabIcon } from '../components/TabIcon';
import { useLanguage } from '../i18n/LanguageContext';
import { useAppMenu } from '../navigation/MenuContext';
import { RootTabParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { radii, spacing } from '../theme/tokens';

type Props = BottomTabScreenProps<RootTabParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const { t } = useLanguage();
  const { openAshtothram } = useAppMenu();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.brandHeader}>
        <SmaranaLogo variant="primary" size={84} showSanskrit />
        <Text style={styles.tagline}>{t.home.eyebrow}</Text>
        <Text style={styles.subtitle}>{t.home.subtitle}</Text>
      </View>

      <View style={styles.cards}>
        <Pressable
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
          onPress={() => navigation.navigate('Japa')}
          accessibilityRole="button"
          accessibilityLabel={t.home.japaTitle}
        >
          <View style={styles.cardTopRow}>
            <Text style={styles.cardBadge}>{t.home.japaBadge}</Text>
            <TabIcon name="Japa" color={colors.goldSoft} size={24} />
          </View>
          <Text style={styles.cardTitle}>{t.home.japaTitle}</Text>
          <Text style={styles.cardDescription}>{t.home.japaDesc}</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.card,
            styles.ashtothramCard,
            pressed && styles.cardPressed,
          ]}
          onPress={openAshtothram}
          accessibilityRole="button"
          accessibilityLabel={t.ashtothram.cardHomeTitle}
        >
          <View style={styles.cardTopRow}>
            <Text style={styles.ashtothramBadge}>
              {t.ashtothram.cardHomeBadge}
            </Text>
            <Text style={styles.cardGlyph}>🌸</Text>
          </View>
          <Text style={styles.cardTitle}>{t.ashtothram.cardHomeTitle}</Text>
          <Text style={styles.cardDescription}>
            {t.ashtothram.cardHomeDesc}
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
          onPress={() => navigation.navigate('Pradakshina')}
          accessibilityRole="button"
          accessibilityLabel={t.home.pradakshinaTitle}
        >
          <View style={styles.cardTopRow}>
            <Text style={styles.cardBadge}>{t.home.pradakshinaBadge}</Text>
            <TabIcon name="Pradakshina" color={colors.goldSoft} size={24} />
          </View>
          <Text style={styles.cardTitle}>{t.home.pradakshinaTitle}</Text>
          <Text style={styles.cardDescription}>{t.home.pradakshinaDesc}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  tagline: {
    color: colors.goldSoft,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.6,
    marginTop: spacing.md,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: spacing.xs,
    maxWidth: 300,
  },
  cards: {
    gap: 16,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radii.lg,
    padding: spacing.lg,
  },
  cardPressed: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.goldSoft,
  },
  ashtothramCard: {
    borderColor: colors.gold,
    backgroundColor: '#0F261E',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardBadge: {
    color: colors.goldSoft,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  ashtothramBadge: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  cardGlyph: {
    color: colors.gold,
    fontSize: 18,
  },
  cardTitle: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 6,
  },
  cardDescription: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
});
