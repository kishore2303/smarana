import type { MantraEntry } from '../../types/practice';

import { GANESHA_ASHTOTHRAM } from './ganesha';
import { SHIVA_ASHTOTHRAM } from './shiva';
import { VENKATESWARA_ASHTOTHRAM } from './venkateswara';
import { LAKSHMI_ASHTOTHRAM } from './lakshmi';
import { HANUMAN_ASHTOTHRAM } from './hanuman';
import { KRISHNA_ASHTOTHRAM } from './krishna';
import { RAMA_ASHTOTHRAM } from './rama';
import { DURGA_ASHTOTHRAM } from './durga';

export const ALL_ASHTOTHRAMS: Omit<MantraEntry, 'isFavorite'>[] = [
  GANESHA_ASHTOTHRAM,
  SHIVA_ASHTOTHRAM,
  VENKATESWARA_ASHTOTHRAM,
  LAKSHMI_ASHTOTHRAM,
  HANUMAN_ASHTOTHRAM,
  KRISHNA_ASHTOTHRAM,
  RAMA_ASHTOTHRAM,
  DURGA_ASHTOTHRAM,
];

export { GANESHA_ASHTOTHRAM } from './ganesha';
export { SHIVA_ASHTOTHRAM } from './shiva';
export { VENKATESWARA_ASHTOTHRAM } from './venkateswara';
export { LAKSHMI_ASHTOTHRAM } from './lakshmi';
export { HANUMAN_ASHTOTHRAM } from './hanuman';
export { KRISHNA_ASHTOTHRAM } from './krishna';
export { RAMA_ASHTOTHRAM } from './rama';
export { DURGA_ASHTOTHRAM } from './durga';