/**
 * @description
 * - safe `Object` async iterator helper;
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
 * )=>Promise<RETURNTYPE|undefined>} handlerCallback
 * - when `breakEarly` is called, the loop will break at the begining of the next iteration;
 * - typehint according to your js flavor, so the function make setOfResult typed;
 * @returns {Promise<[Set<RETURNTYPE>, Set<Error>]>}
 * @example
 * import { ForInAsync } from 'vivth/neutral';
 *
 * const object = { A: 'a', B: 'b' };
 * const setOfError = await ForInAsync(
 * 	object,
 * 	async (key, value, { prevError, breakEarly }) => {
 * 		// if(prevError) {
 * 		// 	breakEarly(); // imperative break;
 * 		// 	return; // undefined return will not be added to result;
 * 		// }
 * 	}
 * );
 */
export declare function ForInAsync<OBJECT extends Record<string | number | symbol, any>, RETURNTYPE extends any>(object: OBJECT, handlerCallback: (key: keyof OBJECT, value: OBJECT[keyof OBJECT], options: {
    prevError: Error | undefined;
    breakEarly: () => void;
}) => Promise<RETURNTYPE | undefined>): Promise<[Set<RETURNTYPE>, Set<Error>]>;
