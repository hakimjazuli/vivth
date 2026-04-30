// @ts-check

import { sep } from 'node:path';

/**
 * @description
 * - for internal uses only;
 * - `asar` uses os separator for detection, while `vivth` strictly uses forward slash;
 * @param {string} path
 */
export function ASARFilePathConverter(path) {
	return path.replace(/\//g, sep);
}
