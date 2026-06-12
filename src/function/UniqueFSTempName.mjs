// @ts-check

import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';

import { Paths } from '../class/Paths.mjs';
import { GetMaxFilenameLength } from './GetMaxFilenameLength.mjs';

/**
 * @description
 * - generate unique full path name to temp directory + 'vivth/${uniqueName}.tmp';
 * - filename length already calibrated for each os;
 * @param {string} path
 * @param {string} [fileExtention]
 * @returns {string}
 */
export function UniqueFSTempName(path, fileExtention = '.tmp') {
	if (!fileExtention.startsWith('.')) {
		fileExtention = `.${fileExtention}`;
	}
	if (fileExtention !== '.tmp') {
		fileExtention = `.tmp${fileExtention}`;
	}
	const hash = createHash('sha256').update(Paths.normalize(path)).digest('hex');
	let tempPath = Paths.normalize(join(tmpdir(), 'vivth', `${hash}`));
	const maxlen = GetMaxFilenameLength() - fileExtention.length;
	if (maxlen < tempPath.length) {
		tempPath = tempPath.slice(0, maxlen);
	}
	tempPath = `${tempPath}${fileExtention}`;
	return tempPath;
}
