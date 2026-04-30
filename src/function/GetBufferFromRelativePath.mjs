// @ts-check

import { FSasar } from '../bundler/FSasar.mjs';
import { PathFSFile } from '../bundler/adds/PathFSFile.mjs';

/**
 * @description
 * - get content from relativePath;
 * - only usefull to unbundled environtment;
 * - if your goal is to include on the `.asar`, use [FSasar](#fsasar) instead;
 * @param {string} relativePath
 * - relative path from the caller;
 * @returns {ReturnType<typeof FSasar.file>}
 * @example
 * import { GetContentFromRelativePath } from "vivth";
 *
 * await GetContentFromRelativePath('../doc/parsedFile.mjs', 'utf-8');
 */
export async function GetBufferFromRelativePath(relativePath) {
	return await FSasar.file(
		PathFSFile.vivthFile(relativePath, {
			shouldNotInlcudes: '/vivth/src/function/GetContentFromRelativePath.mjs',
		})
	);
}
