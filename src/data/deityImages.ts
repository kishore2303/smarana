import type { ImageSourcePropType } from 'react-native';

export const DEITY_IMAGES: Record<string, ImageSourcePropType> = {
  'builtin-ashtothram-ganesha': require('../../assets/deities/ganesha.jpg'),
  'builtin-ashtothram-shiva': require('../../assets/deities/shiva.jpg'),
  'builtin-ashtothram-venkateswara': require('../../assets/deities/venkateswara.jpg'),
  'builtin-ashtothram-lakshmi': require('../../assets/deities/lakshmi.jpg'),
  'builtin-ashtothram-hanuman': require('../../assets/deities/hanuman.jpg'),
  'builtin-ashtothram-krishna': require('../../assets/deities/krishna.jpg'),
  'builtin-ashtothram-rama': require('../../assets/deities/rama.jpg'),
  'builtin-ashtothram-durga': require('../../assets/deities/durga.jpg'),
};

export function getDeityImage(id: string): ImageSourcePropType | null {
  return DEITY_IMAGES[id] ?? null;
}
