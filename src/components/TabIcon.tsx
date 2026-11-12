import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

export type IconName = 'Home' | 'Pradakshina' | 'Japa' | 'History' | 'Settings';

interface TabIconProps {
  name: IconName;
  color: string;
  size?: number;
}

export function TabIcon({ name, color, size = 24 }: TabIconProps) {
  switch (name) {
    case 'Home':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M3 10.5L12 3l9 7.5V20a1.5 1.5 0 0 1-1.5 1.5H15v-6H9v6H4.5A1.5 1.5 0 0 1 3 20v-9.5Z"
            stroke={color}
            strokeWidth={1.9}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    case 'Pradakshina':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M20 12a8 8 0 1 1-2.34-5.66L20 8.5"
            stroke={color}
            strokeWidth={1.9}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M20 4v4.5h-4.5"
            stroke={color}
            strokeWidth={1.9}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    case 'Japa':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="4" r="1.8" fill={color} />
          <Circle cx="17.6" cy="6.3" r="1.4" fill={color} />
          <Circle cx="20" cy="12" r="1.4" fill={color} />
          <Circle cx="17.6" cy="17.7" r="1.4" fill={color} />
          <Circle cx="12" cy="20" r="1.4" fill={color} />
          <Circle cx="6.4" cy="17.7" r="1.4" fill={color} />
          <Circle cx="4" cy="12" r="1.4" fill={color} />
          <Circle cx="6.4" cy="6.3" r="1.4" fill={color} />
          <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={1.7} />
        </Svg>
      );

    case 'History':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="12" r="8.5" stroke={color} strokeWidth={1.9} />
          <Path
            d="M12 7.5V12l3 2"
            stroke={color}
            strokeWidth={1.9}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );

    case 'Settings':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={1.9} />
          <Path
            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.08a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.08a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
            stroke={color}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
  }
}

export function BackChevron({ color, size = 22 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 18l-6-6 6-6"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
