// @ts-check

import { closeWorkerThreadEventObject } from '../common/eventObjects.mjs';
import { EventCheck } from '../function/EventCheck.mjs';
import { Tries } from '../function/Tries.mjs';
import { TryAsync } from '../function/TryAsync.mjs';
import { Console } from './Console.mjs';
import { QChannel } from './QChannel.mjs';
import { WorkerResult } from './WorkerResult.mjs';

/**
 * @description
 * - class helper for `WorkerThread` creation;
 * - before any `Worker` functionaily to be used, you need to setup it with `WorkerThread.setup` and `WorkerMainThread.setup` before runing anytyhing;
 * @template RECEIVE
 * @template POST
 */
export class WorkerThread {
	/**
	 * @typedef {import('../types/QCBReturn.mjs').QCBReturn} QCBReturn
	 */
	/**
	 * @type {Parameters<typeof WorkerThread["setup"]>[0]|undefined}
	 */
	static #refs;
	/**
	 * @description
	 * - need to be called and exported as new `WorkerThread` class reference;
	 * @template RECEIVE
	 * @template POST
	 * @param {{parentPort:import('node:worker_threads')["parentPort"]}} refs
	 * -example:
	 * ```js
	 * import { parentPort } from 'node:worker_threads';
	 * ```
	 * @returns {typeof WorkerThread<RECEIVE, POST>}
	 * @example
	 * import { WorkerThread } from 'vivth';
	 * import { parentPort } from 'node:worker_threads';
	 *
	 * export const MyWorkerThreadRef = WorkerThread.setup({ parentPort });
	 */
	static setup(refs) {
		WorkerThread.#refs = refs;
		return WorkerThread;
	}
	/**
	 * @returns {QChannel<WorkerThread>}
	 */
	#qChannel = new QChannel('`WorkerThread` individuals');
	/**
	 * @param {any} ev
	 */
	static #isCloseWorkerEvent = (ev) => {
		return EventCheck(ev, closeWorkerThreadEventObject);
	};
	/**
	 * @description
	 * - instantiate via created class from `setup` static method;
	 * @param {WorkerThread<RECEIVE, POST>["handler"]} handler
	 * @example
	 * import { MyWorkerThread } from './MyWorkerThread.mjs';
	 *
	 * const handler = async (ev, isLastOnQ) => {
	 * 	// if(!isLastOnQ()) {
	 * 	// 	return null; // can be used for imperative debouncing;
	 * 	// }
	 * 	// await fetch('some/path')
	 * 	// if(!isLastOnQ()) {
	 * 	// 	return;
	 * 	// }
	 * 	return ev = ev \* 2;
	 * }
	 * new MyWorkerThread(handler);
	 */
	constructor(handler) {
		this.handler = handler;
		const this_ = this;
		Tries({
			post: async () => {
				/**
				 * @param {MessageEvent<RECEIVE>|RECEIVE} ev
				 * @returns {Promise<void>}
				 */
				// @ts-expect-error
				self.onmessage = async function (ev) {
					const [, error] = await TryAsync(async () => {
						ev = ev instanceof MessageEvent ? ev.data : ev;
						if (WorkerThread.#isCloseWorkerEvent(ev)) {
							this_.#qChannel.close();
							// @ts-expect-error
							self.onmessage = null;
							return;
						}
						const [data, error] = await this_.#qChannel.callback(this, async ({ isLastOnQ }) => {
							// @ts-expect-error
							return await handler(ev, isLastOnQ);
						});
						if (error) {
							throw error;
						}
						// @ts-expect-error
						self.postMessage(new WorkerResult(data, undefined));
					});
					if (error === undefined) {
						return;
					}
					// @ts-expect-error
					self.postMessage(new WorkerResult(undefined, error?.message ?? 'Unknown error'));
				};
			},
			parentPost: async () => {
				if (WorkerThread.#refs === undefined) {
					return;
				}
				const { parentPort } = WorkerThread.#refs;
				if (parentPort === null) {
					return;
				}
				/**
				 * @param {MessageEvent<RECEIVE>|RECEIVE} ev
				 * @returns {Promise<void>}
				 */
				const listener = async function (ev) {
					const [, error] = await TryAsync(async () => {
						ev = ev instanceof MessageEvent ? ev.data : ev;
						if (WorkerThread.#isCloseWorkerEvent(ev)) {
							this_.#qChannel.close();
							parentPort.off('message', listener);
							return;
						}
						const [data, error] = await this_.#qChannel.callback(this_, async ({ isLastOnQ }) => {
							// @ts-expect-error
							return await handler(ev, isLastOnQ);
						});
						if (error) {
							throw error;
						}
						parentPort.postMessage(new WorkerResult(data, undefined));
					});
					if (error === undefined) {
						return;
					}
					parentPort.postMessage(new WorkerResult(undefined, error?.message ?? 'Unknown error'));
				};
				parentPort.on('message', listener);
			},
		}).then(([, error]) => {
			if (error === undefined) {
				return;
			}
			Console.error(error);
		});
	}
	/**
	 * @description
	 * - type helper;
	 * @type {(ev: RECEIVE, isLastOnQ:QCBReturn["isLastOnQ"]) => Promise<POST>}
	 */
	handler;
	/**
	 * @description
	 * - helper type, hold no actual value;
	 * @type {RECEIVE}
	 */
	// @ts-expect-error
	RECEIVE;
	/**
	 * @description
	 * - helper type, hold no actual value;
	 * @type {POST}
	 */
	// @ts-expect-error
	POST;
}
