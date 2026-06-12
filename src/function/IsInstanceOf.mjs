// @ts-check

/**
 * @description
 * A type-safe `instanceof` helper.
 * @template OBJ
 * @param {unknown} obj - The object to test
 * @param {new (...args: any[]) => OBJ} classRef - A constructor reference for T
 * @returns {obj is OBJ}
 * @example
 * import { IsInstanceOf, Signal, Effect } from 'vivth/neutral';
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
 * if(!IsInstanceOf(a, Signal)){
 *  //
 * };
 */
export function IsInstanceOf(obj, classRef) {
	return obj instanceof classRef;
}
