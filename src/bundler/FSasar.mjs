// @ts-check

import { dirname, join, relative } from 'node:path';
import { readFile } from 'node:fs/promises';

import { Paths } from '../class/Paths.mjs';
import { TryAsync } from '../function/TryAsync.mjs';
import { Console } from '../class/Console.mjs';
import { emptyBufferValue } from './adds/emptyBufferValue.mjs';
import { GetFilesFromDir } from '../function/GetFilesFromDir.mjs';
import { ForOfSync } from '../function/ForOfSync.mjs';
import { PipeSync } from '../function/PipeSync.mjs';
import { PathFSFile } from './adds/PathFSFile.mjs';

/**
 * @description
 * - class helper to bundle assets files as `.asar`;
 * >- as `type: "buffer"`;
 * >- uses `[at]electron/asar` under the hood;
 * - use only if you are planning to use [CompileJS](#compilejs);
 * >- the class static methods don't obfuscate target file;
 * >- don't embed any sensitive content using this methods of `CompileJS`;
 */
export class FSasar {
	/**
	 * @typedef {import('./adds/PathFSDir.mjs').PathFSDir} PathFSDir
	 */
	/**
	 * @description
	 * - get file buffer from relative path;
	 * @param {PathFSFile} pathFSFPathFSFileInstance
	 * @returns {Promise<Buffer<ArrayBufferLike>>}
	 * @example
	 * import { FSasar, PathFSFile } from "vivth";
	 *
	 * const fileBuffer = await FSasar.file(PathFSFile.vivthFile('../function/myModule.mjs'));
	 */
	static async file(pathFSFPathFSFileInstance) {
		const [buffer, errorFileNotFound] = await TryAsync(async () => {
			const buf = await readFile(join(Paths.root, pathFSFPathFSFileInstance.path));
			return Buffer.from(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
		});
		if (
			/**  */
			errorFileNotFound
		) {
			Console.error({ errorFileNotFound });
			return emptyBufferValue();
		}
		return buffer;
	}
	/**
	 * @description
	 * - helper function for asar dir;
	 * @param {PathFSDir} pathFSDirInstance
	 * @returns {{
	 * forEachFiles:(loopCallback:(pathDetail:{inputRelative:string, asar:string})=>void)=>void,
	 * getFile:(relativeFromDir:string)=> ReturnType<typeof FSasar["file"]>
	 * }}
	 * - forEachFiles are looped async without awaiting any iterations;
	 * @example
	 * import { FSasar, PathFSDir } from "vivth";
	 *
	 * const { forEachFiles, getFile } = FSasar.dir(PathFSDir.vivthDir('../function/', /[\s\S]\*[noblank]/)); // without `[noblank]`;
	 * forEachFiles(async ({ inputRelative, asar }) => {
	 * 	// handle `inputRelative` with getFile; OR
	 * 	// handle `asar` with FSasar.file
	 * });
	 */
	static dir = (pathFSDirInstance) => {
		return {
			forEachFiles: (loopCallback) => {
				const relativeTo = join(Paths.root, pathFSDirInstance.path);
				GetFilesFromDir(relativeTo, pathFSDirInstance.rule, new Set()).then((filePaths) => {
					ForOfSync(filePaths, (filePath) => {
						loopCallback({
							inputRelative: Paths.normalize(relative(relativeTo, filePath)),
							asar: Paths.normalize(relative(Paths.root, filePath)),
						});
					});
				});
			},
			getFile: async (filePathRelativeFromDir) => {
				const path_ = PipeSync(
					join(pathFSDirInstance.path, filePathRelativeFromDir),
					(path_) => relative(dirname(pathFSDirInstance.callerPath), path_),
					(path_) => Paths.normalize(path_),
				);
				if (
					/**  */
					!path_.match(pathFSDirInstance.rule)
				) {
					return emptyBufferValue();
				}
				return FSasar.file(
					PathFSFile.vivthFile(path_, { shouldNotInlcudes: '/vivth/src/bundler/FSasar.mjs' }),
				);
			},
		};
	};
}
