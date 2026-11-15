import React, { useCallback, useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TabIcon } from '../components/TabIcon';
import { getDeityImage } from '../data/deityImages';
import { getPanchanga } from '../engine/panchangamEngine';
import { getPracticeStats } from '../db/database';
import { useLanguage } from '../i18n/LanguageContext';
import { useAppMenu } from '../navigation/MenuContext';
import { RootTabParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { radii, spacing } from '../theme/tokens';
import type { PracticeStats } from '../types/practice';

type Props = BottomTabScreenProps<RootTabParamList, 'Home'>;

const PREVIEW_DEITY_IDS = [
  'builtin-ashtothram-ganesha',
  'builtin-ashtothram-shiva',
  'builtin-ashtothram-venkateswara',
  'builtin-ashtothram-lakshmi',
];

export function HomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { language, t } = useLanguage();
  const { openAshtothram, openPanchangam } = useAppMenu();
  const isTelugu = language === 'te';

  const todayPanchanga = getPanchanga();

  const [stats, setStats] = useState<PracticeStats>({
    todaySessions: 0,
    todayCount: 0,
    monthSessions: 0,
    monthCount: 0,
    totalJapaCount: 0,
    totalPradakshinaCount: 0,
  });

  useFocusEffect(
    useCallback(() => {
      try {
        setStats(getPracticeStats());
      } catch {
        // Safe fallback
      }
    }, [])
  );

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Math.max(insets.top, 16) + 4,
          paddingBottom: Math.max(insets.bottom, 16) + 8,
        },
      ]}
    >
      {/* a. Panchangam Card (Prominent Top Feature) */}
      <Pressable
        style={({ pressed }) => [
          styles.panchangaCard,
          pressed && styles.cardPressed,
        ]}
        onPress={openPanchangam}
        accessibilityRole="button"
        accessibilityLabel={t.panchangam.title}
      >
        <View style={styles.panchangaTopRow}>
          <View style={styles.panchangaBadgeRow}>
            <TabIcon name="Panchangam" color={colors.gold} size={15} />
            <Text style={styles.panchangaEyebrow} numberOfLines={1}>
              {isTelugu
                ? `శ్రీ ${todayPanchanga.samvatsara.telugu} · ${todayPanchanga.masa.telugu}`
                : `Sri ${todayPanchanga.samvatsara.english} · ${todayPanchanga.masa.english}`}
            </Text>
          </View>
          <View style={styles.panchangaTodayPill}>
            <Text style={styles.panchangaTodayPillText}>
              {t.panchangam.today}
            </Text>
          </View>
        </View>

        <Text style={styles.panchangaMainText} numberOfLines={1}>
          {isTelugu
            ? `${todayPanchanga.tithi.fullTelugu} · ${todayPanchanga.dayOfWeek.telugu}`
            : `${todayPanchanga.tithi.fullEnglish} · ${todayPanchanga.dayOfWeek.english}`}
        </Text>

        <View style={styles.panchangaBottomRow}>
          <Text style={styles.panchangaSubText} numberOfLines={1}>
            {isTelugu
              ? `${todayPanchanga.nakshatra.telugu} (${todayPanchanga.nakshatra.pada}వ పాదం) · రాహు: ${todayPanchanga.timings.rahuKalam}`
              : `${todayPanchanga.nakshatra.english} (Pada ${todayPanchanga.nakshatra.pada}) · Rahu: ${todayPanchanga.timings.rahuKalam}`}
          </Text>
          <View style={styles.panchangaActionPill}>
            <Text style={styles.panchangaActionText}>
              {isTelugu ? 'పంచాంగం & సంకల్పం →' : 'Panchangam & Sankalpam →'}
            </Text>
          </View>
        </View>
      </Pressable>

      {/* b. Ashtottara Shatanamavali Card */}
      <Pressable
        style={({ pressed }) => [
          styles.ashtothramCard,
          pressed && styles.cardPressed,
        ]}
        onPress={openAshtothram}
        accessibilityRole="button"
        accessibilityLabel={t.ashtothram.cardHomeTitle}
      >
        <View style={styles.ashtothramTopRow}>
          <View style={styles.badgeRow}>
            <TabIcon name="Ashtothram" color={colors.gold} size={15} />
            <Text style={styles.ashtothramBadge}>
              {t.ashtothram.cardHomeBadge}
            </Text>
          </View>
          <Text style={styles.countTag}>108</Text>
        </View>

        <Text style={styles.ashtothramTitle}>
          {t.ashtothram.cardHomeTitle}
        </Text>
        <Text style={styles.ashtothramSubtitle} numberOfLines={1}>
          {t.ashtothram.subtitle}
        </Text>

        {/* Deity Avatar Previews */}
        <View style={styles.avatarRow}>
          <View style={styles.avatarStack}>
            {PREVIEW_DEITY_IDS.map((id, index) => {
              const src = getDeityImage(id);
              if (!src) return null;
              return (
                <Image
                  key={id}
                  source={src}
                  style={[
                    styles.previewAvatar,
                    { transform: [{ translateX: -index * 10 }] },
                  ]}
                  resizeMode="cover"
                />
              );
            })}
          </View>

          <View style={styles.ashtothramActionPill}>
            <Text style={styles.ashtothramActionText}>
              {t.home.startPractice} →
            </Text>
          </View>
        </View>
      </Pressable>

      {/* c. 2-Column Launchers: Japa & Pradakshina */}
      <View style={styles.launcherGrid}>
        {/* Japa Card */}
        <Pressable
          style={({ pressed }) => [
            styles.launcherCard,
            pressed && styles.cardPressed,
          ]}
          onPress={() => navigation.navigate('Japa')}
          accessibilityRole="button"
          accessibilityLabel={t.home.japaTitle}
        >
          <View style={styles.launcherIconWrap}>
            <TabIcon name="Japa" color={colors.goldSoft} size={24} />
          </View>
          <Text style={styles.launcherTitle}>{t.home.japaTitle}</Text>
          <Text style={styles.launcherSubtitle} numberOfLines={1}>
            {t.home.japaSubtitle}
          </Text>
          <View style={styles.launcherAction}>
            <Text style={styles.launcherActionText}>
              {t.home.startPractice} →
            </Text>
          </View>
        </Pressable>

        {/* Pradakshina Card */}
        <Pressable
          style={({ pressed }) => [
            styles.launcherCard,
            pressed && styles.cardPressed,
          ]}
          onPress={() => navigation.navigate('Pradakshina')}
          accessibilityRole="button"
          accessibilityLabel={t.home.pradakshinaTitle}
        >
          <View style={styles.launcherIconWrap}>
            <TabIcon name="Pradakshina" color={colors.goldSoft} size={24} />
          </View>
          <Text style={styles.launcherTitle}>{t.home.pradakshinaTitle}</Text>
          <Text style={styles.launcherSubtitle} numberOfLines={1}>
            {t.home.pradakshinaSubtitle}
          </Text>
          <View style={styles.launcherAction}>
            <Text style={styles.launcherActionText}>
              {t.home.startPractice} →
            </Text>
          </View>
        </Pressable>
      </View>

      {/* d. Today's Sadhana Snapshot */}
      <Pressable
        style={({ pressed }) => [
          styles.todayCard,
          pressed && styles.cardPressed,
        ]}
        onPress={() => navigation.navigate('History')}
        accessibilityRole="button"
        accessibilityLabel={t.home.todaySadhana}
      >
        <View style={styles.todayIconWrap}>
          <TabIcon name="History" color={colors.goldSoft} size={18} />
        </View>

        <View style={styles.todayInfo}>
          <Text style={styles.todayTitle}>{t.home.todaySadhana}</Text>
          <Text style={styles.todaySubtitle} numberOfLines={1}>
            {stats.todaySessions > 0
              ? `${stats.todayCount} total repetitions · ${stats.todaySessions} ${
                  stats.todaySessions === 1
                    ? t.common.session
                    : t.common.sessions
                }`
              : t.home.noSadhanaToday}
          </Text>
        </View>

        <Text style={styles.todayChevron}>›</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    justifyContent: 'space-between',
  },

  /* a. Panchangam Card */
  panchangaCard: {
    backgroundColor: '#0F261E',
    borderColor: 'rgba(212, 175, 55, 0.45)',
    borderWidth: 1,
    borderRadius: 16,
    padding: 13,
  },
  panchangaTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  panchangaBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  panchangaEyebrow: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  panchangaTodayPill: {
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.goldSoft,
  },
  panchangaTodayPillText: {
    color: colors.gold,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  panchangaMainText: {
    color: colors.ivoryWarm,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  panchangaBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  panchangaSubText: {
    color: colors.textSecondary,
    fontSize: 11,
    flex: 1,
  },
  panchangaActionPill: {
    backgroundColor: colors.surface,
    borderColor: colors.gold,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  panchangaActionText: {
    color: colors.goldSoft,
    fontSize: 10,
    fontWeight: '700',
  },

  /* b. Featured Ashtothram Card */
  ashtothramCard: {
    backgroundColor: '#0F261E',
    borderColor: colors.gold,
    borderWidth: 1,
    borderRadius: 16,
    padding: 13,
  },
  ashtothramTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ashtothramBadge: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  countTag: {
    color: colors.goldSoft,
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
    fontSize: 10,
    fontWeight: '700',
  },
  ashtothramTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 2,
  },
  ashtothramSubtitle: {
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 15,
    marginBottom: 8,
  },
  avatarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 30, // Offset for negative translateX
  },
  previewAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: colors.gold,
    backgroundColor: colors.surfaceAlt,
  },
  ashtothramActionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.gold,
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  ashtothramActionText: {
    color: colors.goldSoft,
    fontSize: 11,
    fontWeight: '700',
  },

  /* c. 2-Column Launchers */
  launcherGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  launcherCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 11,
    justifyContent: 'space-between',
  },
  launcherIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  launcherTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 1,
  },
  launcherSubtitle: {
    color: colors.textSecondary,
    fontSize: 10,
    lineHeight: 14,
    marginBottom: 8,
  },
  launcherAction: {
    alignSelf: 'flex-start',
  },
  launcherActionText: {
    color: colors.goldSoft,
    fontSize: 11,
    fontWeight: '700',
  },

  /* d. Today's Sadhana Snapshot */
  todayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radii.md,
    paddingVertical: 9,
    paddingHorizontal: 12,
    gap: 10,
  },
  todayIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceAlt,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayInfo: {
    flex: 1,
  },
  todayTitle: {
    color: colors.goldSoft,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  todaySubtitle: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '500',
    marginTop: 1,
  },
  todayChevron: {
    color: colors.textMuted,
    fontSize: 18,
    fontWeight: '300',
  },

  cardPressed: {
    borderColor: colors.goldSoft,
    transform: [{ scale: 0.985 }],
  },
});
