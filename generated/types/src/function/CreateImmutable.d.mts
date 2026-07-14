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
 * @return {ReturnType<typeof TrySync<OBJECT>>}
 * @example
 * import { CreateImmutable } from 'vivth/neutral';
 *
 * const mappedObject = new Map();
 *
 * const [object, errorCreatingImmutable] = CreateImmutable(window, 'mySharedObject', {
 * 	setMap(name_, value) => {
 * 		mappedObject.set(name_, value)
 * 	},
 * 	getMap(name_) => mappedObject.get(name_),
 * })
 */
export declare function CreateImmutable<PARENT extends Object, OBJECT extends Object>(parent: PARENT, keyName: string, object: (this: PARENT) => OBJECT, { lazy }?: {
    lazy?: boolean;
}): ReturnType<typeof TrySync<OBJECT>>;
