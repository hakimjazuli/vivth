// @ts-check

import { join, normalize, sep } from 'path-unified';

/**
 * @description
 * - class helpers to define pathReference;
 * - is a singleton;
 * - most of functionality need to access `Paths.root`, if you get warning, you can instantiate `Paths` before running anything;
 */
export class Paths {
	/**
	 * @type {Paths|undefined}
	 */
	static #instance;
	/**
	 * @description
	 * @param {Object} options
	 * @param {string} options.root
	 * - browser:
	 * ```js
	 * location.origin
	 * ```
	 * - node/bun compatible:
	 * ```js
	 * import process from 'node:process';
	 * process.env.INIT_CWD ?? process.cwd()
	 * ```
	 * - other: you need to check your JSRuntime for the rootPath reference;
	 * @example
	 * import { Paths } from 'vivth/neutral';
	 *
	 * new Paths({
	 * 	// root: location.origin,
	 * 	// root: process.env.INIT_CWD ?? process.cwd(),
	 * })
	 */
	constructor({ root }) {
		if (Paths.#instance) {
			return Paths.#instance;
		}
		Paths.#instance = this;
		this.#root = root;
	}
	/**
	 * @type {string|undefined}
	 */
	#root;
	/**
	 * @description
	 * - MIGHT THROW AN ERROR;
	 * >- most `vivth` modules uses this value, so you need to instantiate Paths by all means before using them;
	 * - reference for rootPath
	 * - `Paths` needed to be instantiated via:
	 * >- `Paths` constructor;
	 * >- `Setup.paths` constructor;
	 * @type {string}
	 */
	static get root() {
		if (Paths.#instance === undefined || !Paths.#instance.#root) {
			throw {
				error: 'Paths.instance.#root is undefined',
				solutions: 'instantiate `Paths` or instantiate `Setup`',
			};
		}
		return Paths.#instance.#root;
	}
	/**
	 * @description
	 * - replace path separator to forward slash `/`;
	 * - remove repeating `./`;
	 * @param {string} path
	 * @returns {string}
	 * @example
	 * import { Paths } from 'vivth/neutral';
	 *
	 * Paths.normalize('file:\\D:\\myFile.mjs'); //  "file://D://myFile.mjs"
	 */
	static normalize = (path) => {
		return normalize(path)
			.replace(/\\/g, '/')
			.replace(/\/\.\//g, '');
	};
	/**
	 * @description
	 * - replace path separator to `sep`;
	 * @param {string} path
	 * @returns {string}
	 * @example
	 * import { Paths } from 'vivth/neutral';
	 *
	 * Paths.nativeSep('path//myFile.mjs'); //  "path\myFile.mjs" OR "path/myFile.mjs" depending on sep value;
	 */
	static nativeSep = (path) => {
		return Paths.normalize(path).replace(/\//g, sep);
	};
	/**
	 * @description
	 * - normalized then starts with forward slash `/`;
	 * @param {string} path
	 * @returns {`/${string}`}
	 * @example
	 * import { Paths } from 'vivth/neutral';
	 *
	 * Paths.normalizesForRoot('path\\myFile.mjs'); //  "/path/myFile.mjs"
	 */
	static normalizeForRoot = (path) => {
		let normalized = Paths.normalize(path);
		if (!normalized.startsWith('/')) {
			normalized = `/${normalized}`;
		}
		// @ts-expect-error
		return normalized;
	};
	/**
	 * @description
	 * - convert path to diskAbsolute and normalized to be using forward slash;
	 * - usefull for arguments for `methods` OR `functions` that needs to be absolute disk path, regardles if path is relative to project root, or already absolute path;
	 * @param {string} path
	 * @returns {string}
	 * @example
	 * import { Paths } from 'vivth/neutral';
	 *
	 * Paths.normalizesForRoot('\\path\\myFile.mjs'); //  "D://something/path/myFile.mjs"
	 */
	static diskAbsolute = (path) => {
		path = Paths.normalize(path);
		const rootPath = Paths.normalize(Paths.root);
		if (!path.startsWith(rootPath)) {
			path = Paths.normalize(join(rootPath, path));
		}
		return path;
	};
}
