// @ts-check

import { readFile } from 'node:fs/promises';
import prettier from 'prettier';
import stripJsonComments from 'strip-json-comments';

import { TryAsync } from '../function/TryAsync.mjs';
import { FileSafe } from './FileSafe.mjs';
import { Preferrence } from '../common/Preferrence.mjs';
import { Paths } from './Paths.mjs';

/**
 * @description
 * - class helper to handle `.json` file;
 * - this class assume, `Paths` already instantiated;
 */
export class JSONFileHandler {
	/**
	 * @param {string} path
	 * - `relative`(to `Paths.root`) OR `absolute`, both are accepted;
	 */
	constructor(path) {
		this.#path = Paths.diskAbsolute(path);
	}
	/**
	 * @type {ConstructorParameters<typeof JSONFileHandler>[0]}
	 */
	#path;
	/**
	 * @description
	 * @returns {ReturnType<typeof TryAsync<Object>>}
	 * @example
	 * import { JSONFileHandler } from "vivth/node";
	 *
	 * const packageJSONHandler = new JSONFileHandler('/package.json');
	 * const [content, error] = await packageJSONHandler.read();
	 */
	read = async () => {
		return await TryAsync(async () => {
			const strippedContent = stripJsonComments(
				await readFile(this.#path, { encoding: Preferrence.encoding }),
			);
			return JSON.parse(strippedContent);
		});
	};
	/**
	 * @description
	 * @param {Object} newObj
	 * @return { ReturnType<typeof TryAsync<void>> }
	 * @example
	 * import { this.writeJSONFileHandler } from "vivth/node";
	 *
	 * const packageJSONHandler = new JSONFileHandler('/package.json');
	 * const [, error] = await packageJSONHandler.write({
	 *  ...object,
	 * });
	 */
	write = async (newObj) => {
		const pretified = await prettier.format(JSON.stringify(newObj), { parser: 'json-stringify' });
		return await FileSafe.write(this.#path, pretified, {
			encoding: Preferrence.encoding,
		});
	};
	/**
	 * @description
	 * @param {Object} object
	 * @return { ReturnType<typeof TryAsync<void>> }
	 * @example
	 * import { JSONFileHandler } from "vivth/node";
	 *
	 * const packageJSONHandler = new JSONFileHandler('/package.json');
	 * const [, error] = await packageJSONHandler.assign({
	 *  ...object,
	 * });
	 */
	assign = async (object) => {
		return await TryAsync(async () => {
			const [jsonFileObject, errorReadJSONFileHandler] = await this.read();
			if (errorReadJSONFileHandler) {
				throw { errorReadJSONFileHandler };
			}
			Object.assign(jsonFileObject, object);
			const [, errorWriteJSONFileHandler] = await this.write(jsonFileObject);
			if (!errorWriteJSONFileHandler) {
				return;
			}
			throw { errorWriteJSONFileHandler };
		});
	};
}
