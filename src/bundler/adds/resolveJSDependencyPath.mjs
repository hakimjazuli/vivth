// @ts-check

import { extname } from 'node:path';
import { FileSafe } from '../../class/FileSafe.mjs';

/**
 * @param {string} jspath
 * @returns {Promise<boolean>}
 */
export const resolveJSDependencyPath = async (jspath) => {
	const ext = extname(jspath);
	if (ext !== '.js') {
		return false;
	}
	const isExist = await FileSafe.exist(jspath.replace(/.js$/g, '.as.ts'));
	return isExist;
};
