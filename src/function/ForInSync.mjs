// @ts-check

import { TrySync } from './TrySync.mjs';

/**
 * @description
 * - safe `Object` iterator helper;
 * >- collect errors then returns it as Set<Error>;
 * @template {Record<string|number|symbol, any>} OBJECT
 * @template {any} RETURNTYPE
 * @param {OBJECT} object
 * @param {(
 * key:keyof OBJECT,
 * value:OBJECT[keyof OBJECT],
 * options:{
 * prevError:Error|undefined,
 * breakEarly:()=>void,
 * },
 * )=>RETURNTYPE|undefined} handlerCallback
 * - when `breakEarly` is called, the loop will break at the begining of the next iteration;
 * - typehint according to your js flavor, so the function make setOfResult typed;
 * @returns {[Set<RETURNTYPE>, Set<Error>]}
 * @example
 * import { ForInSync } from 'vivth/neutral';
 *
 * const object = { A: 'a', B: 'b' };
 * const [setOfResult , setOfError] = ForInSync(
 * 	object,
 * 	(key, value, { prevError, breakEarly }) => {
 * 		// if(prevError) {
 * 		// 	breakEarly(); // imperative break;
 * 		// 	return; // undefined return will not be added to result;
 * 		// }
 * 	}
 * );
 */
export function ForInSync(object, handlerCallback) {
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
	for (const key in object) {
		if (
			/** */
			breakEarly_
		) {
			break;
		}
		const value = object[key];
		if (
			/** */
			!Object.hasOwn(object, key) ||
			value === undefined
		) {
			continue;
		}
		const [result, error] = TrySync(() => handlerCallback(key, value, { prevError, breakEarly }));
		if (
			/** */
			error
		) {
			prevError = error;
			errors.add(error);
			continue;
		}
		if (
			/** */
			result === undefined
		) {
			continue;
		}
		results.add(result);
	}
	return [results, errors];
}
