// @ts-check

import { timeout } from '../common.mjs';

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
 * @param {anyButUndefined} id
 * @param {()=>(any|Promise<any>)} callback
 * @param {number} debounce
 * @returns
 */
export const NewPingUnique = (id, callback, debounce = 0) =>
	qUnique.A({ i: id, c: callback, d: debounce });
