// @ts-check

import { join } from 'node:path';

import { Paths } from '../class/Paths.mjs';

/**
 * @description
 * @param {string[]} paths
 * @returns {string}
 */
export function JoinPathsThenNormalize(...paths) {
	return Paths.normalize(join(...paths));
};
