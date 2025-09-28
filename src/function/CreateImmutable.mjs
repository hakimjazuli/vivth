// @ts-check

import { Console } from '../class/Console.mjs';
import { LazyFactory } from './LazyFactory.mjs';
import { TrySync } from './TrySync.mjs';

/**
 * @description
 * - function for create immutable object;
 * - usefull for binding immutable object to global for shared object:
 * >- e.g. to window object in browser;
 * @template {Object} PARENT
 * @template {Object} OBJECT
 * @param {string} keyName
 * @param {PARENT} parent
 * @param {(this:PARENT)=>OBJECT} object
 * @param {Object} [options]
 * @param {boolean} [options.lazy]
 * @return {OBJECT}
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
export function CreateImmutable(parent, keyName, object, { lazy = true } = {}) {
	if (!parent || typeof parent !== 'object') {
		Console.error({
			object,
			parent,
			keyName,
			message: 'Invalid parent object provided to `CreateImmutable`;',
		});
		return;
	}
	let [, error] = TrySync(() => {
		Object.defineProperty(parent, keyName, {
			value: lazy ? LazyFactory(() => object.call(parent)) : object.call(parent),
			writable: false,
			configurable: false,
			enumerable: false,
		});
	});
	if (error) {
		[, error] = TrySync(() => {
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
}
