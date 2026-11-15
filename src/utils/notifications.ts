import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { translations } from '../i18n/translations';
import type { AppLanguage, PracticeMode } from '../types/practice';

const COMPLETION_CHANNEL_ID = 'practice-completion';
const PANCHANGA_CHANNEL_ID = 'panchanga-morning';
export const DAILY_PANCHANGA_NOTIFICATION_ID = 'smarana-daily-panchangam-6am';

let isConfigured = false;

export function configureNotifications(): void {
  if (isConfigured) {
    return;
  }
  isConfigured = true;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export async function ensureNotificationPermissions(): Promise<boolean> {
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(COMPLETION_CHANNEL_ID, {
        name: 'Practice Completion',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 120, 400],
      });
      await Notifications.setNotificationChannelAsync(PANCHANGA_CHANNEL_ID, {
        name: 'Daily Panchangam',
        importance: Notifications.AndroidImportance.DEFAULT,
        sound: 'default',
      });
    }

    const existing = await Notifications.getPermissionsAsync();
    if (existing.status === 'granted') {
      return true;
    }

    const requested = await Notifications.requestPermissionsAsync();
    return requested.status === 'granted';
  } catch {
    return false;
  }
}

export async function sendCompletionNotification(
  mode: PracticeMode,
  label: string,
  targetCount: number,
  language: AppLanguage = 'en'
): Promise<void> {
  try {
    const t = translations[language].notifications;
    const title = mode === 'pradakshina' ? t.pradakshinaTitle : t.japaTitle;
    const unit = mode === 'pradakshina' ? t.pradakshinaUnit : t.japaUnit;
    const body = label
      ? `${targetCount} ${unit} — ${label}`
      : `${targetCount} ${unit}`;

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
      },
      trigger: null,
    });
  } catch {
    // Do not disrupt the completion screen if notification permissions were denied
  }
}

export async function scheduleDailyPanchangamReminder(
  enabled: boolean,
  hour = 6,
  minute = 0,
  language: AppLanguage = 'te'
): Promise<boolean> {
  try {
    // Always cancel existing reminder first to prevent duplicates
    await Notifications.cancelScheduledNotificationAsync(
      DAILY_PANCHANGA_NOTIFICATION_ID
    ).catch(() => {});

    if (!enabled) {
      return true;
    }

    const hasPermission = await ensureNotificationPermissions();
    if (!hasPermission) {
      return false;
    }

    const t = translations[language].notifications;
    await Notifications.scheduleNotificationAsync({
      identifier: DAILY_PANCHANGA_NOTIFICATION_ID,
      content: {
        title: `🪔 ${t.panchangaReminderTitle}`,
        body: t.panchangaReminderBody,
        sound: true,
        data: { action: 'panchangam_share' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
        channelId: PANCHANGA_CHANNEL_ID,
      },
    });

    return true;
  } catch {
    return false;
  }
}
