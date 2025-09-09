// @ts-check

import { Console } from '../class/Console.mjs';
import { LazyFactory } from './LazyFactory.mjs';
import { TrySync } from './TrySync.mjs';

/**
 * @description
 * - function for create immutable object;
 * - usefull for binding immutable object to global for shared object:
 * >- e.g. to window object in browser;
 * @template {Object} P
 * @template {Object} O
 * @param {string} keyName
 * @param {P} parent
 * @param {(this:P)=>O} object
 * @param {Object} [options]
 * @param {boolean} [options.lazy]
 * @return {O}
 * @example
 * import { CreateImmutable } from 'vivth';
 *
 * const mappedObject = new Map();
 *
 * CreateImmutable(window, 'mySharedObject', {
 * 	setMap(name_, value) => {
 * 		mappedObject.set(name_, value)
 * 	},
 * 	getMap(name_) => mappedObject.get(name_),
 * })
 */
export const CreateImmutable = (parent, keyName, object, { lazy = true } = {}) => {
	if (!parent || typeof parent !== 'object') {
		Console.error({
			object,
			parent,
			keyName,
			message: 'Invalid parent object provided to `CreateImmutable`;',
		});
		return;
	}
	let [_, error] = TrySync(() => {
		Object.defineProperty(parent, keyName, {
			value: lazy ? LazyFactory(() => object.call(parent)) : object.call(parent),
			writable: false,
			configurable: false,
			enumerable: false,
		});
	});
	if (error) {
		[_, error] = TrySync(() => {
			parent[keyName] = lazy ? LazyFactory(() => object.call(parent)) : object.call(parent);
		});
	}
	if (error) {
		Console.info({
			parent,
			message: `"${keyName}" already defined on the "parent"`,
			realValue: parent[keyName],
		});
		return;
	}
	return parent[keyName];
};
