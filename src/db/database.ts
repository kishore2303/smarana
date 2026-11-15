import * as SQLite from 'expo-sqlite';
import { BUILT_IN_MANTRAS } from '../data/mantras';
import { ALL_ASHTOTHRAMS } from '../data/ashtothrams';
import {
  DEFAULT_APP_SETTINGS,
  type AppLanguage,
  type AppSettings,
  type BackTapSensitivity,
  type CompletedSessionRecord,
  type CustomMantraInput,
  type MalaSize,
  type MantraEntry,
  type MantraHistoryStats,
  type MeruBehavior,
  type PracticeMode,
  type PracticeSession,
  type PracticeStats,
  type SavedPreset,
} from '../types/practice';

let dbInstance: SQLite.SQLiteDatabase | null = null;
let isInitialized = false;

function getDb(): SQLite.SQLiteDatabase {
  if (!dbInstance) {
    dbInstance = SQLite.openDatabaseSync('pradakshana.db');
  }
  if (!isInitialized) {
    dbInstance.execSync(`
      CREATE TABLE IF NOT EXISTS active_sessions (
        mode TEXT PRIMARY KEY NOT NULL,
        id TEXT NOT NULL,
        label TEXT NOT NULL,
        target_count INTEGER NOT NULL,
        remaining_count INTEGER NOT NULL,
        status TEXT NOT NULL,
        started_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS session_history (
        id TEXT PRIMARY KEY NOT NULL,
        mode TEXT NOT NULL,
        label TEXT NOT NULL,
        target_count INTEGER NOT NULL,
        started_at TEXT NOT NULL,
        completed_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS app_settings (
        key TEXT PRIMARY KEY NOT NULL,
        value TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS saved_presets (
        id TEXT PRIMARY KEY NOT NULL,
        mode TEXT NOT NULL,
        label TEXT NOT NULL,
        target_count INTEGER NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS user_mantras (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        deity TEXT,
        text_sanskrit TEXT,
        text_telugu TEXT,
        text_english TEXT,
        default_target INTEGER NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS mantra_favorites (
        mantra_id TEXT PRIMARY KEY NOT NULL
      );
    `);
    dbInstance.execSync(`PRAGMA user_version = 1;`);
    isInitialized = true;
  }
  return dbInstance;
}

export function initDatabase(): void {
  getDb();
}

export function saveActiveSession(session: PracticeSession): void {
  if (session.status !== 'active' && session.status !== 'paused') {
    return;
  }
  const db = getDb();
  db.runSync(
    `INSERT INTO active_sessions (
      mode, id, label, target_count, remaining_count, status, started_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(mode) DO UPDATE SET
      id = excluded.id,
      label = excluded.label,
      target_count = excluded.target_count,
      remaining_count = excluded.remaining_count,
      status = excluded.status,
      started_at = excluded.started_at,
      updated_at = excluded.updated_at`,
    [
      session.mode,
      session.id,
      session.label,
      session.targetCount,
      session.remainingCount,
      session.status,
      session.startedAt,
      new Date().toISOString(),
    ]
  );
}

export function getActiveSession(mode: PracticeMode): PracticeSession | null {
  const db = getDb();
  const row = db.getFirstSync<{
    id: string;
    mode: PracticeMode;
    label: string;
    target_count: number;
    remaining_count: number;
    status: 'active' | 'paused';
    started_at: string;
  }>(
    `SELECT id, mode, label, target_count, remaining_count, status, started_at
     FROM active_sessions
     WHERE mode = ?`,
    [mode]
  );

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    mode: row.mode,
    label: row.label,
    targetCount: row.target_count,
    remainingCount: row.remaining_count,
    status: row.status,
    startedAt: row.started_at,
  };
}

export function deleteActiveSession(mode: PracticeMode): void {
  const db = getDb();
  db.runSync(`DELETE FROM active_sessions WHERE mode = ?`, [mode]);
}

export function recordCompletedSession(session: PracticeSession): void {
  const db = getDb();
  const completedAt = session.completedAt ?? new Date().toISOString();

  db.runSync(
    `INSERT OR IGNORE INTO session_history (
      id, mode, label, target_count, started_at, completed_at
    ) VALUES (?, ?, ?, ?, ?, ?)`,
    [
      session.id,
      session.mode,
      session.label,
      session.targetCount,
      session.startedAt,
      completedAt,
    ]
  );

  db.runSync(`DELETE FROM active_sessions WHERE mode = ?`, [session.mode]);
}

export function getSessionHistory(limit = 100): CompletedSessionRecord[] {
  const db = getDb();
  const rows = db.getAllSync<{
    id: string;
    mode: PracticeMode;
    label: string;
    target_count: number;
    started_at: string;
    completed_at: string;
  }>(
    `SELECT id, mode, label, target_count, started_at, completed_at
     FROM session_history
     ORDER BY completed_at DESC
     LIMIT ?`,
    [limit]
  );

  return rows.map((row) => ({
    id: row.id,
    mode: row.mode,
    label: row.label,
    targetCount: row.target_count,
    startedAt: row.started_at,
    completedAt: row.completed_at,
  }));
}

export function clearSessionHistory(): void {
  const db = getDb();
  db.runSync(`DELETE FROM session_history`);
}

export function getPracticeStats(now = new Date()): PracticeStats {
  const db = getDb();
  const history = getSessionHistory(500);

  const todayYear = now.getFullYear();
  const todayMonth = now.getMonth();
  const todayDate = now.getDate();

  let todaySessions = 0;
  let todayCount = 0;
  let monthSessions = 0;
  let monthCount = 0;

  for (const item of history) {
    const completed = new Date(item.completedAt);
    if (Number.isNaN(completed.getTime())) {
      continue;
    }

    const sameMonth =
      completed.getFullYear() === todayYear &&
      completed.getMonth() === todayMonth;

    if (sameMonth) {
      monthSessions += 1;
      monthCount += item.targetCount;

      if (completed.getDate() === todayDate) {
        todaySessions += 1;
        todayCount += item.targetCount;
      }
    }
  }

  const lifetimeRows = db.getAllSync<{
    mode: PracticeMode;
    total: number | null;
  }>(
    `SELECT mode, SUM(target_count) as total FROM session_history GROUP BY mode`
  );

  let totalJapaCount = 0;
  let totalPradakshinaCount = 0;
  for (const row of lifetimeRows) {
    if (row.mode === 'japa') {
      totalJapaCount = row.total ?? 0;
    } else if (row.mode === 'pradakshina') {
      totalPradakshinaCount = row.total ?? 0;
    }
  }

  return {
    todaySessions,
    todayCount,
    monthSessions,
    monthCount,
    totalJapaCount,
    totalPradakshinaCount,
  };
}

export function getAppSettings(): AppSettings {
  const db = getDb();
  const rows = db.getAllSync<{ key: string; value: string }>(
    `SELECT key, value FROM app_settings`
  );

  const map = new Map(rows.map((r) => [r.key, r.value]));
  const rawEnabled = map.get('backTapEnabled');
  const rawSensitivity = map.get('backTapSensitivity');
  const rawKeepAwake = map.get('keepScreenAwake');
  const rawLanguage = map.get('language');
  const rawMalaSize = map.get('malaSize');
  const rawMeruBehavior = map.get('meruBehavior');
  const rawMalaHaptic = map.get('malaHapticEnabled');
  const rawDailyPanchanga = map.get('dailyPanchangamReminder');

  const sensitivity: BackTapSensitivity =
    rawSensitivity === 'low' ||
    rawSensitivity === 'medium' ||
    rawSensitivity === 'high'
      ? rawSensitivity
      : DEFAULT_APP_SETTINGS.backTapSensitivity;

  const language: AppLanguage =
    rawLanguage === 'te' || rawLanguage === 'en'
      ? rawLanguage
      : DEFAULT_APP_SETTINGS.language;

  const malaSize: MalaSize =
    rawMalaSize === '27'
      ? 27
      : rawMalaSize === '108'
        ? 108
        : DEFAULT_APP_SETTINGS.malaSize;

  const meruBehavior: MeruBehavior =
    rawMeruBehavior === 'pause' || rawMeruBehavior === 'continue'
      ? rawMeruBehavior
      : DEFAULT_APP_SETTINGS.meruBehavior;

  return {
    backTapEnabled:
      rawEnabled === undefined
        ? DEFAULT_APP_SETTINGS.backTapEnabled
        : rawEnabled === 'true',
    backTapSensitivity: sensitivity,
    keepScreenAwake:
      rawKeepAwake === undefined
        ? DEFAULT_APP_SETTINGS.keepScreenAwake
        : rawKeepAwake === 'true',
    language,
    malaSize,
    meruBehavior,
    malaHapticEnabled:
      rawMalaHaptic === undefined
        ? DEFAULT_APP_SETTINGS.malaHapticEnabled
        : rawMalaHaptic === 'true',
    dailyPanchangamReminder:
      rawDailyPanchanga === undefined
        ? DEFAULT_APP_SETTINGS.dailyPanchangamReminder
        : rawDailyPanchanga === 'true',
  };
}

export function saveAppSettings(settings: AppSettings): void {
  const db = getDb();
  db.runSync(
    `INSERT INTO app_settings (key, value) VALUES ('backTapEnabled', ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    [String(settings.backTapEnabled)]
  );
  db.runSync(
    `INSERT INTO app_settings (key, value) VALUES ('backTapSensitivity', ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    [settings.backTapSensitivity]
  );
  db.runSync(
    `INSERT INTO app_settings (key, value) VALUES ('keepScreenAwake', ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    [String(settings.keepScreenAwake)]
  );
  db.runSync(
    `INSERT INTO app_settings (key, value) VALUES ('language', ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    [settings.language]
  );
  db.runSync(
    `INSERT INTO app_settings (key, value) VALUES ('malaSize', ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    [String(settings.malaSize)]
  );
  db.runSync(
    `INSERT INTO app_settings (key, value) VALUES ('meruBehavior', ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    [settings.meruBehavior]
  );
  db.runSync(
    `INSERT INTO app_settings (key, value) VALUES ('malaHapticEnabled', ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    [String(settings.malaHapticEnabled)]
  );
  db.runSync(
    `INSERT INTO app_settings (key, value) VALUES ('dailyPanchangamReminder', ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    [String(settings.dailyPanchangamReminder)]
  );
}

export function getSavedPresets(mode: PracticeMode): SavedPreset[] {
  const db = getDb();
  const rows = db.getAllSync<{
    id: string;
    mode: PracticeMode;
    label: string;
    target_count: number;
  }>(
    `SELECT id, mode, label, target_count
     FROM saved_presets
     WHERE mode = ?
     ORDER BY created_at DESC
     LIMIT 12`,
    [mode]
  );

  return rows.map((row) => ({
    id: row.id,
    mode: row.mode,
    label: row.label,
    targetCount: row.target_count,
  }));
}

export function savePreset(
  mode: PracticeMode,
  label: string,
  targetCount: number
): void {
  const trimmed = label.trim();
  if (!trimmed || targetCount < 1) {
    return;
  }
  const db = getDb();
  const existing = db.getFirstSync<{ id: string }>(
    `SELECT id FROM saved_presets WHERE mode = ? AND LOWER(label) = LOWER(?) AND target_count = ?`,
    [mode, trimmed, targetCount]
  );

  if (existing) {
    db.runSync(
      `UPDATE saved_presets SET created_at = ? WHERE id = ?`,
      [new Date().toISOString(), existing.id]
    );
    return;
  }

  db.runSync(
    `INSERT INTO saved_presets (id, mode, label, target_count, created_at) VALUES (?, ?, ?, ?, ?)`,
    [
      `${mode}-preset-${Date.now()}`,
      mode,
      trimmed,
      targetCount,
      new Date().toISOString(),
    ]
  );
}

export function deletePreset(id: string): void {
  const db = getDb();
  db.runSync(`DELETE FROM saved_presets WHERE id = ?`, [id]);
}

export function getAllMantras(): MantraEntry[] {
  const db = getDb();
  const customRows = db.getAllSync<{
    id: string;
    name: string;
    deity: string | null;
    text_sanskrit: string | null;
    text_telugu: string | null;
    text_english: string | null;
    default_target: number;
  }>(
    `SELECT id, name, deity, text_sanskrit, text_telugu, text_english, default_target
     FROM user_mantras
     ORDER BY created_at DESC`
  );

  const favRows = db.getAllSync<{ mantra_id: string }>(
    `SELECT mantra_id FROM mantra_favorites`
  );
  const favSet = new Set(favRows.map((r) => r.mantra_id));

  const customEntries: MantraEntry[] = customRows.map((row) => ({
    id: row.id,
    name: row.name,
    deity: row.deity ?? undefined,
    textSanskrit: row.text_sanskrit ?? undefined,
    textTelugu: row.text_telugu ?? undefined,
    textEnglish: row.text_english ?? undefined,
    defaultTarget: row.default_target,
    isBuiltIn: false,
    isFavorite: favSet.has(row.id),
  }));

  const builtInEntries: MantraEntry[] = [
    ...BUILT_IN_MANTRAS,
    ...ALL_ASHTOTHRAMS,
  ].map((m) => ({
    ...m,
    isFavorite: favSet.has(m.id),
  }));

  return [...customEntries, ...builtInEntries].sort((a, b) => {
    if (a.isFavorite !== b.isFavorite) {
      return a.isFavorite ? -1 : 1;
    }
    return 0;
  });
}

export function saveCustomMantra(input: CustomMantraInput): MantraEntry {
  const db = getDb();
  const id = `custom-mantra-${Date.now()}`;
  const trimmedName = input.name.trim();
  const sanitizedTarget = Math.max(1, Math.floor(input.defaultTarget));
  const deity = input.deity?.trim() || null;
  const textSanskrit = input.textSanskrit?.trim() || null;
  const textTelugu = input.textTelugu?.trim() || null;
  const textEnglish = input.textEnglish?.trim() || null;

  db.runSync(
    `INSERT INTO user_mantras (
      id, name, deity, text_sanskrit, text_telugu, text_english, default_target, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      trimmedName,
      deity,
      textSanskrit,
      textTelugu,
      textEnglish,
      sanitizedTarget,
      new Date().toISOString(),
    ]
  );

  return {
    id,
    name: trimmedName,
    deity: deity ?? undefined,
    textSanskrit: textSanskrit ?? undefined,
    textTelugu: textTelugu ?? undefined,
    textEnglish: textEnglish ?? undefined,
    defaultTarget: sanitizedTarget,
    isBuiltIn: false,
    isFavorite: false,
  };
}

export function deleteCustomMantra(id: string): void {
  const db = getDb();
  db.runSync(`DELETE FROM user_mantras WHERE id = ?`, [id]);
  db.runSync(`DELETE FROM mantra_favorites WHERE mantra_id = ?`, [id]);
}

export function toggleMantraFavorite(mantraId: string): boolean {
  const db = getDb();
  const existing = db.getFirstSync<{ mantra_id: string }>(
    `SELECT mantra_id FROM mantra_favorites WHERE mantra_id = ?`,
    [mantraId]
  );

  if (existing) {
    db.runSync(`DELETE FROM mantra_favorites WHERE mantra_id = ?`, [mantraId]);
    return false;
  }

  db.runSync(`INSERT INTO mantra_favorites (mantra_id) VALUES (?)`, [
    mantraId,
  ]);
  return true;
}

export function getMantraHistoryStatsMap(): Record<string, MantraHistoryStats> {
  const db = getDb();
  const rows = db.getAllSync<{
    label: string;
    sessions_count: number;
    total_reps: number;
    last_completed_at: string;
  }>(
    `SELECT LOWER(TRIM(label)) as label,
            COUNT(*) as sessions_count,
            SUM(target_count) as total_reps,
            MAX(completed_at) as last_completed_at
     FROM session_history
     WHERE mode = 'japa' AND TRIM(label) != ''
     GROUP BY LOWER(TRIM(label))`
  );

  const map: Record<string, MantraHistoryStats> = {};
  for (const row of rows) {
    map[row.label] = {
      sessionsCount: row.sessions_count,
      totalRepetitions: row.total_reps,
      lastCompletedAt: row.last_completed_at,
    };
  }
  return map;
}
