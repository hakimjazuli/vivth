// @ts-check

import { timeout } from '../common.mjs';

class qFIFO {
	static {
		new qFIFO();
	}
	/**
	 * @typedef {[callback:()=>(any|Promise<any>),debounce?:(number)]} queueFIFODetails
	 */
	/**
	 * @private
	 */
	constructor() {}
	/**
	 * queue
	 * @private
	 * @type {queueFIFODetails[]}
	 */
	static q = [];
	/**
	 * isRunning
	 * @private
	 * @type {boolean}
	 */
	static R = false;
	/**
	 * auto initiator
	 * @private
	 */
	/**
	 * assign
	 * @type {(...queueFIFODetails:queueFIFODetails)=>void}
	 */
	static a = (..._queue) => {
		qFIFO.p(_queue);
		if (!qFIFO.R) {
			qFIFO.r();
		}
	};
	/**
	 * push
	 * @private
	 * @param {queueFIFODetails} _queue
	 */
	static p = (_queue) => {
		qFIFO.q.push(_queue);
	};
	/**
	 * run
	 * @private
	 */
	static r = async () => {
		qFIFO.R = true;
		while (qFIFO.q.length !== 0) {
			const [callback, debounceMs = 0] = qFIFO.q[0];
			qFIFO.q.shift();
			await callback();
			/**
			 * conditional debounce;
			 * queue FIFO messing up when have debouncer while `debounceMS` are set to 0;
			 */
			// if (debounceMs) {
			await timeout(debounceMs);
			// }
		}
		qFIFO.R = false;
	};
}
/**
 * @param {()=>(any|Promise<any>)} callback
 * @param {number} debounce
 * @returns
 */
export const NewPingFIFO = (callback, debounce = 0) => qFIFO.a(callback, debounce);
