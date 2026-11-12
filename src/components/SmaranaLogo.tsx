import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G, Path } from 'react-native-svg';
import { palette } from '../theme/tokens';

export type SmaranaLogoVariant = 'primary' | 'symbol' | 'splash' | 'monochrome';

interface SmaranaLogoProps {
  variant?: SmaranaLogoVariant;
  size?: number;
  showSanskrit?: boolean;
}

const BEAD_ANGLES = Array.from({ length: 24 }, (_, i) => (i * 2 * Math.PI) / 24 - Math.PI / 2);

export function SmaranaLogo({
  variant = 'primary',
  size = 76,
  showSanskrit = false,
}: SmaranaLogoProps) {
  const isMono = variant === 'monochrome';
  const bright = isMono ? palette.ivoryWarm : palette.goldMuted;
  const mid = isMono ? palette.ivoryWarm : '#D4B268';
  const antique = isMono ? palette.ivoryWarm : palette.goldAntique;
  const strokeCol = isMono ? 'none' : palette.forestDeep;

  return (
    <View style={styles.wrapper}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        {/* Mala bead circle */}
        <G>
          {BEAD_ANGLES.map((angle, idx) => {
            const cx = 50 + Math.cos(angle) * 38;
            const cy = 50 + Math.sin(angle) * 38;
            const isGuru = idx === 0;
            return (
              <Circle
                key={idx}
                cx={cx}
                cy={cy}
                r={isGuru ? 2.5 : 1.55}
                fill={isGuru ? bright : antique}
              />
            );
          })}
        </G>

        {/* Symmetrical Lotus */}
        <G stroke={strokeCol} strokeWidth={isMono ? 0 : 0.9} strokeLinejoin="round">
          <Path
            d="M50 63 C40 62 29 54 26 43 C35 44 43 51 50 63 Z"
            fill={antique}
          />
          <Path
            d="M50 63 C60 62 71 54 74 43 C65 44 57 51 50 63 Z"
            fill={antique}
          />
          <Path
            d="M50 63 C43 56 37 45 38 33 C44 39 48 50 50 63 Z"
            fill={mid}
          />
          <Path
            d="M50 63 C57 56 63 45 62 33 C56 39 52 50 50 63 Z"
            fill={mid}
          />
          <Path
            d="M50 25 C56 36 56 50 50 63 C44 50 44 36 50 25 Z"
            fill={bright}
          />
        </G>

        {/* Base lotus arc */}
        <Path
          d="M34 68 Q50 73 66 68"
          fill="none"
          stroke={bright}
          strokeWidth={2}
          strokeLinecap="round"
        />
      </Svg>

      {variant === 'primary' || variant === 'splash' ? (
        <View style={styles.wordmarkBlock}>
          <Text style={styles.wordmark}>SMARANA</Text>
          {showSanskrit ? <Text style={styles.sanskrit}>स्मरण</Text> : null}
          {variant === 'splash' ? (
            <Text style={styles.tagline}>Remember the Divine.</Text>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  wordmarkBlock: {
    alignItems: 'center',
    marginTop: 10,
  },
  wordmark: {
    color: palette.ivoryWarm,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 5.5,
  },
  sanskrit: {
    color: palette.goldMuted,
    fontSize: 14,
    marginTop: 2,
  },
  tagline: {
    color: palette.goldMuted,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.8,
    marginTop: 6,
  },
});
