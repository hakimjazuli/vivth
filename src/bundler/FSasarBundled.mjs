// @ts-check

import { join, relative } from 'node:path';

import { extractFile, getRawHeader } from '@electron/asar';

import { TrySync } from '../function/TrySync.mjs';
import { Console } from '../class/Console.mjs';
import { emptyBufferValue } from './adds/emptyBufferValue.mjs';
import { asarPath } from './adds/asarPath.mjs';
import { PathFSFile } from './adds/PathFSFile.mjs';
import { ASARFilePathConverter } from './adds/ASARFilePathConverter.mjs';
import { Paths } from '../class/Paths.mjs';
import { PipeSync } from '../function/PipeSync.mjs';

export class FSasar {
	/**
	 * @typedef {import('./adds/PathFSDir.mjs').PathFSDir} PathFSDir
	 */
	/**
	 * @param {PathFSFile} filePathFromProject
	 * @returns {Promise<undefined|Buffer<ArrayBufferLike>>}
	 */
	static file = async (filePathFromProject) => {
		const archievePath_ = asarPath();
		const [buffer, errorFileNotFound] = TrySync(() => {
			return extractFile(archievePath_, ASARFilePathConverter(filePathFromProject.path), true);
		});
		if (
			/**  */
			errorFileNotFound
		) {
			Console.error({ archievePath: archievePath_, errorFileNotFound });
			return emptyBufferValue();
		}
		return buffer;
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
						if (
							/**  */
							!Object.hasOwn(headerRef, name)
						) {
							continue;
						}
						const val = headerRef[name];
						if (
							/**  */
							!val
						) {
							continue;
						}
						if (
							/**  */
							'files' in val
						) {
							check(val.files, join(relativePath, name));
							continue;
						}
						if (
							/**  */
							'size' in val
						) {
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
					if (
						/**  */
						!val ||
						!files[val] ||
						!('files' in files[val])
					) {
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
				if (
					/**  */
					!path_.match(pathFSDirInstance.rule)
				) {
					return emptyBufferValue();
				}
				return FSasar.file(PathFSFile.vivthFile(path_));
			},
		};
	};
}
