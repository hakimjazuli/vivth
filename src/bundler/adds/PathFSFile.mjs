// @ts-check

import { join, dirname, relative } from 'node:path';

import { Paths } from '../../class/Paths.mjs';
import { TracePath } from '../../common/TracePath.mjs';

/**
 * @description
 * >- the file are added to `asar` AS IS, OR
 * >- transformed according to the `asar.options.transform` value;
 */
export class PathFSFile {
	/**
	 * @description
	 * @param {string} relativePath
	 * - to the dirname of the file you are calling this method;
	 * @param {Parameters<typeof import('./PathFSBundles.mjs').PathFSBundles["vivthBundles"]>[1]} [options]
	 * @returns {PathFSFile}
	 * @example
	 * import { PathFSFile } from 'vivth/node';
	 *
	 * PathFSFile.vivthFile('../CompileAS.mjs');
	 */
	static vivthFile = (relativePath, options) => {
		return new PathFSFile(relativePath, options);
	};
	/**
	 * @private
	 * @param {Parameters<typeof PathFSFile["vivthFile"]>[0]} relativePath
	 * @param {Parameters<typeof PathFSFile["vivthFile"]>[1]} [options]
	 */
	constructor(relativePath, options) {
		const shouldNotIncludes = new Set([
			'/vivth/src/common/TracePath.mjs',
			'/vivth/src/bundler/adds/PathFSFile.mjs',
		]);
		if (options) {
			let { shouldNotIncludes: traceShouldNotIncludes_ } = options;
			traceShouldNotIncludes_ = traceShouldNotIncludes_.trim();
			if (traceShouldNotIncludes_) {
				shouldNotIncludes.add(traceShouldNotIncludes_);
			}
		}
		this.#callerPath =
			TracePath((filePath) => {
				for (const shouldNotInclude_ of shouldNotIncludes) {
					if (!filePath.includes(shouldNotInclude_)) {
						continue;
					}
					return false;
				}
				return true;
			}) ?? '';
		this.#path = Paths.normalize(
			relative(Paths.root, join(dirname(this.callerPath), relativePath)),
		);
	}
	/**
	 * @type {string}
	 */
	#path;
	/**
	 * @description
	 * - relative path of the target to the project root;
	 * @returns {string}
	 */
	get path() {
		return this.#path;
	}
	/**
	 * @type {string}
	 */
	#callerPath;
	/**
	 * @description
	 * - depending on whether running on bundled or not;
	 * - unBundled: absolute disk path of the file caller;
	 * - bundled: `blankstring`;
	 * @returns {string}
	 */
	get callerPath() {
		return this.#callerPath;
	}
}
