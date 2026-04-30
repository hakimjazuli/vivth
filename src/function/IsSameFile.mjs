// @ts-check

import { normalize, resolve } from 'node:path';

/**
 * @param {string} url
 * @returns {string}
 */
const stripFileUrl = (url) => {
	return url.startsWith('file://') ? url.slice(7) : url;
};

/**
 * @description
 * - check if two path is the same file;
 * @param {string} pathA
 * @param {string} pathB
 * @returns {boolean}
 */
export function IsSameFile(pathA, pathB) {
	const cleanA = resolve(normalize(stripFileUrl(pathA)));
	const cleanB = resolve(normalize(stripFileUrl(pathB)));
	return cleanA === cleanB;
};
