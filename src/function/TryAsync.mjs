// @ts-check

import { resolveErrorArray } from './resolveErrorArray.mjs';

/**
 * @description
 * - function for error as value for asynchronous operation;
 * - usefull to flatten indentation for error handlings;
 * @template RESULT
 * @param {()=>Promise<RESULT>} asyncFunction_
 * @returns {Promise<[RESULT,undefined]|[undefined,Error]>}
 * @example
 * import { TryAsync } from 'vivth';
 *
 * let [res, error] = await TryAsync(async () => {
 * 	return await fetch('./someAPI/Path');
 * });
 *
 * [res, error] = await TryAsync(async () => {
 * 	if(!res.ok) {
 * 		throw new Error(404);
 * 	}
 * 	return await res.json();
 * })
 */
export async function TryAsync(asyncFunction_) {
	try {
		const result = await asyncFunction_();
		return [result, undefined];
	} catch (error) {
		return resolveErrorArray(error);
	}
}
