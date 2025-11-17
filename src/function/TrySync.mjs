// @ts-check

import { resolveErrorArray } from './resolveErrorArray.mjs';

/**
 * @description
 * - function for error as value for synchronous operation;
 * - usefull to flatten indentation for error handlings;
 * @template RESULT
 * @param {()=>RESULT} function_
 * @returns {[RESULT,undefined]|
 * [undefined,Error]}
 * @example
 * import { readFileSync } from 'node:fs';
 * import { TrySync } from './yourModule.js';
 *
 * const [data, error] = TrySync(() => {
 * 	return readFileSync('./some/file.txt', 'utf-8');
 * });
 */
export function TrySync(function_) {
	try {
		const result = function_();
		return [result, undefined];
	} catch (error) {
		return resolveErrorArray(error);
	}
}
