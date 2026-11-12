import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { BackChevron } from './TabIcon';
import { colors } from '../theme/colors';

interface HeaderBackButtonProps {
  onPress: () => void;
  accessibilityLabel: string;
}

export function HeaderBackButton({
  onPress,
  accessibilityLabel,
}: HeaderBackButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.backButton,
        pressed && styles.backButtonPressed,
      ]}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <BackChevron color={colors.goldSoft} size={22} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backButton: {
    marginLeft: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonPressed: {
    backgroundColor: colors.surfaceAlt,
  },
});
