import test from 'node:test';
import assert from 'node:assert/strict';
import { getPanchanga } from './panchangamEngine.ts';
import { formatPanchangaWhatsAppMessage } from './panchangaShareFormatter.ts';

test('formatPanchangaWhatsAppMessage - formats Telugu WhatsApp message correctly', () => {
  const date = new Date(2026, 10, 14); // Nov 14, 2026
  const panchanga = getPanchanga(date);

  const message = formatPanchangaWhatsAppMessage(panchanga, 'te');

  // Verify sacred emojis and header
  assert.ok(message.includes('🪔 *శ్రీ'), 'Header should include sacred lamp emoji and Samvatsara');
  assert.ok(message.includes('📅 *నేటి తెలుగు పంచాంగం*'), 'Should include calendar header');
  assert.ok(message.includes('• *మాసం:*'), 'Should include Masa');
  assert.ok(message.includes('• *పక్షం:*'), 'Should include Paksha');
  assert.ok(message.includes('• *తిథి:*'), 'Should include Tithi');
  assert.ok(message.includes('• *నక్షత్రం:*'), 'Should include Nakshatra');
  assert.ok(message.includes('• *యోగం:*'), 'Should include Yoga');
  assert.ok(message.includes('• *కరణం:*'), 'Should include Karana');
  assert.ok(message.includes('⏰ *దిన సమయాలు:*'), 'Should include Timings');
  assert.ok(message.includes('• రాహుకాలం:'), 'Should include Rahu Kalam');
  assert.ok(message.includes('• దుర్ముహూర్తం:'), 'Should include Durmuhurtham');
  assert.ok(message.includes('• అభిజిత్:'), 'Should include Abhijit Muhurtham');
  assert.ok(message.includes('స్మరణ (Smarana)'), 'Should include Smarana footer attribution');
});

test('formatPanchangaWhatsAppMessage - formats English WhatsApp message correctly', () => {
  const date = new Date(2026, 10, 14); // Nov 14, 2026
  const panchanga = getPanchanga(date);

  const message = formatPanchangaWhatsAppMessage(panchanga, 'en');

  // Verify English text and structure
  assert.ok(message.includes('🪔 *Sri'), 'Header should include Sri Samvatsara');
  assert.ok(message.includes('📅 *Daily Telugu Panchangam*'), 'Should include English header');
  assert.ok(message.includes('• *Masa:*'), 'Should include Masa in English');
  assert.ok(message.includes('• *Paksha:*'), 'Should include Paksha in English');
  assert.ok(message.includes('• *Tithi:*'), 'Should include Tithi in English');
  assert.ok(message.includes('• *Nakshatra:*'), 'Should include Nakshatra in English');
  assert.ok(message.includes('• Rahu Kalam:'), 'Should include Rahu Kalam in English');
  assert.ok(message.includes('Shared via Smarana'), 'Should include Smarana English footer');
});

test('formatPanchangaWhatsAppMessage - includes special day festival when present', () => {
  const date = new Date(2026, 10, 14);
  const panchanga = getPanchanga(date);
  // Inject a special day note for testing
  panchanga.specialDayNotes = {
    telugu: 'శ్రీ వినాయక చతుర్థి వ్రతం',
    english: 'Sri Vinayaka Chavithi Vratam',
    isEkadashi: false,
    isPournami: false,
    isAmavasya: false,
    isPradosham: false,
    isSankashti: true,
  };

  const messageTe = formatPanchangaWhatsAppMessage(panchanga, 'te');
  assert.ok(messageTe.includes('✨ విశేషం: *శ్రీ వినాయక చతుర్థి వ్రతం*'));

  const messageEn = formatPanchangaWhatsAppMessage(panchanga, 'en');
  assert.ok(messageEn.includes('✨ Special Day: *Sri Vinayaka Chavithi Vratam*'));
});
