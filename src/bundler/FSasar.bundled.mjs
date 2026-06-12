// @ts-check

import { extname, join, relative } from 'node:path';

import { extractFile, getRawHeader } from '@electron/asar';

import { TrySync } from '../function/TrySync.mjs';
import { Console } from '../class/Console.mjs';
import { emptyBufferValue } from './adds/emptyBufferValue.mjs';
import { PathFSFile } from './adds/PathFSFile.mjs';
import { Paths } from '../class/Paths.mjs';
import { PipeSync } from '../function/PipeSync.mjs';
import { argv0 } from 'node:process';
import { fileURLToPath } from 'node:url';

// @ts-check

/**
 * @type {undefined|string}
 */
let archievePath_ = undefined;

const asarPath = () => {
	if (!archievePath_) {
		const thisPath = fileURLToPath(import.meta.url);
		const check0 = argv0.replace(new RegExp(`${extname(argv0)}\$`, ''), '.asar/');
		const check1 = thisPath.replace(new RegExp(`${extname(thisPath)}\$`, ''), '.asar/');
		if (check0.startsWith(Paths.root)) {
			archievePath_ = check0;
		} else {
			/**
			 * ```js
			 * else if (check1.startsWith(root)) {
			 * 	archievePath_ = check1;
			 * }
			 * ```
			 */
			archievePath_ = check1;
		}
	}
	return Paths.normalize(archievePath_);
};

export class FSasar {
	/**
	 * @typedef {import('./adds/PathFSDir.mjs').PathFSDir} PathFSDir
	 */
	/**
	 * @param {PathFSFile} filePathFromProject
	 * @returns {Promise<undefined|Buffer<ArrayBufferLike>>}
	 */
	static file = async (filePathFromProject) => {
		const [buffer, errorFileNotFound] = TrySync(() => {
			const archievePath = asarPath();
			return extractFile(archievePath, Paths.nativeSep(filePathFromProject.path), true);
		});
		if (!errorFileNotFound) {
			return buffer;
		}
		Console.error(
			{ filePathFromProject: filePathFromProject.path, errorFileNotFound },
			{ now: true },
		);
		return emptyBufferValue();
	};
	/**
	 * @description
	 * - helper function for asar dir;
	 * @param {PathFSDir} pathFSDirInstance
	 * @returns {{
	 * forEachFiles:(loopCallback:(pathDetail:{inputRelative:string, asar:string})=>void)=>void,
	 * getFile:(relativeFromDir:string)=> ReturnType<typeof FSasar["file"]>
	 * }}
	 * - forEachFiles are looped async without awaiting any iterations;
	 */
	static dir = (pathFSDirInstance) => {
		return {
			forEachFiles: (loopCallback) => {
				/**
				 * @param {Record<string, import('@electron/asar').DirectoryRecord | import('@electron/asar').FileRecord>} headerRef
				 * @param {string} relativePath
				 */
				const check = (headerRef, relativePath = './') => {
					for (const name in headerRef) {
						if (!Object.hasOwn(headerRef, name)) {
							continue;
						}
						const val = headerRef[name];
						if (!val) {
							continue;
						}
						if ('files' in val) {
							check(val.files, join(relativePath, name));
							continue;
						}
						if ('size' in val) {
							const filePath = Paths.normalize(join(relativePath, name));
							loopCallback({
								asar: filePath,
								inputRelative: Paths.normalize(relative(pathFSDirInstance.path, filePath)),
							});
						}
					}
				};
				let files = getRawHeader(asarPath()).header.files;
				const pathFSDirInstance_ = pathFSDirInstance.path.split('/');
				for (let i = 0; i < pathFSDirInstance_.length; i++) {
					const val = pathFSDirInstance_[i];
					if (!val || !files[val] || !('files' in files[val])) {
						continue;
					}
					files = files[val].files;
				}
				check(files, pathFSDirInstance.path);
			},
			getFile: async (filePathRelativeFromDir) => {
				const path_ = PipeSync(
					Paths.normalize(join(pathFSDirInstance.path, filePathRelativeFromDir)),
					(path_) => Paths.normalize(relative(Paths.root, path_)),
				);
				if (!path_.match(pathFSDirInstance.rule)) {
					return emptyBufferValue();
				}
				return FSasar.file(PathFSFile.vivthFile(path_));
			},
		};
	};
}
