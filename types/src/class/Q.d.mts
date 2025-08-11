/**
 * @description
 * - class that containts static methods to generate Promise based `awaiter` inside async function, to prevent race condition, including but not limited to:
 * > - modifying the same `Map`, `Set`(etc.) `Object`/`Instance` inside a `Promise.all`/any code that might fired simultanously;
 * ```js
 * import { Q } from 'vivth';
 *
 * const handler = async () => {
 * 	// your code;
 * 	const { resume } = await Q.fifo() // or await Q.unique(uniqueID);
 * 	// your code that modifies and/or access same `Map`;
 * 	resume();
 * 	// the rest of your code;
 * 	return;
 * }
 *
 * const runtime = async () => {
 * 	// await Promise.all(handler1, handler2, ..., handlern);
 * }
 *
 * runtime();
 * ```
 * - behaviour:
 * > - `fifo`: call all queued callback `first in first out` style;
 * > - `unique`: call all queued callback with the same `uniqueID` `first in first out` style, if the `uniqueID` is different it will be called in parallel;
 * - this class provides `Q.makeQClass`;
 * >- this method will setup `Q` to use the inputed `uniqueMap`(as arg0) as centralized lookup for queue managed by `Q`;
 * >- usefull to modify this class for browser runtime, since `vivth` cannot just refer to window, you can just add `window["someobject"]`: `Array<Map<any, Promise<any>>>` as lookups;
 */
export class Q {
    /**
     * @param {Map<any, Promise<any>>} uniqueMap
     * @returns {typeof Q}
     */
    static makeQClass: (uniqueMap: Map<any, Promise<any>>) => typeof Q;
    /**
     * @typedef {import('../types/AnyButUndefined.type.mjs').AnyButUndefined} anyButUndefined
     */
    /**
     * @type {Promise<void>}
     */
    static "__#1@#fifo": Promise<void>;
    /**
     * Blocks execution for subsequent calls until the current one finishes.
     * @returns {Promise<{resume:()=>void}>} Resolves when it's safe to proceed, returning a cleanup function
     */
    static fifo: () => Promise<{
        resume: () => void;
    }>;
    /**
     * @type {Map<any, Promise<any>>}
     */
    static "__#1@#unique": Map<any, Promise<any>>;
    /**
     * Ensures that each id has only one task running at a time.
     * Calls with the same id will wait for the previous call to finish.
     * @param {anyButUndefined} id
     * @returns {Promise<{resume:()=>void}>} Resolves when it's safe to proceed for the given id, returning a cleanup function
     */
    static unique: (id: import("../types/AnyButUndefined.type.mjs").AnyButUndefined) => Promise<{
        resume: () => void;
    }>;
}
