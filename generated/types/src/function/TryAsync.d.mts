/**
 * @description
 * - function for error as value for asynchronous operation;
 * - usefull to flatten indentation for error handlings;
 * @template RESULT
 * @param {()=>Promise<RESULT>} asyncFunction_
 * @returns {Promise<[RESULT,undefined]|[undefined,Error]>}
 * @example
 * import { TryAsync } from 'vivth/neutral';
 *
 * let [res, error] = await TryAsync(async () => {
 * 	return await fetch('./someAPI/Path');
 * });
 *
 * [res, error] = await TryAsync(async () => {
 * 	if(!res.ok) {
 * 		throw 404;
 * 	}
 * 	return await res.json();
 * })
 */
export declare function TryAsync<RESULT>(asyncFunction_: () => Promise<RESULT>): Promise<[RESULT, undefined] | [undefined, Error]>;
