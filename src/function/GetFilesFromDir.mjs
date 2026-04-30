// @ts-check

import { join } from 'node:path';
import { readdir } from 'node:fs/promises';

import { TryAsync } from './TryAsync.mjs';
import { Console } from '../class/Console.mjs';
import { Paths } from '../class/Paths.mjs';

/**
 * @description
 * - helper function to get file from dir;
 * @param {string} dirAbsolutePath
 * @param {RegExp} pathRule
 * @param {Set<string>} [fileNames]
 * - fill manually to imediately add result to existing `Set` without expecting return;
 * @returns {Promise<Set<string>>}
 * @example
 * import { GetFilesFromDir } from "vivth";
 *
 * const files = await GetFilesFromDir(join(Paths.root, '/dev/'), /[\s\S]\*[noblank]/); // without \[noblank]
 */
export async function GetFilesFromDir(dirAbsolutePath, pathRule, fileNames = new Set()) {
	const [entries, errorReadDir] = await TryAsync(async () => {
		return await readdir(dirAbsolutePath, { withFileTypes: true });
	});
	if (
		/**  */
		errorReadDir
	) {
		Console.error({ errorReadDir });
		return fileNames;
	}
	await Promise.all(
		entries.map(async (entry) => {
			const fullPath = join(dirAbsolutePath, entry.name);
			if (
				/**  */
				!pathRule.test(fullPath)
			) {
				return;
			}
			if (
				/**  */
				entry.isFile()
			) {
				fileNames.add(Paths.normalize(fullPath));
				return;
			}
			if (
				/**  */
				!entry.isDirectory()
			) {
				return;
			}
			await GetFilesFromDir(fullPath, pathRule, fileNames);
		}),
	);
	return fileNames;
}
