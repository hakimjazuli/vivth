// @ts-check

import { $ } from '../class/$.mjs';

/**
 * @param {()=>void} effect
 * @returns {$}
 */
export const New$ = (effect) => new $(effect);
