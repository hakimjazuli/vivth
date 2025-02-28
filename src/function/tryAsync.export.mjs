// @ts-check

/**
 * @description
 * - error as value for asynchronous operation
 * returns: Promise<[`Error`|`null`, `ResultType`|`null`]>
 */
/**
 * @template ResultType
 * @param {()=>Promise<ResultType>} asyncFunction_
 * @returns {Promise<[Error|null, ResultType|null]>}
 */
export const tryAsync = async (asyncFunction_) => {
	try {
		const result = await asyncFunction_();
		return [null, result];
	} catch (error) {
		return [error, null];
	}
};
