/**
 * @description
 * - function helper to turn unsafe constructor call of classReference into safe one without tryCatch block;
 * - usefull to flatten your source code;
 * @template {new (...args: any[]) => any} CLASSREF
 * @param {CLASSREF} classReference
 * @param {ConstructorParameters<CLASSREF>} params
 * @returns {[InstanceType<CLASSREF>, undefined]|
 * [undefined, Error]}
 * @example
 * import { TryNew } from 'vivth';
 *
 * const [instance, error] = TryNew(ClassReference, ...classConstructorParameters)
 * if(!error) {
 *   // do something with instance safely;
 * }
 */
export function TryNew<CLASSREF extends new (...args: any[]) => any>(classReference: CLASSREF, ...params: ConstructorParameters<CLASSREF>): [InstanceType<CLASSREF>, undefined] | [undefined, Error];
