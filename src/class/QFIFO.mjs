// @ts-check

import { timeout } from '../common.mjs';

/**
 * @description
 * ```js
 * /**
 *  * @typedef {[callback:()=>(any|Promise<any>),debounce?:(number)]} queueFIFODetails
 *  *[blank]/
 * ```
 * - a class for Queue;
 * - for minimal total bundle size use `function` [NewPingFIFO](#newpingfifo) instead;
 * - this class provides `QFIFO.makeQClass`;
 * >- this method will setup `QFIFO` to use the inputed `queueArray`(as arg0) as centralized lookup for queue managed by `QFIFO`;
 * >- usefull to modify this class for browser runtime, since `vivth` cannot just refer to window, you can just add `window["someobject"]`: `Array<queueFIFODetails>` as lookups;
 */
export class QFIFO {
	/**
	 * @param {queueFIFODetails[]} queueArray
	 * @returns {typeof QFIFO}
	 */
	static makeQClass = (queueArray) => {
		QFIFO.#queue = queueArray;
		return QFIFO;
	};
	/**
	 * @type {queueFIFODetails[]}
	 */
	static #queue = [];
	/**
	 * @type {boolean}
	 */
	static #isRunning = false;
	/**
	 * @type {(...queueFIFODetails:queueFIFODetails)=>void}
	 */
	static assign = (..._queue) => {
		QFIFO.#push(_queue);
		if (!QFIFO.#isRunning) {
			QFIFO.#run();
		}
	};
	/**
	 * @param {queueFIFODetails} _queue
	 */
	static #push = (_queue) => {
		QFIFO.#queue.push(_queue);
	};
	static #run = async () => {
		QFIFO.#isRunning = true;
		while (QFIFO.#queue.length !== 0) {
			const [callback, debounceMs = 0] = QFIFO.#queue[0];
			QFIFO.#queue.shift();
			await callback();
			/**
			 * conditional debounce;
			 * queue FIFO messing up when have debouncer while `debounceMS` are set to 0;
			 */
			// if (debounceMs) {
			await timeout(debounceMs);
			// }
		}
		QFIFO.#isRunning = false;
	};
}
