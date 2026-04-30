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
export function ForOfSync<T extends unknown, RETURNTYPE extends unknown>(iterable: Iterable<T>, handlerCallback: (value: T, options: {
    prevError: Error | undefined;
    breakEarly: () => void;
}) => RETURNTYPE | undefined): [Set<RETURNTYPE>, Set<Error>];
