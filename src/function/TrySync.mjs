// @ts-check

/**
 * @description
 * - function for error as value for synchronous operation;
 * - usefull to flatten indentation for error handlings;
 * @template ResultType
 * @param {()=>ResultType} function_
 * @returns {[ResultType|undefined, Error|undefined]}
 * @example
 * import { readFileSync } from 'fs';
 * import { TrySync } from './yourModule.js';
 *
 * const [data, error] = TrySync(() => {
 * 	return readFileSync('./some/file.txt', 'utf-8');
 * });
 */
export const TrySync = (function_) => {
	try {
		const result = function_();
		return [result, undefined];
	} catch (error) {
		return [undefined, error];
	}
};
