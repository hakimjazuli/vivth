// @ts-check

/**
 * @description
 * - function helper for checking whether `functionReference` is async;
 * @param {(...any:any)=>(any|Promise<any>)} functionReference
 * @returns {boolean}
 * @example
 * import { IsAsync } from 'vivth';
 *
 * const a = function (params) {
 * 	// code
 * }
 * const b = async () => {
 * 	// code
 * }
 *
 * IsAsync(a); // false
 * IsAsync(b); // true
 */
export const IsAsync = (functionReference) => {
	return functionReference.constructor.name === 'AsyncFunction';
};
