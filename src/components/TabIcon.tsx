import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

export type IconName =
  | 'Home'
  | 'Pradakshina'
  | 'Japa'
  | 'History'
  | 'Settings'
  | 'Ashtothram'
  | 'MantraLibrary'
  | 'Panchangam'
  | 'WhatsApp'
  | 'Pooja';

interface TabIconProps {
  name: IconName;
  color: string;
  size?: number;
}

export function TabIcon({ name, color, size = 24 }: TabIconProps) {
  switch (name) {
    case 'Pooja':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          {/* Sacred Diya / Lamp with divine flame */}
          <Path
            d="M12 2.5C12 2.5 9.5 6.5 9.5 9C9.5 10.38 10.62 11.5 12 11.5C13.38 11.5 14.5 10.38 14.5 9C14.5 6.5 12 2.5 12 2.5Z"
            fill={color}
          />
          <Path
            d="M4 14C4 17.5 7.5 20.5 12 20.5C16.5 20.5 20 17.5 20 14H4Z"
            stroke={color}
            strokeWidth={1.8}
            strokeLinejoin="round"
          />
          <Path
            d="M2 14H22"
            stroke={color}
            strokeWidth={1.8}
            strokeLinecap="round"
          />
          <Path
            d="M8.5 20.5L7 22H17L15.5 20.5"
            stroke={color}
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'WhatsApp':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M17.5 6.5A7.8 7.8 0 0 0 4.1 14.8L3 19.5l4.8-1.2A7.8 7.8 0 0 0 12 19.8c4.3 0 7.8-3.5 7.8-7.8 0-2.1-.8-4-2.3-5.5Z"
            stroke={color}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M15.3 14c-.3.8-1.4 1.4-2 1.5-.5.1-1.2.2-3.4-.7-2.6-1.1-4.3-3.8-4.4-4-.1-.2-1.1-1.5-1.1-2.8 0-1.4.7-2 1-2.3.2-.2.6-.3.9-.3.1 0 .2 0 .3.1.3.6.8 1.9.9 2 .1.2.1.4 0 .6-.1.2-.2.3-.4.5l-.3.3c-.1.1-.3.3-.1.6.4.7 1.1 1.6 2 2.3 1.1.9 2 1.2 2.4 1.4.2.1.4.1.6-.1.2-.2.8-1 1-1.3.2-.3.4-.3.7-.2.3.1 1.9.9 2.2 1.1.3.1.5.2.6.4.1.2.1.9-.2 1.7Z"
            fill={color}
          />
        </Svg>
      );
    case 'Ashtothram':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          {/* Symmetrical lotus flower in gold/cream vector stroke and subtle fill */}
          <Path
            d="M12 4.5 C13.5 7.5 15.5 10 18 11.5 C15.5 12.5 13.5 11.5 12 8 C10.5 11.5 8.5 12.5 6 11.5 C8.5 10 10.5 7.5 12 4.5 Z"
            fill={color}
            opacity={0.9}
          />
          <Path
            d="M12 8 C14 11 17 13.5 20.5 13.5 C17.5 15.5 14.5 14.5 12 11.5 C9.5 14.5 6.5 15.5 3.5 13.5 C7 13.5 10 11 12 8 Z"
            fill={color}
            opacity={0.65}
          />
          <Path
            d="M7 18.5 Q12 20.5 17 18.5"
            stroke={color}
            strokeWidth={1.8}
            strokeLinecap="round"
          />
        </Svg>
      );

    case 'Panchangam':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          {/* Radiant Sun & Crescent Moon sacred calendar emblem */}
          <Path
            d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8A9.006 9.006 0 0 0 12 3Z"
            stroke={color}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Circle cx="12" cy="12" r="2.5" fill={color} />
          <Path
            d="M12 1.5v2M12 20.5v2M1.5 12h2M20.5 12h2"
            stroke={color}
            strokeWidth={1.6}
            strokeLinecap="round"
          />
        </Svg>
      );

    case 'MantraLibrary':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          {/* Open scripture / book icon */}
          <Path
            d="M4 19.5 V5 A2.5 2.5 0 0 1 6.5 2.5 H20 V18 H6.5 A2.5 2.5 0 0 0 4 20.5 A2.5 2.5 0 0 1 6.5 18 H20"
            stroke={color}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M8 7 H16 M8 11 H14"
            stroke={color}
            strokeWidth={1.8}
            strokeLinecap="round"
          />
        </Svg>
      );

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
