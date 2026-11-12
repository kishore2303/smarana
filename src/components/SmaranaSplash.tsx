import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { palette } from '../theme/tokens';
import { SmaranaLogo } from './SmaranaLogo';

/**
 * Fast-loading branded splash overlay showing the Smarana logo,
 * wordmark, and tagline before fading smoothly into Home.
 */
export function SmaranaSplash() {
  const [visible, setVisible] = useState(true);
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 320,
        useNativeDriver: true,
      }).start(() => {
        setVisible(false);
      });
    }, 950);

    return () => clearTimeout(timer);
  }, [opacity]);

  if (!visible) {
    return null;
  }

  return (
    <Animated.View style={[styles.overlay, { opacity }]} pointerEvents="none">
      <SmaranaLogo variant="splash" size={128} showSanskrit />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: palette.forestDeep,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
});
