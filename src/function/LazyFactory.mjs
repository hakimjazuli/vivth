// @ts-check

import { FactoryKey } from '../common/FactoryKey.mjs';

/**
 * @description
 * - function helper for creating lazyObject:
 * >- usefull for lazily instantiating an object, since instance naturally have props/methods;
 * @template FACTORY
 * @param {() => FACTORY} factory
 * @returns {FACTORY & {[FactoryKey]: FACTORY}}
 * - the FactoryKey prop can be accessed to force instatiation/call;
 * - usefull for Object that has different accessor behaviour when being get via Proxy, including but not limited too:
 * >- `Set<any>`;
 * >- `Map<any, any>`;
 * >- non referenced object, like `Effect`;
 * @example
 * import { LazyFactory, FactoryKey } from 'vivth/neutral';
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
 * myInstance[FactoryKey] // forcefully call factory generator;
 */
export function LazyFactory(factory) {
	/**
	 * @type {FACTORY|undefined}
	 */
	let instance;
	const generateIfUndefined = () => {
		if (instance !== undefined) {
			return;
		}
		instance = factory();
	};
	// @ts-expect-error
	return new Proxy(
		/** */
		() => {},
		{
			get(_, prop) {
				generateIfUndefined();
				if (prop === FactoryKey) {
					return instance;
				}
				// @ts-expect-error
				return instance[prop];
			},
			set(_, prop, newValue) {
				generateIfUndefined();
				// @ts-expect-error
				instance[prop] = newValue;
				return true;
			},
			apply(_, thisArg, args) {
				generateIfUndefined();
				if (typeof instance !== 'function') {
					throw new TypeError('LazyFactory: instance is not callable');
				}
				return Reflect.apply(instance, thisArg, args);
			},
		},
	);
}
