// @ts-check

/**
 * @description
 * - error as value for synchronous operation
 * returns: [`ResultType`|`undefined`, `Error`|`undefined`]
 */
/**
 * @template ResultType
 * @param {()=>ResultType} function_
 * @returns {[ResultType|undefined, Error|undefined]}
 */
export const trySync = (function_) => {
	try {
		const result = function_();
		return [result, undefined];
	} catch (error) {
		return [undefined, error];
	}
};
