/**
 * @description
 * A type-safe `instanceof` helper.
 * @template T
 * @param {unknown} obj - The object to test
 * @param {new (...args: any[]) => T} classRef - A constructor reference for T
 * @returns {obj is T}
 * @example
 * import { IsInstanceOf, Signal, Effect } from 'vivth';
 *
 * const a = new Signal(0);
 * IsInstanceOf(a, Signal); // true
 * IsInstanceOf(a, Effect); // false
 *
 * // but why not
 * if(!(a instanceof Signal)){
 *  //
 * };
 *
 * // here's why
 * if(!IsTypeOf(a, Signal)){
 *  //
 * };
 */
export function IsInstanceOf<T>(obj: unknown, classRef: new (...args: any[]) => T): obj is T;
