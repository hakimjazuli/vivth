// @ts-check

import { timeout } from '../common.mjs';

/**
 * @description
 * - a class for Queue;
 * - for minimal total bundle size use `function` [NewPingUnique](#newpingunique) instead;
 * - this class provides `QUnique.makeQClass`;
 * >- this method will setup `QUnique` to use the inputed `queueMap`(as arg0) as centralized lookup for queue managed by `QUnique`;
 * >- usefull to modify this class for browser runtime, since `vivth` cannot just refer to window, you can just add `window["someobject"]`: `Map<any, [()=>Promise<any>,number]>` as lookups;
 */
export class QUnique {
	/**
	 * @param {Map<any, [()=>Promise<any>,number]>} queueMap
	 * @returns {typeof QUnique}
	 */
	static makeQClass = (queueMap) => {
		QUnique.#queue = queueMap;
		return QUnique;
	};
	/**
	 * @typedef {Object} queueUniqueObject
	 * @property {any} i
	 * @property {()=>(any|Promise<any>)} c
	 * @property {number} [d]
	 */
	/**
	 * @type {Map<any, [()=>Promise<any>,number]>}
	 */
	static #queue = new Map();
	/**
	 * @type {boolean}
	 */
	static #isRunning = false;
	/**
	 * @type {(queueUniqueObject:queueUniqueObject)=>void}
	 */
	static assign = (_queue) => {
		QUnique.#push(_queue);
		if (!QUnique.#isRunning) {
			QUnique.#run();
		}
	};
	/**
	 * @param {queueUniqueObject} _queue
	 */
	static #push = (_queue) => {
		const { i, c, d } = _queue;
		QUnique.#queue.set(i, [c, d ? d : 0]);
	};
	static #run = async () => {
		QUnique.#isRunning = true;
		const keysIterator = QUnique.#queue.keys();
		let keys = keysIterator.next();
		while (!keys.done) {
			const key = keys.value;
			const q = QUnique.#queue.get(key);
			if (!q) {
				return;
			}
			const [callback, debounce] = q;
			QUnique.#queue.delete(key);
			/**
			 * debounce anyway;
			 * queue with unique id have characteristic of messing up when have no debouncer;
			 * especially when request comes too fast;
			 */
			await timeout(debounce);
			await callback();
			keys = keysIterator.next();
		}
		QUnique.#isRunning = false;
	};
}
