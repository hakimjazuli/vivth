// @ts-check

import { timeout } from '../common.mjs';

/**
 * @description
 * - function to auto queue callbacks:
 * > - different `uniqueID`: called `first in first out` style;
 * > - same `uniqueID`: will be grouped, only the already running callback and the last callback will be called;
 * ```js
 * // @ts-check
 * import { NewPingUnique } from 'vivth';
 * const uniqueID = 'yourUniqueID'; // can be anything, even a reference to an object;
 * const debounceMS = 0; // in miliseconds, optionals, default is 0;
 * const handler = () =>{
 * 	NewPingUnique(uniqueID, async () => {
 * 		// your code
 * 	}, debounceMS);
 * }
 * ```
 */
class qUnique {
	/**
	 * @typedef {import('../types/anyButUndefined.type.mjs').anyButUndefined} anyButUndefined
	 * @typedef {Object} queueUniqueObject
	 * @property {any} i
	 * @property {()=>(any|Promise<any>)} c
	 * @property {number} [d]
	 */
	/**
	 * @private
	 * @type {Map<any, [()=>Promise<any>,number]>}
	 */
	static queue = new Map();
	/**
	 * isRunning
	 * @private
	 * @type {boolean}
	 */
	static r = false;
	/**
	 * assign
	 * @type {(queueUniqueObject:queueUniqueObject)=>void}
	 */
	static A = (_queue) => {
		qUnique.p(_queue);
		if (!qUnique.r) {
			qUnique.R();
		}
	};
	/**
	 * push
	 * @private
	 * @param {queueUniqueObject} _queue
	 */
	static p = (_queue) => {
		const { i, c, d } = _queue;
		qUnique.queue.set(i, [c, d ? d : 0]);
	};
	/**
	 * run
	 * @private
	 */
	static R = async () => {
		qUnique.r = true;
		const keysIterator = qUnique.queue.keys();
		let keys = keysIterator.next();
		while (!keys.done) {
			const key = keys.value;
			const [callback, debounce] = qUnique.queue.get(key);
			qUnique.queue.delete(key);
			/**
			 * debounce anyway;
			 * queue with unique id have characteristic of messing up when have no debouncer;
			 * especially when request comes too fast;
			 */
			await timeout(debounce);
			await callback();
			keys = keysIterator.next();
		}
		qUnique.r = false;
	};
}

/**
 * @param {anyButUndefined} uniqueID
 * @param {()=>(any|Promise<any>)} callback
 * @param {number} debounce
 * @returns
 */
export const NewPingUnique = (uniqueID, callback, debounce = 0) =>
	qUnique.A({ i: uniqueID, c: callback, d: debounce });
