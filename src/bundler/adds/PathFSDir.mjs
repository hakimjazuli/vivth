// @ts-check

import { join, dirname, relative } from 'node:path';

import { Paths } from '../../class/Paths.mjs';
import { TracePath } from '../../common/TracePath.mjs';

/**
 * @description
 * - includes all files, that match the rule to `.asar`;
 */
export class PathFSDir {
	/**
	 * @description
	 * @param {string} relativePath
	 * - to the dirname of the file you are calling this method;
	 * @param {RegExp} rule
	 * @param {Parameters<typeof import('./PathFSBundles.mjs').PathFSBundles["vivthBundles"]>[1]} [options]
	 * @returns {PathFSDir}
	 * @example
	 * import { PathFSDir } from 'vivth';
	 *
	 * PathFSDir.vivthDir('../src/', /[\s\S]\*[noblank]/);
	 * // without `[noblank]`;
	 */
	static vivthDir = (relativePath, rule, options = undefined) => {
		return new PathFSDir(relativePath, options, rule);
	};
	/**
	 * @private
	 * @param {Parameters<typeof PathFSDir["vivthDir"]>[0]} relativePath
	 * @param {Parameters<typeof PathFSDir["vivthDir"]>[2]} [options]
	 * @param {Parameters<typeof PathFSDir["vivthDir"]>[1]} [rule]
	 */
	constructor(relativePath, options, rule = /[\s\S]*/) {
		this.#rule = rule;
		const shouldNotIncludes = new Set([
			'/vivth/src/common/TracePath.mjs',
			'/vivth/src/bundler/adds/PathFSDir.mjs',
		]);
		if (
			/**  */
			options
		) {
			let { shouldNotInlcudes: traceShouldNotIncludes_ } = options;
			traceShouldNotIncludes_ = traceShouldNotIncludes_.trim();
			if (
				/**  */
				traceShouldNotIncludes_
			) {
				shouldNotIncludes.add(traceShouldNotIncludes_);
			}
		}
		this.#callerPath =
			TracePath((filePath) => {
				for (const shouldNotInclude_ of shouldNotIncludes) {
					if (
						/**  */
						!filePath.includes(shouldNotInclude_)
					) {
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
	 * @type {RegExp}
	 */
	#rule;
	/**
	 * @description
	 * - rule for dir, to get file any file match the rule inside that directory;
	 * @type {RegExp}
	 */
	get rule() {
		return this.#rule;
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
