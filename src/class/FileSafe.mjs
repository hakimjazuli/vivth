// @ts-check
import { writeFile, mkdir, copyFile, rename, rm } from 'node:fs/promises';
import { dirname } from 'node:path';

import { TryAsync } from '../function/TryAsync.mjs';

/**
 * @description
 * - collection of static methods of file access with added safety to mkdir before proceeding;
 */
export class FileSafe {
	/**
	 * @description
	 * - method to create file safely by recursively mkdir the dirname of the outFile;
	 * - also returning promise of result & error as value;
	 * @param {Parameters<writeFile>[0]} outFile
	 * @param {Parameters<writeFile>[1]} content
	 * @param {Parameters<writeFile>[2]} [options]
	 * @returns {ReturnType<typeof TryAsync<void>>}
	 * @example
	 * import { join } from 'node:path';
	 * import { FileSafe, Paths } from 'vivth';
	 *
	 * const [, errorWrite] = await FileSafe.write(
	 * 	join(Paths.root, '/some/path.mjs'),
	 * 	`console.log("hello-world!!");`,
	 * 	{ encoding: 'utf-8' }
	 * );
	 */
	static write = async (outFile, content, options) => {
		return await TryAsync(async () => {
			const [, errorMkDir] = await FileSafe.mkdir(dirname(outFile.toString()));
			if (errorMkDir) {
				throw new Error(`error mkdir, "${dirname(outFile.toString())}"`);
			}
			return writeFile(outFile, content, options);
		});
	};
	/**
	 * @description
	 * - method to copy file/dir safely by recursively mkdir the dirname of the dest;
	 * - also returning promise of result & error as value;
	 * @param {Parameters<typeof copyFile>[0]} sourceFile
	 * @param {Parameters<typeof copyFile>[1]} destinationFile
	 * @param {Parameters<typeof copyFile>[2]} mode
	 * @returns {ReturnType<typeof TryAsync<void>>}
	 * @example
	 * import { join } from 'node:path';
	 * import { FileSafe, Paths } from 'vivth';
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
				throw new Error(`error mkdir, "${dirname(dest_)}"`);
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
	 * import { FileSafe, Paths } from 'vivth';
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
				throw new Error(`error mkdir, "${dirname(dest_)}"`);
			}
			return await rename(oldPath, newPath);
		});
	};
	/**
	 * @description
	 * - function to remove dir and file;
	 * - also returning promise of result & error as value;
	 * @param {Parameters<rm>[0]} path
	 * @param {Parameters<rm>[1]} [rmOptions]
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
	 * @param {Parameters<mkdir>[0]} outDir
	 * - absolute path
	 * @returns {ReturnType<typeof TryAsync<string>>}
	 * @example
	 * import { join } from 'node:path';
	 * import { FileSafe, Paths } from 'vivth';
	 *
	 * const [str, errorMkDir] = await FileSafe.mkdir(join(Paths.root, '/some/path/example'));
	 */
	static mkdir = async (outDir) => {
		return await TryAsync(async () => {
			return await mkdir(outDir, { recursive: true });
		});
	};
}
