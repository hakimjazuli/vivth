// @ts-check

import { timeout } from '../common.mjs';

/**
 * @description
 * - a class for Queue;
 * > - different `uniqueID`: called `first in first out` style;
 * > - same `uniqueID`: will be grouped, only the already running callback and the last callback will be called;
 * ```js
 * // @ts-check
 * import { PingUnique } from 'vivth';
 * const uniqueID = 'yourUniqueID'; // can be anything, even a reference to an object;
 * const debounceMS = 0; // in miliseconds, optionals, default is 0;
 * const handler = () =>{
 *  new PingUnique(uniqueID, async () => {
 * 		// your code
 * 	}, debounceMS);
 * }
 * ```
 * - this class provides `QUnique.makeQClass`;
 * >- this method will setup `QUnique` to use the inputed `queueMap`(as arg0) as centralized lookup for queue managed by `QUnique`;
 * >- usefull to modify this class for browser runtime, since `vivth` cannot just refer to window, you can just add `window["someobject"]`: `Map<any, [()=>Promise<any>,number]>` as lookups;
 */
export class PingUnique {
	/**
	 * @param {Map<any, [()=>Promise<void>,number]>} queueMap
	 * @returns {typeof PingUnique}
	 */
	static makeQClass = (queueMap) => {
		PingUnique.#queue = queueMap;
		return PingUnique;
	};
	/**
	 * @type {Map<any, [()=>Promise<void>,number]>}
	 */
	static #queue = new Map();
	/**
	 * @type {boolean}
	 */
	static #isRunning = false;
	/**
	 * @param {any} id
	 * @param {()=>Promise<void>} callback
	 * @param {number} [debounceMS]
	 */
	constructor(id, callback, debounceMS = 0) {
		PingUnique.#push(id, callback, debounceMS);
		if (!PingUnique.#isRunning) {
			PingUnique.#run();
		}
	}
	/**
	 * @param {any} id
	 * @param {()=>Promise<void>} callback
	 * @param {number} debounceMS
	 */
	static #push = (id, callback, debounceMS) => {
		PingUnique.#queue.set(id, [callback, debounceMS ? debounceMS : 0]);
	};
	static #run = async () => {
		PingUnique.#isRunning = true;
		const keysIterator = PingUnique.#queue.keys();
		let keys = keysIterator.next();
		while (!keys.done) {
			const key = keys.value;
			const q = PingUnique.#queue.get(key);
			if (!q) {
				return;
			}
			const [callback, debounce] = q;
			PingUnique.#queue.delete(key);
			/**
			 * debounce anyway;
			 * queue with unique id have characteristic of messing up when have no debouncer;
			 * especially when request comes too fast;
			 */
			await timeout(debounce);
			await callback();
			keys = keysIterator.next();
		}
		PingUnique.#isRunning = false;
	};
}
