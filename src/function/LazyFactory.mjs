// @ts-check

import { unwrapLazy } from '../common/lazie.mjs';

/**
 * @description
 * - function helper for creating lazyObject:
 * >- usefull for lazily instantiating an object, since instance naturally have props/methods;
 * @template T
 * @param {() => T} factory
 * @returns {T & {[unwrapLazy]: string}}
 * - the unwrapLazy prop can be accessed to force instatiation/call;
 * >- `unwrapLazy` prop name can be checked by checking the list of possible prop, from your ide;
 * >- as of version 1.0.0, value is `vivth:unwrapLazy;`;
 * @example
 * import { LazyFactory } from  'vivth';
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
 */
export const LazyFactory = (factory) => {
	let instance;
	// @ts-expect-error
	return new Proxy(
		{},
		{
			get(_, prop) {
				if (!instance) {
					instance = factory();
				}
				if (prop === unwrapLazy) {
					if (!instance) {
						instance = factory();
					}
					return instance;
				}
				return instance[prop];
			},
			set(_, prop, newValue) {
				if (prop === unwrapLazy) {
					instance = factory();
				}
				if (!instance) {
					instance = factory();
				}
				instance[prop] = newValue;
				return true;
			},
			apply(_, thisArg, args) {
				if (!instance) {
					instance = factory();
				}
				return Reflect.apply(instance, thisArg, args);
			},
		}
	);
};
