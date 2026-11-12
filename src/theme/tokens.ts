export const palette = {
  forestDeep: '#172E27',
  forestElevated: '#1F3B32',
  forestPressed: '#27493E',
  forestBorder: '#2C5246',
  goldMuted: '#E8C77B',
  goldAntique: '#B99A55',
  ivoryWarm: '#F4EAD5',
  ivorySoft: '#FFFDF7',
  sageGrey: '#B7C6B9',
  sageMuted: '#839789',
  deepGreenText: '#172E27',
  earthBrown: '#4A3728',
  earthLight: '#6E533E',
  successGreen: '#6DA884',
  terracotta: '#C4685B',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
} as const;

export const radii = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  pill: 999,
} as const;

export const typography = {
  wordmark: {
    fontSize: 26,
    fontWeight: '700' as const,
    letterSpacing: 5,
  },
  heading: {
    fontSize: 26,
    fontWeight: '600' as const,
  },
  subheading: {
    fontSize: 17,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 1.5,
  },
  countdown: {
    fontSize: 82,
    fontWeight: '700' as const,
    lineHeight: 90,
  },
} as const;
