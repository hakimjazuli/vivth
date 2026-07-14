// @ts-check

import { writeFile, mkdir, copyFile, rename, rm, readFile, stat } from 'node:fs/promises';
import { dirname } from 'node:path';

import { TryAsync } from '../function/TryAsync.mjs';
import { Console } from './Console.mjs';

/**
 * @description
 * - collection of static methods of file access with added safety to mkdir before proceeding;
 */
export class FileSafe {
	/**
	 * @description
	 * - method to safely detects whether filePaths exist;
	 * - uses `'node:fs/promises'.access` under the hood;
	 * - also returning promise of result & error as value;
	 * @param {string} filePath
	 * @returns {Promise<boolean>}
	 * @example
	 * import { join } from 'node:path';
	 * import { FileSafe } from 'vivth/node';
	 * import { Paths } from 'vivth/neutral';
	 *
	 * const isExist = await FileSafe.exist(
	 * 	join(Paths.root, '/some/path.mjs'),
	 * );
	 */
	static exist = async (filePath) => {
		const [, error] = await TryAsync(async () => {
			const stats = await stat(filePath);
			// Optional: verification that it is a file, not a directory
			return stats.isFile() || stats.isDirectory();
		});
		return !error;
	};
	/**
	 * @param { Parameters<typeof writeFile>[1] } string
	 * @returns { string }
	 */
	static #normalize = (string) => {
		return string.toString().replace(/\s+/, ' ');
	};
	/**
	 * @param {Parameters<typeof FileSafe.write>[0]} outFile
	 * @param {Parameters<typeof FileSafe.write>[1]} content
	 * @param {Parameters<typeof FileSafe.write>[2]} [options]
	 * @param {Parameters<typeof FileSafe.write>[3]} [checkFuzySame]
	 * @returns {Promise<boolean>}
	 */
	static #validToOverWrite = async (outFile, content, options, checkFuzySame = true) => {
		const [isExist, [isSame]] = await Promise.all([
			FileSafe.exist(outFile.toString()),
			TryAsync(async () => {
				if (!checkFuzySame) {
					// code
					return (await readFile(outFile.toString(), options)) === content;
				}
				return (
					FileSafe.#normalize(await readFile(outFile.toString(), options)) ===
					FileSafe.#normalize(content)
				);
			}),
		]);
		if (isExist && isSame) {
			return false;
		}
		return true;
	};
	/**
	 * @description
	 * - method to create file safely by recursively mkdir the dirname of the outFile;
	 * - also returning promise of result & error as value;
	 * @param {Parameters<typeof writeFile>[0]} outFile
	 * @param {Parameters<typeof writeFile>[1]} content
	 * @param {Parameters<typeof writeFile>[2]} [options]
	 * @param {boolean} [checkFuzySame]
	 * - true: check while normalize consecutive whitespace into singel white space;
	 * - false(default): check absolute value;
	 * @returns {ReturnType<typeof TryAsync<void>>}
	 * @example
	 * import { join } from 'node:path';
	 * import { FileSafe } from 'vivth/node';
	 * import { Paths } from 'vivth/neutral';
	 *
	 * const [, errorWrite] = await FileSafe.write(
	 * 	join(Paths.root, '/some/path.mjs'),
	 * 	`console.log("hello-world!!");`,
	 * 	{ encoding: 'utf-8' }
	 * );
	 */
	static write = async (outFile, content, options, checkFuzySame = true) => {
		return await TryAsync(async () => {
			const [, errorMkDir] = await FileSafe.mkdir(dirname(outFile.toString()));
			if (errorMkDir) {
				throw `error mkdir, "${dirname(outFile.toString())}"`;
			}
			if (!(await FileSafe.#validToOverWrite(outFile, content, options, checkFuzySame))) {
				Console.warn(
					{
						[FileSafe.name]: `write file '${outFile}' is canceled, old file are ${checkFuzySame ? 'almost ' : ''}identical`,
					},
					{
						now: true,
					},
				);
				return;
			}
			return await writeFile(outFile, content, options);
		});
	};
	/**
	 * @description
	 * - method to copy file/dir safely by recursively mkdir the dirname of the dest;
	 * - also returning promise of result & error as value;
	 * @param {Parameters<typeof copyFile>[0]} sourceFile
	 * @param {Parameters<typeof copyFile>[1]} destinationFile
	 * @param {Parameters<typeof copyFile>[2]} [mode]
	 * @returns {ReturnType<typeof TryAsync<void>>}
	 * @example
	 * import { join } from 'node:path';
	 * import { FileSafe } from 'vivth/node';
	 * import { Paths } from 'vivth/neutral';
	 *
	 * const [, errorWrite] = await FileSafe.copy(
	 * 	join(Paths.root, '/some/path.mjs'),
	 * 	join(Paths.root, '/other/path.copy.mjs'),
	 * 	{ encoding: 'utf-8' }
	 * );
	 */
	static copy = async (sourceFile, destinationFile, mode) => {
		return await TryAsync(async () => {
			const dest_ = destinationFile.toString();
			const [, errorMkDir] = await FileSafe.mkdir(dirname(dest_));
			if (errorMkDir) {
				throw `error mkdir, "${dirname(dest_)}"`;
			}
			return await copyFile(sourceFile, destinationFile, mode);
		});
	};
	/**
	 * @description
	 * - method to rename file/dir safely by recursively mkdir the dirname of the dest;
	 * - also returning promise of result & error as value;
	 * @param {Parameters<typeof rename>[0]} oldPath
	 * @param {Parameters<typeof rename>[0]} newPath
	 * @returns {ReturnType<typeof TryAsync<void>>}
	 * @example
	 * import { join } from 'node:path';
	 * import { FileSafe} from 'vivth/node';
	 * import { Paths } from 'vivth/neutral';
	 *
	 * const [, errorRename] = await FileSafe.rename(
	 * 	join(Paths.root, 'some/path'),
	 * 	join(Paths.root, 'other/path'),
	 * );
	 */
	static rename = async (oldPath, newPath) => {
		return await TryAsync(async () => {
			const dest_ = newPath.toString();
			const [, errorMkDir] = await FileSafe.mkdir(dirname(dest_));
			if (errorMkDir) {
				throw `error mkdir, "${dirname(dest_)}"`;
			}
			return await rename(oldPath, newPath);
		});
	};
	/**
	 * @description
	 * - function to remove dir and file;
	 * - also returning promise of result & error as value;
	 * @param {Parameters<typeof rm>[0]} path
	 * @param {Parameters<typeof rm>[1]} [rmOptions]
	 * @returns {ReturnType<typeof TryAsync<void>>}
	 */
	static rm = async (path, rmOptions) => {
		return await TryAsync(async () => {
			return await rm(path, rmOptions);
		});
	};
	/**
	 * @description
	 * - create directory recursively;
	 * - also returning promise of result & error as value;
	 * @param {Parameters<typeof mkdir>[0]} outDir
	 * - absolute path
	 * @returns {ReturnType<typeof TryAsync<string|undefined>>}
	 * @example
	 * import { join } from 'node:path';
	 * import { FileSafe } from 'vivth/node';
	 * import { Paths } from 'vivth/neutral';
	 *
	 * const [str, errorMkDir] = await FileSafe.mkdir(join(Paths.root, '/some/path/example'));
	 */
	static mkdir = async (outDir) => {
		return await TryAsync(async () => {
			return await mkdir(outDir, { recursive: true });
		});
	};
}
