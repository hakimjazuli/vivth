/**
 * @description
 * A type-safe `typeof` helper.
 * @template {any} O
 * @param {O} object
 * @param {"string" | "number" | "boolean" | "object" | "function" | "undefined" | "symbol" | "bigint"} type
 * @returns {boolean}
 * @example
 * import { IsinstanceOf, Signal, Effect } from 'vivth';
 *
 * const a ='hei';
 * IsTypeOf(a, 'string'); // true
 * IsTypeOf(a, 'number'); // false
 *
 * // but why not
 * if(!(typeof a === 'number')){
 *  //
 * };
 *
 * // here's why
 * if(!IsTypeOf(a, 'string')){
 *  //
 * };
 */
export function IsTypeOf<O extends unknown>(object: O, type: "string" | "number" | "boolean" | "object" | "function" | "undefined" | "symbol" | "bigint"): boolean;
