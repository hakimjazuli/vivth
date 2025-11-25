// @ts-check

import { closeWorkerThreadEventObject } from '../common/eventObjects.mjs';
import { GetRuntime } from '../function/GetRuntime.mjs';
import { Tries } from '../function/Tries.mjs';
import { TryAsync } from '../function/TryAsync.mjs';
import { Console } from './Console.mjs';
import { Derived } from './Derived.mjs';
import { Effect } from './Effect.mjs';
import { Paths } from './Paths.mjs';
import { SafeExit } from './SafeExit.mjs';
import { Signal } from './Signal.mjs';

/**
 * @template POST
 * @typedef {import('./WorkerResult.mjs').WorkerResult<POST>} WorkerResult
 */
/**
 * @template RECEIVE
 * @template POST
 * @typedef {import('./WorkerThread.mjs').WorkerThread<RECEIVE, POST>} WorkerThread
 */
/**
 * @typedef {import('../common/lazie.mjs').unwrapLazy} unwrapLazy
 */

/**
 * @description
 * - class helper to create `Worker` instance;
 * - before any `Worker` functionaily to be used, you need to setup it with `WorkerThread.setup` and `WorkerMainThread.setup` before runing anytyhing;
 * @template {WorkerThread<any, any>} WT
 */
export class WorkerMainThread {
	/**
	 * @type {boolean}
	 */
	static #isRegistered = false;
	/**
	 * @description
	 * - need to be called first, before any `WorkerMainThread` instantiation:
	 * @param {Object} param0
	 * @param {typeof WorkerMainThread["workerClass"]} param0.workerClass
	 * - example:
	 * ```js
	 * import { Worker } from 'node:worker_threads';
	 * ```
	 * @param {typeof WorkerMainThread["pathValidator"]} param0.pathValidator
	 * - example:
	 * ```js
	 * async (workerPath, root) => {
	 *  const truePathCheck = `${root}/${base}/${workerPath}`;
	 * 	const res = await fetch(truePathCheck);
	 * 	// might also check wheter it need base or not
	 * 	return await res.ok;
	 * }
	 * ```
	 * @example
	 * import { Worker } from 'node:worker_threads';
	 * import { WorkerMainThread } from 'vivth';
	 *
	 * WorkerMainThread.setup({
	 * 	workerClass: Worker,
	 * 	pathValidator: async ({worker, root}) => {
	 * 		const res = await fetch(`${root}/${worker}`);
	 * 		if (res.ok) {
	 * 			return res
	 * 		}
	 * 		const res2 = await fetch(`${root}/someAdditionalPath/${worker}`);
	 * 		if (res2.ok) {
	 * 			return res2
	 * 		}
	 * 	},
	 * });
	 */
	static setup = ({ workerClass, pathValidator }) => {
		if (Paths.root === undefined) {
			return;
		}
		if (WorkerMainThread.#isRegistered) {
			Console.warn({ message: 'WorkerMainThread.setup, can only be called once' });
			return;
		}
		WorkerMainThread.#isRegistered = true;
		WorkerMainThread.workerClass = workerClass;
		WorkerMainThread.pathValidator = pathValidator;
	};
	/**
	 * @description
	 * - reference for `Worker` class;
	 * - edit via `setup`;
	 * @type {typeof Worker|typeof import('node:worker_threads').Worker}
	 */
	static workerClass;
	/**
	 * @description
	 * - reference for validating path;
	 * - edit via `setup`;
	 * @type {(paths:{worker: string, root:string})=>Promise<string>}
	 */
	static pathValidator;
	static #options =
		/** @type {import('node:worker_threads').WorkerOptions & { type?: 'module' }} */ ({
			type: 'module',
		});
	/**
	 * @template {WorkerThread<any, any>} WT
	 * @description
	 * - create Worker_instance;
	 * @param {string} handler
	 * @param {Omit<WorkerOptions|import('node:worker_threads').WorkerOptions, 'eval'|'type'>} [options]
	 * @returns {WorkerMainThread<WT>}
	 * @example
	 * import { WorkerMainThread } from 'vivth';
	 *
	 * export const myDoubleWorker = WorkerMainThread.newVivthWorker('./doubleWorkerThread.mjs');
	 */
	static newVivthWorker(handler, options = {}) {
		return new WorkerMainThread(handler, options);
	}
	/**
	 * @private
	 * @param {Parameters<typeof WorkerMainThread<WT>["newVivthWorker"]>[0]} handler
	 * @param {Parameters<typeof WorkerMainThread<WT>["newVivthWorker"]>[1]} [options]
	 * @example
	 * import { WorkerMainThread } from 'vivth';
	 *
	 * export const myDoubleWorker = WorkerMainThread.newVivthWorker('./doubleWorkerThread.mjs');
	 */
	constructor(handler, options = {}) {
		/**
		 * @param {any} ev
		 * @returns {void}
		 */
		const listener = (ev) => {
			this.#proxyReceiver.value = ev;
		};
		WorkerMainThread.#workerFilehandler(handler, options, this, listener);
	}
	/**
	 * @type {import('./Signal.mjs').Signal<import('./WorkerResult.mjs').WorkerResult<WT["POST"]>|MessageEvent<import('./WorkerResult.mjs').WorkerResult<WT["POST"]>>>}
	 */
	// @ts-expect-error
	#proxyReceiver = new Signal(undefined);
	/**
	 * @template {WorkerThread<any, any>} WT
	 * @param {string} handler
	 * @param { WorkerOptions
	 * | import('node:worker_threads').WorkerOptions} options
	 * @param {WorkerMainThread<WT>} worker
	 * @param {(any:any)=>void} listener
	 * @returns {Promise<void>}
	 */
	static async #workerFilehandler(handler, options, worker, listener) {
		let resolvedPath;
		const pathValidator = WorkerMainThread.pathValidator;
		const [resolvedPath_, error] = await TryAsync(async () => {
			if (Paths.root === undefined) {
				throw new Error('path root undefined');
			}
			return await pathValidator({
				worker: handler,
				root: Paths.root,
			});
		});
		if (error) {
			Console.error({
				error,
				pathValidator,
				message: 'invalid pathValidator inputed to `WorkerMainThread`;',
			});
			return;
		}
		resolvedPath = resolvedPath_;
		const runtime = GetRuntime();
		const workerClass = WorkerMainThread.workerClass;
		if (
			//
			!workerClass
		) {
			Console.error('invalid `Worker` inputed to `WorkerMainThread`;');
			return;
		}
		const [, errorCreatingWorker] = await Tries({
			browser: async () => {
				if (runtime !== 'browser') {
					throw new Error('not a browser');
				}
				let worker_;
				worker_ = worker.#worker.value = new workerClass(
					resolvedPath,
					// @ts-expect-error
					{
						...options,
						...WorkerMainThread.#options,
					}
				);
				if ('onmessage' in worker_ === false) {
					throw new Error('not a browser');
				}
				worker_.onmessage = listener;
				if (SafeExit.instance) {
					SafeExit.instance.addCallback(async () => {
						worker_.onmessage = null;
					});
				}
			},
			nonBrowser: async () => {
				const worker_ = (worker.#worker.value = new workerClass(
					resolvedPath,
					// @ts-expect-error
					{
						...options,
						...WorkerMainThread.#options,
					}
				));
				if ('addEventListener' in worker_) {
					worker_.addEventListener('message', listener);
					if (SafeExit.instance) {
						SafeExit.instance.addCallback(async () => {
							worker_.removeEventListener('message', listener);
						});
					}
				} else if ('addListener' in worker_) {
					worker_.addListener('message', listener);
					if (SafeExit.instance) {
						SafeExit.instance.addCallback(async () => {
							worker_.removeListener('message', listener);
						});
					}
				} else {
					throw new Error('not a standard non browser');
				}
			},
		});
		if (errorCreatingWorker) {
			Console.error(errorCreatingWorker);
			return;
		}
		if (SafeExit.instance) {
			SafeExit.instance.addCallback(async () => {
				if (worker.#worker.value) {
					worker.#worker.value.postMessage(closeWorkerThreadEventObject, []);
				}
				await worker.terminate(true);
			});
		}
	}
	/**
	 * lazyly generated because node version need to await
	 * @type {Signal<Worker | import('node:worker_threads').Worker>}
	 */
	// @ts-expect-error
	#worker = new Signal(undefined);
	/**
	 * @type {Signal<WT["RECEIVE"]>}
	 */
	#proxyPost = new Signal(undefined);
	#handler = new Effect(async ({ subscribe }) => {
		const postData = subscribe(this.#proxyPost).value;
		const worker = subscribe(this.#worker).value;
		if (worker === undefined || postData === undefined) {
			return;
		}
		worker.postMessage(postData, []);
	});
	/**
	 * @description
	 * - terminate all signals that are used on this instance;
	 * @param {boolean} terminateAllReactivity
	 * - false: only terminate `Worker` instance;
	 * - true: also terminate `Signal`s and `Effect`s;
	 * @return {Promise<void>}
	 */
	terminate = async (terminateAllReactivity) => {
		/**
		 * this is more for browser, as most of this are automatically cleaned with `SafeExit`;
		 */
		await this.#worker.value?.terminate();
		if (!terminateAllReactivity) {
			return;
		}
		this.#worker.remove.ref();
		this.#handler.options.removeEffect();
		this.#proxyPost.remove.ref();
		this.#proxyReceiver.remove.ref();
		this.receiverSignal.remove.ref();
	};
	/**
	 * @description
	 * - result signal of the processed message;
	 * @type {Derived<WorkerResult<WT["POST"]>>}
	 * @example
	 * import { Effect } from 'vivth';
	 * import { myDoubleWorker } from './myDoubleWorker.mjs';
	 *
	 * const doubleReceiverSignal = myDoubleWorker.receiverSignal;
	 * new Effect(async({ subscribe }) => {
	 * 	const value = subscribe(doubleReceiverSignal).value;
	 * 	// code
	 * })
	 */
	receiverSignal = new Derived(async ({ subscribe }) => {
		const val = subscribe(this.#proxyReceiver).value;
		if (val instanceof MessageEvent) {
			return val.data;
		}
		return val;
	});
	/**
	 * @description
	 * - callback to send message to the worker thread;
	 * @type {(event: WT["RECEIVE"])=>void}
	 * @example
	 * import { myDoubleWorker } from './myDoubleWorker.mjs';
	 *
	 * myDoubleWorker.postMessage(90);
	 */
	postMessage = (data) => {
		this.#proxyPost.value = data;
	};
}
