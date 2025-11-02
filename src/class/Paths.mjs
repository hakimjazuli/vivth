// @ts-check

import { Console } from './Console.mjs';

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
	 * import { Paths } from 'vivth';
	 *
	 * new Paths({
	 * 	root: location.origin,
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
	 * - reference for rootPath
	 * - `Paths` needed to be instantiated via:
	 * >- `Paths` constructor;
	 * >- `Setup.paths` constructor;
	 * @type {string|undefined}
	 */
	static get root() {
		if (Paths.#instance === undefined) {
			Console.error({
				error: 'Paths.instance.#root is undefined',
				solutions: 'instantiate `Paths` or instantiate `Setup`',
			});
			return undefined;
		}
		return Paths.#instance.#root;
	}
	/**
	 * @description
	 * - normalize path separator to forward slash `/`;
	 * @param {string} path_
	 * @returns {string}
	 * @example
	 * import { Paths } from 'vivth';
	 *
	 * Paths.normalize('file:\\D:\\myFile.mjs'); //  "file://D://myFile.mjs"
	 */
	static normalize = (path_) => {
		return path_.replace(/\\/g, '/');
	};
	/**
	 * @description
	 * - normalize path separator to forward slash `/`;
	 * - then starts with forward slash `/`;
	 * @param {string} path_
	 * @returns {`/${string}`}
	 * @example
	 * import { Paths } from 'vivth';
	 *
	 * Paths.normalizesForRoot('path\\myFile.mjs'); //  "/path/myFile.mjs"
	 */
	static normalizesForRoot = (path_) => {
		let normalized = Paths.normalize(path_);
		if (normalized.startsWith('/') === false) {
			normalized = `/${normalized}`;
		}
		// @ts-expect-error
		return normalized;
	};
}
