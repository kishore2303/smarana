import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterMantras,
  getMantraDisplayText,
  getStatsForMantra,
} from './mantraLibrary.ts';
import type { MantraEntry } from '../types/practice.ts';

const SAMPLE_MANTRAS: MantraEntry[] = [
  {
    id: 'builtin-1',
    name: 'Om Namah Shivaya',
    deity: 'Shiva',
    textSanskrit: 'ॐ नमः शिवाय',
    textTelugu: 'ఓం నమః శివాయ',
    textEnglish: 'Om Namah Shivaya',
    defaultTarget: 108,
    isBuiltIn: true,
    isFavorite: true,
  },
  {
    id: 'builtin-2',
    name: 'Om Gam Ganapataye Namah',
    deity: 'Ganesha',
    textSanskrit: 'ॐ गं गणपतये नमः',
    textEnglish: 'Om Gam Ganapataye Namah',
    defaultTarget: 27,
    isBuiltIn: true,
    isFavorite: false,
  },
  {
    id: 'custom-1',
    name: 'Personal Guru Mantra',
    deity: 'Guru',
    textEnglish: 'Om Gurave Namah',
    defaultTarget: 54,
    isBuiltIn: false,
    isFavorite: true,
  },
  {
    id: 'ashtothram-1',
    name: 'Sri Ganesha Ashtottara Shatanamavali',
    deity: 'Ganesha',
    category: 'ashtothram',
    defaultTarget: 108,
    isBuiltIn: true,
    isFavorite: false,
  },
];

test('filters mantras by tab and search query', () => {
  assert.equal(filterMantras(SAMPLE_MANTRAS, '', 'all').length, 4);
  assert.equal(filterMantras(SAMPLE_MANTRAS, '', 'favorites').length, 2);
  assert.equal(filterMantras(SAMPLE_MANTRAS, '', 'custom').length, 1);
  assert.equal(filterMantras(SAMPLE_MANTRAS, '', 'ashtothram').length, 1);
  assert.equal(filterMantras(SAMPLE_MANTRAS, '', 'ashtothram')[0].id, 'ashtothram-1');

  const searchDeity = filterMantras(SAMPLE_MANTRAS, 'ganesha', 'all');
  assert.equal(searchDeity.length, 2);
  assert.equal(searchDeity[0].id, 'builtin-2');
  assert.equal(searchDeity[1].id, 'ashtothram-1');

  const searchCustomFav = filterMantras(SAMPLE_MANTRAS, 'guru', 'favorites');
  assert.equal(searchCustomFav.length, 1);
  assert.equal(searchCustomFav[0].id, 'custom-1');
});

test('selects preferred script text with graceful fallback', () => {
  assert.equal(
    getMantraDisplayText(SAMPLE_MANTRAS[0], 'telugu'),
    'ఓం నమః శివాయ'
  );
  // builtin-2 lacks Telugu text, falls back to Sanskrit
  assert.equal(
    getMantraDisplayText(SAMPLE_MANTRAS[1], 'telugu'),
    'ॐ गं गणपतये नमः'
  );
  // custom-1 only has English text
  assert.equal(
    getMantraDisplayText(SAMPLE_MANTRAS[2], 'sanskrit'),
    'Om Gurave Namah'
  );
});

test('matches mantra-wise history stats case-insensitively', () => {
  const statsMap = {
    'om namah shivaya': {
      sessionsCount: 4,
      totalRepetitions: 432,
      lastCompletedAt: '2026-11-10T06:30:00.000Z',
    },
  };

  const stats = getStatsForMantra('  Om Namah Shivaya ', statsMap);
  assert.ok(stats);
  assert.equal(stats.sessionsCount, 4);
  assert.equal(stats.totalRepetitions, 432);
  assert.equal(getStatsForMantra('Unknown', statsMap), undefined);
});
