// @ts-check

import { resolve } from 'path-unified';
import { IsStringLooksLikeAPath } from './IsStringLooksLikeAPath.mjs';
import { Console } from '../class/Console.mjs';
import { Paths } from '../class/Paths.mjs';

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
 * @example
 * // `D://myFile.mjs` cwd at `D://`
 * import { IsSameFile } from "vivth/node";
 *
 * IsSameFile('D:\\mFile.mjs', 'D://mFile.mjs') // true;
 * IsSameFile('//mFile.mjs', 'D://mFile.mjs') // true;
 * // both path are auto resolved to Paths.root;
 * IsSameFile('D:\\mFile.mjs', 'D:\\notmfile.mjs') // false;
 */
export function IsSameFile(pathA, pathB) {
	if (!IsStringLooksLikeAPath(pathA) || !IsStringLooksLikeAPath(pathB)) {
		Console.warn(`'${pathA}' AND/OR '${pathB}' is not a valid path`);
		return false;
	}
	const cleanA = resolve(Paths.diskAbsolute(stripFileUrl(pathA)));
	const cleanB = resolve(Paths.diskAbsolute(stripFileUrl(pathB)));
	const result = cleanA === cleanB;
	// Console.log({ result, cleanA, cleanB });
	return result;
}
