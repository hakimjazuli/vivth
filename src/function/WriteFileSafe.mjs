// @ts-check

import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';

import { TryAsync } from './TryAsync.mjs';
import { Paths } from '../class/Paths.mjs';

/**
 * @description
 * - function to create file by recursively mkdir the dirname of the outFile;
 * - also returing promise of result & error as value;
 * @param {string} outFile
 * @param {string} content
 * @param {import('node:fs').WriteFileOptions} options
 * @returns {Promise<ReturnType<typeof TryAsync<void>>>}
 * @example
 * import { WriteFileSafe } from 'vivth';
 *
 * const [_, writeError] = await TryAsync(async () => {
 * 	return await WriteFileSafe(
 * 		'/some/path.mjs',
 * 		'console.log("hello-world!!");',
 * 		{ encoding: 'utf-8' }
 * 	);
 * });
 */
export const WriteFileSafe = async (outFile, content, options) => {
	return await TryAsync(async () => {
		const rootPath = Paths.normalize(Paths.root);
		if (!Paths.normalize(outFile).startsWith(rootPath)) {
			outFile = join(rootPath, outFile);
		}
		await mkdir(dirname(outFile), { recursive: true });
		return writeFile(outFile, content, options);
	});
};
