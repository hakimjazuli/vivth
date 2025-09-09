// @ts-check

/**
 * @description
 * - function for error as value for asynchronous operation;
 * - usefull to flatten indentation for error handlings;
 * @template ResultType
 * @param {()=>Promise<ResultType>} asyncFunction_
 * @returns {Promise<[ResultType|undefined, Error|undefined]>}
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
export const TryAsync = async (asyncFunction_) => {
	try {
		const result = await asyncFunction_();
		return [result, undefined];
	} catch (error) {
		return [undefined, error];
	}
};
