// @ts-check

import { Console } from './Console.mjs';

/**
 * @description
 * - class helpers to define pathReference;
 * - is a singleton;
 */
export class Paths {
	/**
	 * @type {Paths}
	 */
	static #instance = undefined;
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
	 * process?.env?.INIT_CWD ?? process?.cwd()
	 * ```
	 * - deno: need for `deno run --allow-env --allow-read your_script.ts`:
	 * ```js
	 * Deno.env.get("INIT_CWD") ?? Deno.cwd()
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
	 * @type {string}
	 */
	#root = undefined;
	/**
	 * @description
	 * - reference for rootPath
	 * - `Paths` needed to be instantiated via:
	 * >- `Paths` constructor;
	 * >- `Setup.paths` constructor;
	 * @type {string}
	 */
	static get root() {
		if (!Paths.#instance.#root) {
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
	 * Paths.normalize('file:\\D:\\myFile.mjs'); // return 'file://D://myFile.mjs'
	 */
	static normalize = (path_) => path_.replace(/\\/g, '/');
}
