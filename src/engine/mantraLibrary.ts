import type {
  MantraEntry,
  MantraHistoryStats,
  MantraScript,
} from '../types/practice';

export type MantraFilterTab = 'all' | 'favorites' | 'custom' | 'ashtothram';

export function filterMantras(
  mantras: MantraEntry[],
  query: string,
  tab: MantraFilterTab
): MantraEntry[] {
  const normalized = query.trim().toLowerCase();

  return mantras.filter((item) => {
    if (tab === 'favorites' && !item.isFavorite) {
      return false;
    }
    if (tab === 'custom' && item.isBuiltIn) {
      return false;
    }
    if (tab === 'ashtothram' && item.category !== 'ashtothram') {
      return false;
    }
    if (!normalized) {
      return true;
    }
    const haystack = [
      item.name,
      item.deity ?? '',
      item.textEnglish ?? '',
      item.textSanskrit ?? '',
      item.textTelugu ?? '',
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(normalized);
  });
}

export function getMantraDisplayText(
  mantra: MantraEntry,
  preferredScript: MantraScript
): string | undefined {
  if (preferredScript === 'sanskrit') {
    return mantra.textSanskrit || mantra.textTelugu || mantra.textEnglish;
  }
  if (preferredScript === 'telugu') {
    return mantra.textTelugu || mantra.textSanskrit || mantra.textEnglish;
  }
  return mantra.textEnglish || mantra.textSanskrit || mantra.textTelugu;
}

export function getStatsForMantra(
  mantraName: string,
  statsMap: Record<string, MantraHistoryStats>
): MantraHistoryStats | undefined {
  const key = mantraName.trim().toLowerCase();
  if (!key) {
    return undefined;
  }
  return statsMap[key];
}
