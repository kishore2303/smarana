import type { ViewStyle } from 'react-native';
import { colors } from '../theme/colors';

export function getTabBarStyle(insetsBottom: number): ViewStyle {
  const bottomInset = Math.max(insetsBottom, 10);
  return {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    height: 60 + bottomInset,
    paddingBottom: bottomInset,
    paddingTop: 8,
  };
}
