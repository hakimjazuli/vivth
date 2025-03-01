// @ts-check

/**
 * @description
 * - error as value for synchronous operation
 * returns: [`Error`|`null`, `ResultType`|`null`]
 */
/**
 * @template ResultType
 * @param {()=>ResultType} function_
 * @returns {[ResultType|null, Error|null]}
 */
export const trySync = (function_) => {
	try {
		const result = function_();
		return [result, null];
	} catch (error) {
		return [null, error];
	}
};
