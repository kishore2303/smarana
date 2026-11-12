import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SmaranaLogo } from './SmaranaLogo';
import { colors } from '../theme/colors';

interface SmaranaHeaderTitleProps {
  title: string;
  isBrand?: boolean;
}

export function SmaranaHeaderTitle({
  title,
  isBrand = false,
}: SmaranaHeaderTitleProps) {
  if (isBrand) {
    return (
      <View style={styles.brandRow} accessible accessibilityLabel="Smarana">
        <SmaranaLogo variant="symbol" size={26} />
        <Text style={styles.brandTitle}>SMARANA</Text>
      </View>
    );
  }

  return (
    <Text style={styles.screenTitle} numberOfLines={1}>
      {title}
    </Text>
  );
}

const styles = StyleSheet.create({
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  brandTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 3.5,
  },
  screenTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '600',
  },
});
