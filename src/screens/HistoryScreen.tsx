import React, { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  clearSessionHistory,
  getPracticeStats,
  getSessionHistory,
} from '../db/database';
import { useLanguage } from '../i18n/LanguageContext';
import { colors } from '../theme/colors';
import type { CompletedSessionRecord, PracticeStats } from '../types/practice';

function formatTimestamp(isoString: string): string {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return isoString;
  }
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function HistoryScreen() {
  const { t } = useLanguage();
  const [history, setHistory] = useState<CompletedSessionRecord[]>([]);
  const [stats, setStats] = useState<PracticeStats>({
    todaySessions: 0,
    todayCount: 0,
    monthSessions: 0,
    monthCount: 0,
    totalJapaCount: 0,
    totalPradakshinaCount: 0,
  });

  const refreshHistory = useCallback(() => {
    setHistory(getSessionHistory());
    setStats(getPracticeStats());
  }, []);

  useFocusEffect(refreshHistory);

  const handleConfirmClear = () => {
    Alert.alert(t.history.confirmClearTitle, t.history.confirmClearBody, [
      { text: t.common.cancel, style: 'cancel' },
      {
        text: t.history.clearConfirm,
        style: 'destructive',
        onPress: () => {
          clearSessionHistory();
          refreshHistory();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>{t.history.today}</Text>
          <Text style={styles.statValue}>{stats.todayCount}</Text>
          <Text style={styles.statSub}>
            {stats.todaySessions}{' '}
            {stats.todaySessions === 1 ? t.common.session : t.common.sessions}
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>{t.history.thisMonth}</Text>
          <Text style={styles.statValue}>{stats.monthCount}</Text>
          <Text style={styles.statSub}>
            {stats.monthSessions}{' '}
            {stats.monthSessions === 1 ? t.common.session : t.common.sessions}
          </Text>
        </View>
      </View>

      {stats.totalJapaCount > 0 || stats.totalPradakshinaCount > 0 ? (
        <View style={styles.lifetimeStatsRow}>
          <View style={styles.lifetimeStatCard}>
            <Text style={styles.lifetimeLabel}>{t.history.lifetimeJapa}</Text>
            <Text style={styles.lifetimeValue}>{stats.totalJapaCount}</Text>
          </View>
          <View style={styles.lifetimeStatCard}>
            <Text style={styles.lifetimeLabel}>
              {t.history.lifetimePradakshina}
            </Text>
            <Text style={styles.lifetimeValue}>
              {stats.totalPradakshinaCount}
            </Text>
          </View>
        </View>
      ) : null}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t.history.completedTitle}</Text>
        {history.length > 0 ? (
          <Pressable
            style={({ pressed }) => [
              styles.clearButton,
              pressed && styles.clearButtonPressed,
            ]}
            onPress={handleConfirmClear}
            accessibilityRole="button"
          >
            <Text style={styles.clearButtonText}>{t.history.clearButton}</Text>
          </Pressable>
        ) : null}
      </View>

      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          history.length === 0 ? styles.emptyContainer : styles.listContent
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>{t.history.empty}</Text>
        }
        renderItem={({ item }) => {
          const fallback =
            item.mode === 'pradakshina'
              ? t.pradakshina.fallbackLabel
              : t.japa.fallbackLabel;
          const badge =
            item.mode === 'pradakshina'
              ? t.tabs.pradakshina.toUpperCase()
              : t.tabs.japa.toUpperCase();
          return (
            <View style={styles.historyCard}>
              <View style={styles.historyHeader}>
                <Text style={styles.modeBadge}>{badge}</Text>
                <Text style={styles.dateText}>
                  {formatTimestamp(item.completedAt)}
                </Text>
              </View>

              <View style={styles.historyBody}>
                <Text style={styles.itemTitle} numberOfLines={1}>
                  {item.label || fallback}
                </Text>
                <Text style={styles.itemCount}>{item.targetCount}</Text>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  lifetimeStatsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  lifetimeStatCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  lifetimeLabel: {
    color: colors.goldSoft,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.1,
    marginBottom: 2,
  },
  lifetimeValue: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  statLabel: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  statValue: {
    color: colors.goldSoft,
    fontSize: 28,
    fontWeight: '700',
  },
  statSub: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
  },
  clearButton: {
    backgroundColor: colors.surface,
    borderColor: colors.danger,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearButtonPressed: {
    opacity: 0.75,
  },
  clearButtonText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '700',
  },
  listContent: {
    gap: 10,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  historyCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  modeBadge: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.1,
  },
  dateText: {
    color: colors.textMuted,
    fontSize: 12,
  },
  historyBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTitle: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    marginRight: 12,
  },
  itemCount: {
    color: colors.goldSoft,
    fontSize: 18,
    fontWeight: '700',
  },
});
