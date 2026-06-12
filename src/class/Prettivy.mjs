// @ts-check

import { resolveConfig, format } from 'prettier';
import { QChannel } from './QChannel.mjs';
import { LazyFactory } from '../function/LazyFactory.mjs';
import { Console } from './Console.mjs';

/**
 * @description
 * - `prettier` wrapper with option inference from path;
 */
export class Prettivy {
	static #q = LazyFactory(() => new QChannel('JSPrettify'));
	/**
	 * @param {string} path
	 */
	constructor(path) {
		this.path = path;
		this.getOptions();
	}
	/**
	 * @type {string}
	 */
	path;
	/**
	 * @type {import('prettier').Options|null}
	 */
	#options = null;
	getOptions = async () => {
		const [res, errorPrettifyResolveConfig] = await Prettivy.#q.callback(this, async () => {
			if (!this.#options) {
				this.options = await resolveConfig(this.path);
			}
			return this.#options;
		});
		if (!errorPrettifyResolveConfig) {
			return res;
		}
		Console.error({ errorPrettifyResolveConfig });
	};
	/**
	 * @param {string} contentBeforePrettified
	 * @returns {Promise<string>}
	 */
	format = async (contentBeforePrettified) => {
		return await format(contentBeforePrettified, {
			...(await this.getOptions()),
			filepath: this.path,
		});
	};
}
