// @ts-check

import { TrySync } from './TrySync.mjs';

/**
 * @description
 * - loop through iterable safely;
 * @template {any} T
 * @template {any} RETURNTYPE
 * @param {Iterable<T>} iterable
 * @param {(value: T,
 * options:{
 * prevError:Error|undefined,
 * breakEarly:()=>void,
 * }) => RETURNTYPE|undefined} handlerCallback
 * - when `breakEarly` is called, the loop will break at the begining of the next iteration;
 * - typehint according to your js flavor, so the function make setOfResult typed;
 * @returns {[Set<RETURNTYPE>, Set<Error>]}
 * @example
 * import { ForOfSync } from 'vivth';
 *
 * ForOfSync(iterable, (value, { prevError, breakEarly })=>{
 * 	// code
 * })
 */
export function ForOfSync(iterable, handlerCallback) {
	/**
	 * @type {Set<Error>}
	 */
	const errors = new Set();
	/**
	 * @type {Set<RETURNTYPE>}
	 */
	const results = new Set();
	/**
	 * @type {Error|undefined}
	 */
	let prevError;
	let breakEarly_ = false;
	const breakEarly = () => {
		breakEarly_ = true;
	};
	for (const value of iterable) {
		if (
			/**  */
			breakEarly_
		) {
			break;
		}
		const [result, error] = TrySync(() => handlerCallback(value, { prevError, breakEarly }));
		if (
			/**  */
			error
		) {
			prevError = error;
			errors.add(error);
			continue;
		}
		if (
			/**  */
			result === undefined
		) {
			continue;
		}
		results.add(result);
	}
	return [results, errors];
}
