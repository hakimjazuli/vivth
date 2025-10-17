// @ts-check

import { unwrapLazy } from '../common/lazie.mjs';

/**
 * @description
 * - function helper for creating lazyObject:
 * >- usefull for lazily instantiating an object, since instance naturally have props/methods;
 * @template FACTORY
 * @param {() => FACTORY} factory
 * @returns {FACTORY & {[unwrapLazy]: ()=> FACTORY}}
 * - the unwrapLazy prop can be accessed to force instatiation/call;
 * >- `unwrapLazy` prop name can be checked by checking the list of possible prop, from your ide;
 * >- as of version `1.0.0`, value is `vivth:unwrapLazy;`;
 * @example
 * import { LazyFactory } from  'vivth';
 *
 * class MyClass{
 *    constructor() {
 *      this.myProp = 1; // will only available when accessed;
 *    }
 * }
 *
 * export const myInstance = LazyFactory(() => {
 *		// the instance of MyClass will only be available when,
 *		// it's prop, or method is accessed/reassign;
 *		return new MyClass();
 * });
 *
 * // on other file
 * import { myInstance } from './myInstance.mjs';
 *
 * const a = myInstance; // not yet initiated;
 * const b = a.myProp // imediately initiated;
 * // OR
 * myInstance["vivth:unwrapLazy;"]() // forcefully call the callback;
 */
export function LazyFactory(factory) {
	/**
	 * @type {FACTORY|undefined}
	 */
	let instance;
	// @ts-expect-error
	return new Proxy(
		{},
		{
			get(_, prop) {
				if (prop === unwrapLazy) {
					if (instance === undefined) {
						instance = factory();
					}
					return () => instance;
				}
				if (instance === undefined) {
					instance = factory();
				}
				// @ts-expect-error
				return instance[prop];
			},
			set(_, prop, newValue) {
				if (instance === undefined) {
					instance = factory();
				}
				// @ts-expect-error
				instance[prop] = newValue;
				return true;
			},
			apply(_, thisArg, args) {
				if (instance === undefined) {
					instance = factory();
				}
				// @ts-expect-error
				return Reflect.apply(instance, thisArg, args);
			},
		}
	);
}
