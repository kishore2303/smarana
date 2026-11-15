export type PracticeMode = 'pradakshina' | 'japa';

export type SessionStatus = 'idle' | 'active' | 'paused' | 'completed';

export type BackTapSensitivity = 'low' | 'medium' | 'high';

export type AppLanguage = 'en' | 'te';

export type MalaSize = 27 | 108;

export type MeruBehavior = 'continue' | 'pause';

export type MantraScript = 'sanskrit' | 'telugu' | 'english';

export type MantraCategory = 'mantra' | 'ashtothram';

export interface AshtothramName {
  num: number;
  sanskrit: string;
  telugu: string;
  english: string;
}

export interface MantraEntry {
  id: string;
  name: string;
  deity?: string;
  category?: MantraCategory;
  textSanskrit?: string;
  textTelugu?: string;
  textEnglish?: string;
  names?: AshtothramName[];
  defaultTarget: number;
  isBuiltIn: boolean;
  isFavorite: boolean;
}

export interface CustomMantraInput {
  name: string;
  deity?: string;
  category?: MantraCategory;
  textSanskrit?: string;
  textTelugu?: string;
  textEnglish?: string;
  defaultTarget: number;
}

export interface MantraHistoryStats {
  sessionsCount: number;
  totalRepetitions: number;
  lastCompletedAt?: string;
}

export interface AppSettings {
  backTapEnabled: boolean;
  backTapSensitivity: BackTapSensitivity;
  keepScreenAwake: boolean;
  language: AppLanguage;
  malaSize: MalaSize;
  meruBehavior: MeruBehavior;
  malaHapticEnabled: boolean;
  dailyPanchangamReminder: boolean;
}

export interface PracticeSession {
  id: string;
  mode: PracticeMode;
  label: string; // Temple name (Pradakshina) or Mantra name (Japa)
  targetCount: number;
  remainingCount: number;
  status: SessionStatus;
  startedAt: string; // ISO timestamp
  completedAt?: string;
}

export interface CompletedSessionRecord {
  id: string;
  mode: PracticeMode;
  label: string;
  targetCount: number;
  startedAt: string;
  completedAt: string;
}

export interface SavedPreset {
  id: string;
  mode: PracticeMode;
  label: string;
  targetCount: number;
}

export interface PracticeStats {
  todaySessions: number;
  todayCount: number;
  monthSessions: number;
  monthCount: number;
  totalJapaCount: number;
  totalPradakshinaCount: number;
}

export const DEFAULT_APP_SETTINGS: AppSettings = {
  backTapEnabled: true,
  backTapSensitivity: 'medium',
  keepScreenAwake: true,
  language: 'te',
  malaSize: 108,
  meruBehavior: 'continue',
  malaHapticEnabled: true,
  dailyPanchangamReminder: true,
};

export const JAPA_SUGGESTED_TARGETS = [11, 27, 54, 108, 1008] as const;
export const DEFAULT_JAPA_TARGET = 108;
