import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { palette } from '../theme/tokens';
import type { MalaSize } from '../types/practice';

interface MalaProgressRingProps {
  completed: number;
  target: number;
  beadsPerMala?: MalaSize;
  ratio?: number;
  isMeruHighlighted?: boolean;
  size?: number;
  children: React.ReactNode;
}

/**
 * Configurable 27-bead or 108-bead Mala progress ring for Japa counting,
 * crowned with a distinct top Meru (Guru) bead.
 */
export function MalaProgressRing({
  completed,
  target,
  beadsPerMala = 108,
  ratio: explicitRatio,
  isMeruHighlighted = false,
  size = 248,
  children,
}: MalaProgressRingProps) {
  const computedRatio =
    explicitRatio !== undefined
      ? Math.min(1, Math.max(0, explicitRatio))
      : target > 0
        ? Math.min(1, Math.max(0, completed / target))
        : 0;

  const litBeads = Math.round(computedRatio * beadsPerMala);
  const center = size / 2;
  const radius = size / 2 - 14;
  const totalSlots = beadsPerMala + 1; // +1 slot at top for the Meru bead
  const angleStep = (2 * Math.PI) / totalSlots;

  const beadRadius = beadsPerMala === 108 ? 1.95 : 3.5;
  const meruRadius = beadsPerMala === 108 ? 4.3 : 5.4;
  const meruX = center;
  const meruY = center - radius;
  const isMeruLit = isMeruHighlighted || litBeads >= beadsPerMala;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={StyleSheet.absoluteFill}
      >
        {/* Counting beads 1..beadsPerMala */}
        {Array.from({ length: beadsPerMala }, (_, index) => {
          const angle = (index + 1) * angleStep - Math.PI / 2;
          const cx = center + Math.cos(angle) * radius;
          const cy = center + Math.sin(angle) * radius;
          const isLit = index < litBeads;

          return (
            <Circle
              key={index}
              cx={cx}
              cy={cy}
              r={beadRadius}
              fill={isLit ? palette.goldMuted : palette.forestBorder}
              opacity={isLit ? 1 : 0.65}
            />
          );
        })}

        {/* Top Meru (Guru) bead with optional milestone halo */}
        {isMeruLit ? (
          <Circle
            cx={meruX}
            cy={meruY}
            r={meruRadius + 4}
            fill={palette.goldMuted}
            opacity={0.28}
          />
        ) : null}
        <Circle
          cx={meruX}
          cy={meruY}
          r={meruRadius}
          fill={isMeruLit ? palette.goldMuted : palette.goldAntique}
          opacity={isMeruLit ? 1 : 0.85}
        />
      </Svg>
      <View style={styles.centerContent}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
});
