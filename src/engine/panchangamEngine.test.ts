import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getPanchanga,
  getUgadiDate,
  getUgadiYearRange,
  generateSankalpa,
} from './panchangamEngine.ts';

test('computes Panchangam for known reference date', () => {
  // Nov 13, 2026
  const date = new Date(2026, 10, 13, 6, 0, 0); // Month is 0-indexed: 10 = Nov
  const p = getPanchanga(date);

  assert.equal(typeof p.tithi.telugu, 'string');
  assert.equal(typeof p.tithi.english, 'string');
  assert.equal(typeof p.nakshatra.telugu, 'string');
  assert.equal(typeof p.nakshatra.english, 'string');
  assert.equal(typeof p.yoga.telugu, 'string');
  assert.equal(typeof p.karana.telugu, 'string');
  assert.equal(typeof p.samvatsara.telugu, 'string');
  assert.equal(typeof p.masa.telugu, 'string');
  assert.equal(typeof p.ritu.telugu, 'string');
  assert.equal(typeof p.ayana.telugu, 'string');

  // Verify day of week for 2026-11-13 is Friday
  assert.equal(p.dayOfWeek.index, 5);
  assert.equal(p.dayOfWeek.telugu, 'శుక్రవారము');
  assert.equal(p.dayOfWeek.english, 'Shukravaaramu');

  // Verify Rahu Kalam for Friday
  assert.equal(p.timings.rahuKalam, '10:30 AM - 12:00 PM');
});

test('handles full lunar cycle across pakshas without out-of-bounds error', () => {
  for (let day = 1; day <= 30; day++) {
    const d = new Date(2026, 10, day, 6, 0, 0);
    const result = getPanchanga(d);
    assert.ok(result.tithi.index >= 1 && result.tithi.index <= 15);
    assert.ok(result.nakshatra.index >= 0 && result.nakshatra.index < 27);
    assert.ok(result.nakshatra.pada >= 1 && result.nakshatra.pada <= 4);
    assert.ok(result.yoga.index >= 0 && result.yoga.index < 27);
    assert.ok(result.karana.index >= 0 && result.karana.index < 11);
    assert.ok(result.masa.index >= 0 && result.masa.index < 12);
    assert.ok(result.ritu.index >= 0 && result.ritu.index < 6);
    assert.ok(['shukla', 'krishna'].includes(result.paksha.type));
  }
});

test('computes special day notes when matching sacred tithis', () => {
  let foundEkadashi = false;
  let foundPournami = false;
  let foundAmavasya = false;

  for (let month = 0; month < 12; month++) {
    for (let day = 1; day <= 28; day++) {
      const res = getPanchanga(new Date(2026, month, day, 6, 0, 0));
      if (res.specialDayNotes.isEkadashi) foundEkadashi = true;
      if (res.specialDayNotes.isPournami) foundPournami = true;
      if (res.specialDayNotes.isAmavasya) foundAmavasya = true;
    }
  }

  assert.equal(foundEkadashi, true);
  assert.equal(foundPournami, true);
  assert.equal(foundAmavasya, true);
});

test('computes Ugadi boundaries and samvatsara correctly', () => {
  const ugadi2024 = getUgadiDate(2024);
  assert.equal(ugadi2024.getFullYear(), 2024);
  assert.equal(ugadi2024.getMonth(), 3); // April (0-indexed: 3)
  assert.equal(ugadi2024.getDate(), 9);

  const ugadi2026 = getUgadiDate(2026);
  assert.equal(ugadi2026.getFullYear(), 2026);
  assert.equal(ugadi2026.getMonth(), 2); // March (0-indexed: 2)
  assert.equal(ugadi2026.getDate(), 19);

  // Range for date after Ugadi 2026 (Nov 13, 2026)
  const rangeNov2026 = getUgadiYearRange(new Date(2026, 10, 13));
  assert.equal(rangeNov2026.lunarYear, 2026);
  assert.equal(rangeNov2026.samvatsara.telugu, 'పరాభవ');
  assert.equal(rangeNov2026.samvatsara.english, 'Paraabhava');
  assert.equal(rangeNov2026.startUgadi.getDate(), 19);
  assert.equal(rangeNov2026.startUgadi.getMonth(), 2);

  // Range for date before Ugadi 2026 (Jan 15, 2026) belongs to Vishwavasu (2025 cycle)
  const rangeJan2026 = getUgadiYearRange(new Date(2026, 0, 15));
  assert.equal(rangeJan2026.lunarYear, 2025);
  assert.equal(rangeJan2026.samvatsara.telugu, 'విశ్వావసు');
  assert.equal(rangeJan2026.samvatsara.english, 'Vishwaavasu');
});

test('generates authentic Sankalpam for Pooja and Sandhyavandanam', () => {
  const p = getPanchanga(new Date(2026, 10, 13));

  // 1. Pooja Sankalpa (Smartha)
  const poojaSmartha = generateSankalpa(p, {
    type: 'pooja',
    tradition: 'smartha',
    gotra: 'కాశ్యప',
    name: 'వెంకటేశ్వర',
  });
  assert.ok(poojaSmartha.telugu.fullText.includes('శ్రీపరమేశ్వర ప్రీత్యర్థం'));
  assert.ok(poojaSmartha.telugu.fullText.includes('కాశ్యప గోత్రస్య'));
  assert.ok(poojaSmartha.telugu.fullText.includes('పూజాం కరిష్యే'));
  assert.ok(poojaSmartha.telugu.panchangaPortion.includes(p.samvatsara.telugu));

  // 2. Pooja Sankalpa (Vaishnava)
  const poojaVaishnava = generateSankalpa(p, {
    type: 'pooja',
    tradition: 'vaishnava',
    gotra: 'శ్రీవత్స',
    name: 'రామానుజ',
  });
  assert.ok(poojaVaishnava.telugu.fullText.includes('శ్రీమన్నారాయణ ప్రీత్యర్థం'));
  assert.ok(poojaVaishnava.telugu.fullText.includes('శ్రీవత్స గోత్రస్య'));

  // 3. Pratah Sandhyavandanam
  const sandhyaPratah = generateSankalpa(p, {
    type: 'sandhya_pratah',
    tradition: 'smartha',
  });
  assert.ok(sandhyaPratah.telugu.purposePortion.includes('ప్రాతః సంధ్యాముపాసిష్యే'));

  // 4. Madhyahnika Sandhyavandanam
  const sandhyaMadhya = generateSankalpa(p, {
    type: 'sandhya_madhyahnika',
    tradition: 'smartha',
  });
  assert.ok(sandhyaMadhya.telugu.purposePortion.includes('మాధ్యాహ్నిక సంధ్యాముపాసిష్యే'));

  // 5. Sayam Sandhyavandanam
  const sandhyaSayam = generateSankalpa(p, {
    type: 'sandhya_sayam',
    tradition: 'smartha',
  });
  assert.ok(sandhyaSayam.telugu.purposePortion.includes('సాయం సంధ్యాముపాసిష్యే'));

  // 6. Gayatri Japa
  const gayatri = generateSankalpa(p, {
    type: 'gayatri_japa',
    tradition: 'smartha',
  });
  assert.ok(gayatri.telugu.purposePortion.includes('గాయత్రీ మహామంత్ర జపం కరిష్యే'));

  // 7. Tokens consistency
  assert.equal(typeof poojaSmartha.tokens.samvatsara, 'string');
  assert.equal(typeof poojaSmartha.tokens.tithi, 'string');
  assert.equal(typeof poojaSmartha.tokens.nakshatra, 'string');
  assert.equal(typeof poojaSmartha.tokens.vaara, 'string');
});
