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
export function CreateImmutable<PARENT extends unknown, OBJECT extends unknown>(parent: PARENT, keyName: string, object: (this: PARENT) => OBJECT, { lazy }?: {
    lazy?: boolean;
}): OBJECT;
