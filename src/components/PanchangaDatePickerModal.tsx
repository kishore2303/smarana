import React, { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  getPanchanga,
  getUgadiDate,
  getUgadiYearRange,
  UgadiYearRange,
} from '../engine/panchangamEngine';
import { useLanguage } from '../i18n/LanguageContext';
import { colors } from '../theme/colors';

interface PanchangaDatePickerModalProps {
  visible: boolean;
  activeDate: Date;
  onSelectDate: (date: Date) => void;
  onClose: () => void;
}

const TELUGU_WEEKDAYS_SHORT = ['ఆది', 'సోమ', 'మంగళ', 'బుధ', 'గురు', 'శుక్ర', 'శని'];
const ENGLISH_WEEKDAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const GREGORIAN_MONTH_NAMES_TE = [
  'జనవరి',
  'ఫిబ్రవరి',
  'మార్చి',
  'ఏప్రిల్',
  'మే',
  'జూన్',
  'జూలై',
  'ఆగస్టు',
  'సెప్టెంబర్',
  'అక్టోబర్',
  'నవంబర్',
  'డిసెంబర్',
];

const GREGORIAN_MONTH_NAMES_EN = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function PanchangaDatePickerModal({
  visible,
  activeDate,
  onSelectDate,
  onClose,
}: PanchangaDatePickerModalProps) {
  const insets = useSafeAreaInsets();
  const { language, t } = useLanguage();
  const isTelugu = language === 'te';

  // The candidate date selected by the user in this picker session
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date(activeDate));

  // The view's currently displayed year & month
  const [viewYear, setViewYear] = useState<number>(() => activeDate.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(() => activeDate.getMonth());

  // Ugadi boundaries for the displayed year cycle
  const ugadiRange: UgadiYearRange = useMemo(() => {
    return getUgadiYearRange(selectedDate);
  }, [selectedDate]);

  // Today reference for quick indicator
  const today = useMemo(() => new Date(), []);

  // Format month and year label for header
  const monthName = isTelugu
    ? GREGORIAN_MONTH_NAMES_TE[viewMonth]
    : GREGORIAN_MONTH_NAMES_EN[viewMonth];

  // Panchangam for the currently selected candidate date
  const previewPanchangam = useMemo(() => {
    return getPanchanga(selectedDate);
  }, [selectedDate]);

  // Days in currently viewed month
  const daysInMonth = useMemo(() => {
    return new Date(viewYear, viewMonth + 1, 0).getDate();
  }, [viewYear, viewMonth]);

  // First day of the week for the currently viewed month (0=Sun, 1=Mon, ..., 6=Sat)
  const firstDayOfWeek = useMemo(() => {
    return new Date(viewYear, viewMonth, 1).getDay();
  }, [viewYear, viewMonth]);

  // Check if a given date falls strictly within the active Ugadi year
  const isDateWithinUgadiYear = (d: Date): boolean => {
    const t = d.getTime();
    const start = new Date(
      ugadiRange.startUgadi.getFullYear(),
      ugadiRange.startUgadi.getMonth(),
      ugadiRange.startUgadi.getDate(),
      0,
      0,
      0
    ).getTime();
    const end = new Date(
      ugadiRange.endUgadi.getFullYear(),
      ugadiRange.endUgadi.getMonth(),
      ugadiRange.endUgadi.getDate(),
      23,
      59,
      59
    ).getTime();
    return t >= start && t <= end;
  };

  // Switch months
  const handlePrevMonth = () => {
    Haptics.selectionAsync().catch(() => {});
    if (viewMonth === 0) {
      setViewYear((prev) => prev - 1);
      setViewMonth(11);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    Haptics.selectionAsync().catch(() => {});
    if (viewMonth === 11) {
      setViewYear((prev) => prev + 1);
      setViewMonth(0);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  // Jump handlers
  const handleJumpToUgadi = () => {
    Haptics.selectionAsync().catch(() => {});
    const ugadi = new Date(ugadiRange.startUgadi);
    setSelectedDate(ugadi);
    setViewYear(ugadi.getFullYear());
    setViewMonth(ugadi.getMonth());
  };

  const handleJumpToToday = () => {
    Haptics.selectionAsync().catch(() => {});
    const now = new Date();
    setSelectedDate(now);
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
  };

  const handleJumpToEndYear = () => {
    Haptics.selectionAsync().catch(() => {});
    const end = new Date(ugadiRange.endUgadi);
    setSelectedDate(end);
    setViewYear(end.getFullYear());
    setViewMonth(end.getMonth());
  };

  // Switch Telugu Samvatsaram (Year)
  const handlePrevYear = () => {
    Haptics.selectionAsync().catch(() => {});
    const prevYearUgadi = getUgadiDate(ugadiRange.lunarYear - 1);
    setSelectedDate(prevYearUgadi);
    setViewYear(prevYearUgadi.getFullYear());
    setViewMonth(prevYearUgadi.getMonth());
  };

  const handleNextYear = () => {
    Haptics.selectionAsync().catch(() => {});
    const nextYearUgadi = getUgadiDate(ugadiRange.lunarYear + 1);
    setSelectedDate(nextYearUgadi);
    setViewYear(nextYearUgadi.getFullYear());
    setViewMonth(nextYearUgadi.getMonth());
  };

  // Day tap handler
  const handleDayPress = (dayNumber: number) => {
    const candidate = new Date(viewYear, viewMonth, dayNumber, 6, 0, 0);
    if (!isDateWithinUgadiYear(candidate)) return;
    Haptics.selectionAsync().catch(() => {});
    setSelectedDate(candidate);
  };

  // Confirm selection
  const handleConfirm = () => {
    Haptics.selectionAsync().catch(() => {});
    onSelectDate(selectedDate);
    onClose();
  };

  // Format Ugadi range dates for subtitle
  const formatUgadiDateShort = (d: Date) => {
    return d.toLocaleDateString(isTelugu ? 'te-IN' : 'en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const weekdays = isTelugu ? TELUGU_WEEKDAYS_SHORT : ENGLISH_WEEKDAYS_SHORT;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.container,
          {
            paddingTop: Math.max(insets.top, 16),
            paddingBottom: Math.max(insets.bottom, 16),
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerEyebrow}>
              {isTelugu ? 'ఆంధ్ర దృక్సిద్ధాంత కాలగణన' : 'TELUGU CHANDRAMANA CALENDAR'}
            </Text>
            <Text style={styles.headerTitle}>{t.panchangam.datePickerTitle}</Text>
          </View>
          <Pressable
            style={styles.closeBtn}
            onPress={onClose}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={t.panchangam.close}
          >
            <Text style={styles.closeBtnText}>✕</Text>
          </Pressable>
        </View>

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Telugu Year (Samvatsara) Bar with Year Stepper */}
          <View style={styles.samvatsaraCard}>
            <View style={styles.samvatsaraRow}>
              <Pressable
                style={styles.samvatsaraArrowBtn}
                onPress={handlePrevYear}
                hitSlop={8}
                accessibilityLabel="Previous Telugu Year"
              >
                <Text style={styles.samvatsaraArrowText}>‹</Text>
              </Pressable>

              <View style={styles.samvatsaraCenterWrap}>
                <Text style={styles.samvatsaraBadge}>
                  {isTelugu ? 'సంవత్సర చక్రం (ఉగాది-ఉగాది)' : 'TELUGU LUNAR YEAR'}
                </Text>
                <Text style={styles.samvatsaraName}>
                  {isTelugu
                    ? `శ్రీ ${ugadiRange.samvatsara.telugu} నామ సంవత్సరం`
                    : `Sri ${ugadiRange.samvatsara.english} Nama Samvatsaram`}
                </Text>
                <Text style={styles.samvatsaraSpan}>
                  {isTelugu ? 'ఉగాది' : 'Ugadi'}:{' '}
                  {formatUgadiDateShort(ugadiRange.startUgadi)} —{' '}
                  {formatUgadiDateShort(ugadiRange.endUgadi)}
                </Text>
              </View>

              <Pressable
                style={styles.samvatsaraArrowBtn}
                onPress={handleNextYear}
                hitSlop={8}
                accessibilityLabel="Next Telugu Year"
              >
                <Text style={styles.samvatsaraArrowText}>›</Text>
              </Pressable>
            </View>

            {/* Quick Jump Buttons: Ugadi / Today / Year End */}
            <View style={styles.jumpRow}>
              <Pressable
                style={styles.jumpPill}
                onPress={handleJumpToUgadi}
                accessibilityRole="button"
              >
                <Text style={styles.jumpPillIcon}>🌸</Text>
                <Text style={styles.jumpPillText}>{t.panchangam.jumpToUgadi}</Text>
              </Pressable>

              <Pressable
                style={[styles.jumpPill, styles.jumpPillToday]}
                onPress={handleJumpToToday}
                accessibilityRole="button"
              >
                <Text style={styles.jumpPillIcon}>☀️</Text>
                <Text style={[styles.jumpPillText, styles.jumpPillTodayText]}>
                  {t.panchangam.jumpToToday}
                </Text>
              </Pressable>

              <Pressable
                style={styles.jumpPill}
                onPress={handleJumpToEndYear}
                accessibilityRole="button"
              >
                <Text style={styles.jumpPillIcon}>🌑</Text>
                <Text style={styles.jumpPillText}>{t.panchangam.jumpToEndYear}</Text>
              </Pressable>
            </View>
          </View>

          {/* Month Stepper Navigation */}
          <View style={styles.monthNavRow}>
            <Pressable
              style={styles.monthNavBtn}
              onPress={handlePrevMonth}
              hitSlop={10}
              accessibilityLabel="Previous Month"
            >
              <Text style={styles.monthNavArrow}>‹</Text>
            </Pressable>

            <View style={styles.monthTitleWrap}>
              <Text style={styles.monthTitleText}>
                {monthName} {viewYear}
              </Text>
              <Text style={styles.monthSubText}>
                {previewPanchangam.masa.telugu} ({previewPanchangam.masa.english})
              </Text>
            </View>

            <Pressable
              style={styles.monthNavBtn}
              onPress={handleNextMonth}
              hitSlop={10}
              accessibilityLabel="Next Month"
            >
              <Text style={styles.monthNavArrow}>›</Text>
            </Pressable>
          </View>

          {/* Day of Week Header */}
          <View style={styles.weekdayRow}>
            {weekdays.map((dayName, idx) => (
              <View key={idx} style={styles.weekdayCell}>
                <Text
                  style={[
                    styles.weekdayText,
                    idx === 0 && styles.weekdayTextSunday,
                  ]}
                >
                  {dayName}
                </Text>
              </View>
            ))}
          </View>

          {/* Calendar Day Grid */}
          <View style={styles.daysGrid}>
            {/* Blank leading cells */}
            {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
              <View key={`blank-${idx}`} style={styles.dayCellBlank} />
            ))}

            {/* Days of the month */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const cellDate = new Date(viewYear, viewMonth, dayNum, 6, 0, 0);
              const withinUgadi = isDateWithinUgadiYear(cellDate);

              const isSelected =
                selectedDate.getDate() === dayNum &&
                selectedDate.getMonth() === viewMonth &&
                selectedDate.getFullYear() === viewYear;

              const isCurrentToday =
                today.getDate() === dayNum &&
                today.getMonth() === viewMonth &&
                today.getFullYear() === viewYear;

              const isSunday = (firstDayOfWeek + idx) % 7 === 0;

              return (
                <Pressable
                  key={`day-${dayNum}`}
                  style={[
                    styles.dayCell,
                    !withinUgadi && styles.dayCellDisabled,
                    isSelected && styles.dayCellSelected,
                    isCurrentToday && !isSelected && styles.dayCellTodayOutline,
                  ]}
                  onPress={() => withinUgadi && handleDayPress(dayNum)}
                  disabled={!withinUgadi}
                  accessibilityRole="button"
                  accessibilityLabel={`${dayNum} ${monthName}`}
                >
                  <Text
                    style={[
                      styles.dayText,
                      isSunday && styles.dayTextSunday,
                      !withinUgadi && styles.dayTextDisabled,
                      isSelected && styles.dayTextSelected,
                    ]}
                  >
                    {dayNum}
                  </Text>
                  {isCurrentToday && (
                    <View
                      style={[
                        styles.todayDot,
                        isSelected && styles.todayDotSelected,
                      ]}
                    />
                  )}
                </Pressable>
              );
            })}
          </View>

          {/* Selected Date Panchangam Live Preview */}
          <View style={styles.previewCard}>
            <View style={styles.previewHeaderRow}>
              <Text style={styles.previewDateTitle}>
                {selectedDate.toLocaleDateString(isTelugu ? 'te-IN' : 'en-US', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </Text>
              <View style={styles.previewPill}>
                <Text style={styles.previewPillText}>
                  {previewPanchangam.dayOfWeek.telugu}
                </Text>
              </View>
            </View>

            <View style={styles.previewDetailsRow}>
              <View style={styles.previewItem}>
                <Text style={styles.previewLabel}>{t.panchangam.masa}</Text>
                <Text style={styles.previewValue}>
                  {previewPanchangam.masa.telugu}
                </Text>
              </View>
              <View style={styles.previewItem}>
                <Text style={styles.previewLabel}>{t.panchangam.tithi}</Text>
                <Text style={styles.previewValue}>
                  {previewPanchangam.tithi.fullTelugu}
                </Text>
              </View>
              <View style={styles.previewItem}>
                <Text style={styles.previewLabel}>{t.panchangam.nakshatra}</Text>
                <Text style={styles.previewValue}>
                  {previewPanchangam.nakshatra.telugu} ({previewPanchangam.nakshatra.pada}వ పాదం)
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Action Footer */}
        <View style={styles.footer}>
          <Pressable
            style={styles.confirmBtn}
            onPress={handleConfirm}
            accessibilityRole="button"
          >
            <Text style={styles.confirmBtnText}>
              {t.panchangam.selectDate}:{' '}
              {selectedDate.toLocaleDateString(isTelugu ? 'te-IN' : 'en-US', {
                day: 'numeric',
                month: 'short',
              })}
            </Text>
          </Pressable>
        </View>
      </View>
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
  headerEyebrow: {
    color: colors.gold,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  closeBtnText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '700',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  samvatsaraCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 16,
  },
  samvatsaraRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  samvatsaraArrowBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  samvatsaraArrowText: {
    color: colors.gold,
    fontSize: 22,
    lineHeight: 24,
    fontWeight: '700',
  },
  samvatsaraCenterWrap: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  samvatsaraBadge: {
    color: colors.goldSoft,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 2,
  },
  samvatsaraName: {
    color: colors.ivoryWarm,
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  samvatsaraSpan: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
    textAlign: 'center',
  },
  jumpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  jumpPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  jumpPillToday: {
    borderColor: colors.gold,
    backgroundColor: '#1E352B',
  },
  jumpPillIcon: {
    fontSize: 12,
  },
  jumpPillText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  jumpPillTodayText: {
    color: colors.gold,
  },
  monthNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  monthNavBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthNavArrow: {
    color: colors.gold,
    fontSize: 20,
    lineHeight: 22,
    fontWeight: '700',
  },
  monthTitleWrap: {
    alignItems: 'center',
  },
  monthTitleText: {
    color: colors.ivoryWarm,
    fontSize: 16,
    fontWeight: '700',
  },
  monthSubText: {
    color: colors.goldSoft,
    fontSize: 12,
    marginTop: 1,
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingHorizontal: 4,
  },
  weekdayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  weekdayText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  weekdayTextSunday: {
    color: colors.danger,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 8,
    marginBottom: 16,
  },
  dayCellBlank: {
    width: '14.28%',
    aspectRatio: 1,
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginVertical: 2,
  },
  dayCellDisabled: {
    opacity: 0.2,
  },
  dayCellSelected: {
    backgroundColor: colors.gold,
  },
  dayCellTodayOutline: {
    borderWidth: 1.5,
    borderColor: colors.gold,
  },
  dayText: {
    color: colors.ivoryWarm,
    fontSize: 14,
    fontWeight: '600',
  },
  dayTextSunday: {
    color: '#E09278',
  },
  dayTextDisabled: {
    color: colors.textMuted,
  },
  dayTextSelected: {
    color: colors.textOnGold,
    fontWeight: '800',
  },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.gold,
    marginTop: 2,
  },
  todayDotSelected: {
    backgroundColor: colors.textOnGold,
  },
  previewCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  previewHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  previewDateTitle: {
    color: colors.gold,
    fontSize: 15,
    fontWeight: '700',
  },
  previewPill: {
    backgroundColor: colors.surfaceAlt,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  previewPillText: {
    color: colors.ivoryWarm,
    fontSize: 11,
    fontWeight: '600',
  },
  previewDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  previewItem: {
    flex: 1,
  },
  previewLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    marginBottom: 2,
  },
  previewValue: {
    color: colors.ivoryWarm,
    fontSize: 13,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  confirmBtn: {
    backgroundColor: colors.gold,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnText: {
    color: colors.textOnGold,
    fontSize: 15,
    fontWeight: '700',
  },
});
