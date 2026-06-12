// @ts-check

/**
 * @import {MonkeyPatchedType} from '../typehints/MonkeyPatchedType.mjs'
 */

/**
 * Monkey‑patch an environmental API by replacing a property on a parent object
 * with a new function or class. This allows you to intercept or override
 * browser/Node globals (e.g. `XMLHttpRequest`, `Worker`, `fetch`) without
 * modifying the rest of your application code.
 *
 * ## Notes
 * - Run this before other code that consumes the patched API.
 * - Existing instances created before patching are unaffected.
 * - If the property is non‑writable, assignment will throw.
 * - For classes, always call `super(...args)` in your constructor.
 * - For functions, preserve the call signature to avoid type errors.
 *
 * @template {Object} PAR
 * @template {keyof PAR} KEY
 * @param {PAR} parent - The parent object holding the property (e.g. `window`).
 * @param {KEY} key - The property name on the parent to replace.
 * @param {(
 *    arg0:{originalObject:PAR[KEY]}
 *  ) => MonkeyPatchedType<PAR[KEY]>
 * } newObjectGenerator
 *   - Function that receives the original object and returns the patched version.
 *   - For classes: extend `originalObject` and override methods.
 *   - For functions: spread arguments(and when necessary, delegate to `originalObject`).
 * @returns {void}
 */
export function MonkeyPatch(parent, key, newObjectGenerator) {
	const originalObject = parent[key];
	/** @type {any} */
	const newObject = newObjectGenerator({ originalObject });
	parent[key] = newObject;
}
