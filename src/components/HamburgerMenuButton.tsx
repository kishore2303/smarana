import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';

interface HamburgerMenuButtonProps {
  onPress: () => void;
  accessibilityLabel?: string;
}

export function HamburgerMenuButton({
  onPress,
  accessibilityLabel = 'Open menu',
}: HamburgerMenuButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={10}
    >
      <View style={styles.bar} />
      <View style={[styles.bar, styles.barMiddle]} />
      <View style={styles.bar} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    marginRight: 12,
  },
  buttonPressed: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.goldSoft,
  },
  bar: {
    width: 18,
    height: 2,
    backgroundColor: colors.goldSoft,
    borderRadius: 1,
  },
  barMiddle: {
    marginVertical: 4,
    width: 14,
    alignSelf: 'flex-start',
  },
});
