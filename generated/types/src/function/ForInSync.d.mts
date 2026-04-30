/**
 * @description
 * - safe `Object` iterator helper;
 * >- collect errors then returns it as Set<Error>;
 * @template {Record<string, any>} OBJECT
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
 * import { ForInSync } from 'vivth';
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
export function ForInSync<OBJECT extends Record<string, any>, RETURNTYPE extends unknown>(object: OBJECT, handlerCallback: (key: keyof OBJECT, value: OBJECT[keyof OBJECT], options: {
    prevError: Error | undefined;
    breakEarly: () => void;
}) => RETURNTYPE | undefined): [Set<RETURNTYPE>, Set<Error>];
