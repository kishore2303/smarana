import type { PanchangaResult } from './panchangamEngine';
import type { AppLanguage } from '../types/practice';

/**
 * Formats a sacred, beautiful, read-friendly WhatsApp message for daily Panchangam.
 */
export function formatPanchangaWhatsAppMessage(
  panchanga: PanchangaResult,
  language: AppLanguage = 'te'
): string {
  const isTelugu = language === 'te';

  // Format date display: e.g. "14 Nov 2026, Saturday" or "14 నవంబర్ 2026, శనివారం"
  const dateObj = new Date(panchanga.dateIso + 'T12:00:00');
  const dateFormatted = dateObj.toLocaleDateString(
    isTelugu ? 'te-IN' : 'en-US',
    {
      day: 'numeric',
      month: isTelugu ? 'long' : 'short',
      year: 'numeric',
    }
  );

  if (isTelugu) {
    const specialNote = panchanga.specialDayNotes?.telugu
      ? `\n✨ విశేషం: *${panchanga.specialDayNotes.telugu}*\n`
      : '';

    return (
`🪔 *శ్రీ ${panchanga.samvatsara.telugu} నామ సంవత్సరం*
🕉️ *${panchanga.ayana.telugu} · ${panchanga.ritu.telugu}*
📅 *నేటి తెలుగు పంచాంగం* (${dateFormatted}, ${panchanga.dayOfWeek.telugu})
-----------------------------------------
• *మాసం:* ${panchanga.masa.telugu}
• *పక్షం:* ${panchanga.paksha.telugu}
• *తిథి:* ${panchanga.tithi.fullTelugu}
• *నక్షత్రం:* ${panchanga.nakshatra.telugu} (${panchanga.nakshatra.pada}వ పాదం)
• *యోగం:* ${panchanga.yoga.telugu}
• *కరణం:* ${panchanga.karana.telugu}

⏰ *దిన సమయాలు:*
• రాహుకాలం: ${panchanga.timings.rahuKalam}
• యమగండం: ${panchanga.timings.yamagandam}
• గుళిక కాలం: ${panchanga.timings.gulikaKalam}
• దుర్ముహూర్తం: ${panchanga.timings.durmuhurtham}
• అభిజిత్: ${panchanga.timings.abhijitMuhurtham}${specialNote}
-----------------------------------------
🙏 *స్మరణ (Smarana)* · నిత్య సాధన & పంచాంగ సహచరి`
    );
  }

  // English formatting
  const specialNoteEn = panchanga.specialDayNotes?.english
    ? `\n✨ Special Day: *${panchanga.specialDayNotes.english}*\n`
    : '';

  return (
`🪔 *Sri ${panchanga.samvatsara.english} Nama Samvatsaram*
🕉️ *${panchanga.ayana.english} · ${panchanga.ritu.english}*
📅 *Daily Telugu Panchangam* (${dateFormatted}, ${panchanga.dayOfWeek.english})
-----------------------------------------
• *Masa:* ${panchanga.masa.english}
• *Paksha:* ${panchanga.paksha.english}
• *Tithi:* ${panchanga.tithi.fullEnglish}
• *Nakshatra:* ${panchanga.nakshatra.english} (Pada ${panchanga.nakshatra.pada})
• *Yoga:* ${panchanga.yoga.english}
• *Karana:* ${panchanga.karana.english}

⏰ *Auspicious & Inauspicious Timings:*
• Rahu Kalam: ${panchanga.timings.rahuKalam}
• Yamagandam: ${panchanga.timings.yamagandam}
• Gulika Kalam: ${panchanga.timings.gulikaKalam}
• Durmuhurtham: ${panchanga.timings.durmuhurtham}
• Abhijit Muhurtham: ${panchanga.timings.abhijitMuhurtham}${specialNoteEn}
-----------------------------------------
🙏 *Shared via Smarana* · Daily Sadhana & Panchangam Companion`
  );
}
