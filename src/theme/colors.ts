import { palette } from './tokens';

/**
 * Smarana semantic color tokens built on Deep Forest Green,
 * Muted/Antique Gold, Warm Ivory, and Sage Grey.
 */
export const colors = {
  background: palette.forestDeep,
  surface: palette.forestElevated,
  surfaceAlt: palette.forestPressed,
  earth: palette.earthBrown,
  earthLight: palette.earthLight,
  gold: palette.goldAntique,
  goldSoft: palette.goldMuted,
  ivoryWarm: palette.ivoryWarm,
  ivorySoft: palette.ivorySoft,
  textPrimary: palette.ivoryWarm,
  textSecondary: palette.sageGrey,
  textMuted: palette.sageMuted,
  textOnGold: palette.deepGreenText,
  success: palette.successGreen,
  danger: palette.terracotta,
  border: palette.forestBorder,
} as const;
