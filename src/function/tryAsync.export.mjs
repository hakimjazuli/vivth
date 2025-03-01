// @ts-check

/**
 * @description
 * - error as value for asynchronous operation
 * returns: Promise<[`ResultType`|`null`, `Error`|`null`]>
 */
/**
 * @template ResultType
 * @param {()=>Promise<ResultType>} asyncFunction_
 * @returns {Promise<[ResultType|null, Error|null]>}
 */
export const tryAsync = async (asyncFunction_) => {
	try {
		const result = await asyncFunction_();
		return [result, null];
	} catch (error) {
		return [null, error];
	}
};
