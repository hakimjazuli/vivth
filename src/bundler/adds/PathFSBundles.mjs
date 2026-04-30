// @ts-check

import { join, dirname, relative } from 'node:path';

import { Paths } from '../../class/Paths.mjs';
import { TracePath } from '../../common/TracePath.mjs';

/**
 * @description
 * - when used with `EsBundler+ToBundledJSPlugin` the file on the dir that are match the rule are `Bundled` first before being put on the `.asar`;
 */
export class PathFSBundles {
	/**
	 * @description
	 * @param {string} relativePath
	 * - to the dirname of the file you are calling this method;
	 * @param {{shouldNotInlcudes:string}} [options]
	 * - `shouldNotInlcudes`:
	 * >- when this method receive non immediate string(declared on other file),
	 * >- `shouldNotInlcudes` should be filled with the string like,
	 * >- `/${libname}/path/to/file/this/method/is/being/called.extname`;
	 * @returns {PathFSBundles}
	 * @example
	 * import { PathFSBundles } from 'vivth';
	 *
	 * PathFSBundles.vivthBundles('../src/entryPoint.mjs');
	 */
	static vivthBundles = (relativePath, options) => {
		return new PathFSBundles(relativePath, options);
	};
	/**
	 * @private
	 * @param {Parameters<typeof PathFSBundles["vivthBundles"]>[0]} relativePath
	 * @param {Parameters<typeof PathFSBundles["vivthBundles"]>[1]} [options]
	 */
	constructor(relativePath, options) {
		const shouldNotIncludes = new Set([
			'/vivth/src/common/TracePath.mjs',
			'/vivth/src/bundler/adds/PathFSBundles.mjs',
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
