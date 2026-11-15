import { Linking, Share } from 'react-native';
import type { PanchangaResult } from '../engine/panchangamEngine';
import type { AppLanguage } from '../types/practice';
import { formatPanchangaWhatsAppMessage } from '../engine/panchangaShareFormatter';

export { formatPanchangaWhatsAppMessage };

/**
 * 1-Tap WhatsApp share.
 * Tries opening WhatsApp directly with pre-filled message;
 * if WhatsApp is not installed, gracefully falls back to native OS share sheet.
 */
export async function sharePanchangaWhatsApp(
  panchanga: PanchangaResult,
  language: AppLanguage = 'te'
): Promise<{ success: boolean; method: 'whatsapp' | 'nativeShare' | 'failed' }> {
  const message = formatPanchangaWhatsAppMessage(panchanga, language);
  const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(message)}`;

  try {
    const canOpen = await Linking.canOpenURL(whatsappUrl);
    if (canOpen) {
      await Linking.openURL(whatsappUrl);
      return { success: true, method: 'whatsapp' };
    }
  } catch {
    // If checking canOpenURL fails, continue to fallback
  }

  // Fallback: Native system share sheet (WhatsApp, Telegram, Messages, Copy)
  try {
    const title = language === 'te' ? 'నేటి తెలుగు పంచాంగం' : 'Daily Telugu Panchangam';
    await Share.share({
      message,
      title,
    });
    return { success: true, method: 'nativeShare' };
  } catch {
    return { success: false, method: 'failed' };
  }
}
