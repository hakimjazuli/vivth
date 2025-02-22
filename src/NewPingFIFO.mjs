// @ts-check

import { timeout } from './common.mjs';

class queueFIFO {
	/**
	 * @typedef {[callback:()=>(any|Promise<any>),debounce?:(number)]} queueFIFODetails
	 */
	/**
	 * instance
	 * @type {queueFIFO}
	 */
	static I;
	/**
	 * @private
	 */
	constructor() {
		if (queueFIFO.I instanceof queueFIFO) {
			return;
		}
		queueFIFO.I = this;
		/**
		 * @param {queueFIFODetails} _queue
		 */
		queueFIFO.a = (..._queue) => {
			this.p(_queue);
			if (!this.R) {
				this.r();
			}
		};
	}
	/**
	 * queue
	 * @private
	 * @type {queueFIFODetails[]}
	 */
	q = [];
	/**
	 * isRunning
	 * @private
	 * @type {boolean}
	 */
	R = false;
	/**
	 * auto initiator
	 * @private
	 */
	static {
		new queueFIFO();
	}
	/**
	 * assign
	 * @type {(...queueFIFODetails:queueFIFODetails)=>void}
	 */
	static a;
	/**
	 * push
	 * @private
	 * @param {queueFIFODetails} _queue
	 */
	p = (_queue) => {
		this.q.push(_queue);
	};
	/**
	 * run
	 * @private
	 */
	r = async () => {
		this.R = true;
		while (this.q.length !== 0) {
			const [callback, debounceMs = 0] = this.q[0];
			this.q.shift();
			await callback();
			/**
			 * conditional debounce;
			 * queue FIFO messing up when have debouncer while `debounceMS` are set to 0;
			 */
			// if (debounceMs) {
			await timeout(debounceMs);
			// }
		}
		this.R = false;
	};
}

/**
 * @param {()=>(any|Promise<any>)} callback
 * @param {number} debounce
 * @returns
 */
export const NewPingFIFO = (callback, debounce = 0) => queueFIFO.a(callback, debounce);
