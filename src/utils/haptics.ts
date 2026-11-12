import * as Haptics from 'expo-haptics';
import { Vibration } from 'react-native';

/**
 * Subtle tactile confirmation for each counted tap.
 */
export async function triggerCountHaptic(): Promise<void> {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {
    // Ignore on devices/simulators without haptic hardware
  }
}

/**
 * Calm double-pulse haptic when a single Mala (27 or 108 beads) is completed.
 */
export async function triggerMalaCompletionHaptic(): Promise<void> {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch {
    // Ignore if unsupported
  }

  try {
    Vibration.vibrate([0, 90, 90, 140]);
  } catch {
    // Ignore if unsupported
  }
}

/**
 * Distinct vibration pattern + success haptic when the countdown reaches zero.
 */
export async function triggerCompletionFeedback(): Promise<void> {
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch {
    // Ignore if unsupported
  }

  try {
    // Pattern: wait 0ms, vibrate 250ms, pause 120ms, vibrate 400ms
    Vibration.vibrate([0, 250, 120, 400]);
  } catch {
    // Ignore if unsupported
  }
}
