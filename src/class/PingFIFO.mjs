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
 * - function to auto queue callbacks that will be called `first in first out` style;
 * ```js
 * // @ts-check
 * import { PingFIFO } from 'vivth';
 * const debounceMS = 0; // in miliseconds, optionals, default is 0;
 * const handler = () =>{
 * 	new PingFIFO(async () => {
 * 		// your code
 * 	}, debounceMS);
 * }
 * ```
 * - this class provides `QFIFO.makeQClass`;
 * >- this method will setup `QFIFO` to use the inputed `queueArray`(as arg0) as centralized lookup for queue managed by `QFIFO`;
 * >- usefull to modify this class for browser runtime, since `vivth` cannot just refer to window, you can just add `window["someobject"]`: `Array<queueFIFODetails>` as lookups;
 */
export class PingFIFO {
	/**
	 * @param {queueFIFODetails[]} queueArray
	 * @returns {typeof PingFIFO}
	 */
	static makeQClass = (queueArray) => {
		PingFIFO.#queue = queueArray;
		return PingFIFO;
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
	 * @param {()=>(any|Promise<any>)} callback
	 * @param {number} [debounce]
	 */
	constructor(callback, debounce = 0) {
		PingFIFO.#push([callback, debounce]);
		if (PingFIFO.#isRunning) {
			return;
		}
		PingFIFO.#run();
	}
	/**
	 * @param {queueFIFODetails} _queue
	 */
	static #push = (_queue) => {
		PingFIFO.#queue.push(_queue);
	};
	static #run = async () => {
		PingFIFO.#isRunning = true;
		while (PingFIFO.#queue.length !== 0) {
			const [callback, debounceMs = 0] = PingFIFO.#queue[0];
			PingFIFO.#queue.shift();
			await callback();
			/**
			 * conditional debounce;
			 * queue FIFO messing up when have debouncer while `debounceMS` are set to 0;
			 */
			// if (debounceMs) {
			await timeout(debounceMs);
			// }
		}
		PingFIFO.#isRunning = false;
	};
}
