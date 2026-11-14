import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';

export type ReadingFontSize = 'normal' | 'large' | 'xlarge' | 'jumbo';

const SIZES: ReadingFontSize[] = ['normal', 'large', 'xlarge', 'jumbo'];

interface FontSizeControlProps {
  size: ReadingFontSize;
  onChangeSize: (size: ReadingFontSize) => void;
  compact?: boolean;
}

export function FontSizeControl({
  size,
  onChangeSize,
  compact = false,
}: FontSizeControlProps) {
  const currentIndex = SIZES.indexOf(size);
  const canDecrease = currentIndex > 0;
  const canIncrease = currentIndex < SIZES.length - 1;

  const handleDecrease = () => {
    if (!canDecrease) return;
    Haptics.selectionAsync().catch(() => {});
    onChangeSize(SIZES[currentIndex - 1]);
  };

  const handleIncrease = () => {
    if (!canIncrease) return;
    Haptics.selectionAsync().catch(() => {});
    onChangeSize(SIZES[currentIndex + 1]);
  };

  const displayTier =
    size === 'normal'
      ? 'A'
      : size === 'large'
        ? 'A+'
        : size === 'xlarge'
          ? 'A++'
          : 'A+++';

  return (
    <View style={[styles.container, compact && styles.containerCompact]}>
      {/* Decrease Button (A-) */}
      <Pressable
        style={[
          styles.btn,
          !canDecrease && styles.btnDisabled,
        ]}
        onPress={handleDecrease}
        disabled={!canDecrease}
        accessibilityRole="button"
        accessibilityLabel="Decrease font size"
        hitSlop={6}
      >
        <Text style={[styles.btnText, !canDecrease && styles.btnTextDisabled]}>
          A−
        </Text>
      </Pressable>

      {/* Current Size Indicator */}
      <View style={styles.indicatorPill}>
        <Text style={styles.indicatorText}>{displayTier}</Text>
      </View>

      {/* Increase Button (A+) */}
      <Pressable
        style={[
          styles.btn,
          !canIncrease && styles.btnDisabled,
        ]}
        onPress={handleIncrease}
        disabled={!canIncrease}
        accessibilityRole="button"
        accessibilityLabel="Increase font size"
        hitSlop={6}
      >
        <Text style={[styles.btnText, !canIncrease && styles.btnTextDisabled]}>
          A+
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    borderColor: 'rgba(212, 175, 55, 0.4)',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 4,
    paddingVertical: 2,
    gap: 2,
  },
  containerCompact: {
    paddingHorizontal: 2,
    paddingVertical: 1,
  },
  btn: {
    width: 28,
    height: 24,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  btnDisabled: {
    opacity: 0.3,
  },
  btnText: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: '800',
  },
  btnTextDisabled: {
    color: colors.textMuted,
  },
  indicatorPill: {
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorText: {
    color: colors.ivoryWarm,
    fontSize: 11,
    fontWeight: '700',
  },
});
