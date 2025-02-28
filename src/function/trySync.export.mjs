// @ts-check

/**
 * @description
 * - error as value for synchronous operation
 * returns: [`Error`|`null`, `ResultType`|`null`]
 */
/**
 * @template ResultType
 * @param {()=>ResultType} function_
 * @returns {[Error|null, ResultType|null]}
 */
export const trySync = (function_) => {
	try {
		const result = function_();
		return [null, result];
	} catch (error) {
		return [error, null];
	}
};
