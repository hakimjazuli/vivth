// @ts-check

/**
 * @description
 * - error as value for asynchronous operation
 * returns: Promise<[`ResultType`|`undefined`, `Error`|`undefined`]>
 */
/**
 * @template ResultType
 * @param {()=>Promise<ResultType>} asyncFunction_
 * @returns {Promise<[ResultType|undefined, Error|undefined]>}
 */
export const TryAsync = async (asyncFunction_) => {
	try {
		const result = await asyncFunction_();
		return [result, undefined];
	} catch (error) {
		return [undefined, error];
	}
};
