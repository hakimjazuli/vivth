// @ts-check

import { closeWorkerThreadEventObject } from '../common/eventObjects.mjs';
import { EventCheck } from '../function/EventCheck.mjs';
import { LazyFactory } from '../function/LazyFactory.mjs';
import { Try } from '../function/Try.mjs';
import { TryAsync } from '../function/TryAsync.mjs';
import { Console } from './Console.mjs';
import { QChannel } from './QChannel.mjs';
import { WorkerResult } from './WorkerResult.mjs';

/**
 * @description
 * - class helper for `WorkerThread` creation;
 * @template Receive
 * @template Post
 */
export class WorkerThread {
	/**
	 * @type {{parentPort:()=>Promise<any>}}
	 */
	static #parentPortRef = LazyFactory(() => {
		return { parentPort: async () => (await import('node:worker_threads')).parentPort };
	});
	/**
	 * @description
	 * - need to be called and exported as new `WorkerThread` class reference;
	 * @template Receive_
	 * @template Post_
	 * @param {{parentPort:()=>Promise<any>}} parentPortRef
	 * - correct parentPort reference;
	 * @returns {typeof WorkerThread<Receive_, Post_>}
	 * @example
	 * import { WorkerThread } from 'vivth';
	 *
	 * WorkerThread.setup({ parentPort: async () => await import('node:worker_threads') });
	 * // that is the default value, if your parentPort/equivalent API is not that;
	 * // you need to call this method;
	 */
	static setup = (parentPortRef) => {
		this.#parentPortRef = parentPortRef;
		return WorkerThread;
	};
	/**
	 * @returns {QChannel<WorkerThread>}
	 */
	#qChannel = new QChannel();
	/**
	 * @param {any} ev
	 */
	static #isCloseWorkerEvent = (ev) => {
		return EventCheck(ev, closeWorkerThreadEventObject);
	};
	/**
	 * @description
	 * - instantiate via created class from `setup` static method;
	 * @param {WorkerThread["handler"]} handler
	 * @example
	 * import { MyWorkerThread } from './MyWorkerThread.mjs';
	 *
	 * const doubleWorker = new MyWorkerThread((ev, isLastOnQ) => {
	 * 	// if(!isLastOnQ) {
	 * 	// 	return null; // can be used for imperative debouncing;
	 * 	// }
	 * 	return ev = ev \* 2;
	 * });
	 */
	constructor(handler) {
		this.handler = handler;
		const this_ = this;
		Try({
			post: async () => {
				/**
				 * @param {MessageEvent<Receive>|Receive} ev
				 * @returns {Promise<void>}
				 */
				self.onmessage = async function (ev) {
					const [_, error] = await TryAsync(async () => {
						ev = ev instanceof MessageEvent ? ev.data : ev;
						if (WorkerThread.#isCloseWorkerEvent(ev)) {
							self.onmessage = null;
							return;
						}
						const [data, error] = await this_.#qChannel.callback(this, async ({ isLastOnQ }) => {
							return await handler(ev, isLastOnQ);
						});
						if (error) {
							throw error;
						}
						self.postMessage(new WorkerResult(data, undefined));
					});
					if (!error) {
						return;
					}
					self.postMessage(new WorkerResult(undefined, error?.message ?? 'Unknown error'));
				};
			},
			parentPost: async () => {
				const parentPort = await WorkerThread.#parentPortRef.parentPort();
				/**
				 * @param {MessageEvent<Receive>|Receive} ev
				 * @returns {Promise<void>}
				 */
				const listener = async function (ev) {
					const [_, error] = await TryAsync(async () => {
						ev = ev instanceof MessageEvent ? ev.data : ev;
						if (WorkerThread.#isCloseWorkerEvent(ev)) {
							parentPort.off('message', listener);
							return;
						}
						const [data, error] = await this_.#qChannel.callback(this, async ({ isLastOnQ }) => {
							return await handler(ev, isLastOnQ);
						});
						if (error) {
							throw error;
						}
						parentPort.postMessage(new WorkerResult(data, undefined));
					});
					if (!error) {
						return;
					}
					parentPort.postMessage(new WorkerResult(undefined, error?.message ?? 'Unknown error'));
				};
				parentPort.on('message', listener);
			},
		}).then(([_, error]) => {
			if (!error) {
				return;
			}
			Console.error(error);
		});
	}
	/**
	 * @description
	 * - type helper;
	 * @type {(ev: Receive, isLastOnQ:boolean) => Post}
	 */
	handler;
	/**
	 * @description
	 * - helper type, hold no actual value;
	 * @type {Receive}
	 */
	Receive;
	/**
	 * @description
	 * - helper type, hold no actual value;
	 * @type {Post}
	 */
	Post;
}
