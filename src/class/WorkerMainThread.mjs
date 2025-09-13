// @ts-check

import { Base64URL } from '../common/Base64URL.mjs';
import { closeWorkerThreadEventObject } from '../common/eventObjects.mjs';
import { Try } from '../function/Try.mjs';
import { TryAsync } from '../function/TryAsync.mjs';
import { Console } from './Console.mjs';
import { Derived } from './Derived.mjs';
import { Effect } from './Effect.mjs';
import { Paths } from './Paths.mjs';
import { SafeExit } from './SafeExit.mjs';
import { Signal } from './Signal.mjs';

/**
 * @template A
 * @typedef {import('./WorkerResult.mjs').WorkerResult<A>} WorkerResult
 */
/**
 * @typedef {import('./WorkerThread.mjs').WorkerThread} WorkerThread
 */

/**
 * @description
 * - class helper to create `Worker` instance;
 * @template {WorkerThread} WT
 */
export class WorkerMainThread {
	static #isRegistered = false;
	/**
	 * @description
	 * - need to be called first, before any `WorkerMainThread` instantiation:
	 * @param {Object} param0
	 * @param {typeof WorkerMainThread["workerClass"]} param0.workerClass
	 * - example:
	 * ```js
	 * async () => await (import('worker_threads')).Worker
	 * ```
	 * @param {typeof WorkerMainThread["pathValidator"]} param0.pathValidator
	 * - example:
	 * ```js
	 * async (workerPath, root, base) => {
	 * 	const res = await fetch(`${root}/${base}/${workerPath}`);
	 * 	// might also check wheter it need base or not
	 * 	return await res.ok;
	 * }
	 * ```
	 * @param {typeof WorkerMainThread["basePath"]} [param0.basePath]
	 * - additonal realtivePath from rootPath;
	 * - default: '';
	 * @example
	 * import { WorkerMainThread } from 'vivth';
	 *
	 * WorkerMainThread.setup({
	 * 	workerClass: async () => await (import('worker_threads')).Worker,
	 * 	basePath: 'public/assets/js/workers',
	 * 	pathValidator: async (workerPath, root, base) => {
	 * 		const res = await fetch(`${root}/${base}/${workerPath}`);
	 * 		// might also check wheter it need base or not
	 * 		return await res.ok;
	 * 	},
	 * });
	 */
	static setup = ({ workerClass, pathValidator, basePath = '' }) => {
		if (!Paths.root) {
			return;
		}
		if (WorkerMainThread.#isRegistered) {
			Console.warn({ message: 'WorkerMainThread.setup, can only be called once' });
			return;
		}
		WorkerMainThread.#isRegistered = true;
		WorkerMainThread.workerClass = workerClass;
		WorkerMainThread.pathValidator = pathValidator;
		WorkerMainThread.basePath = basePath;
	};
	/**
	 * @description
	 * - reference for `Worker` class;
	 * - edit via `setup`;
	 * @type {()=>Promise<typeof Worker|typeof import('worker_threads').Worker>}
	 */
	static workerClass;
	/**
	 * @description
	 * - reference for worker file `basePath`;
	 * - edit via `setup`;
	 * @type {string}
	 */
	static basePath;
	/**
	 * @description
	 * - reference for validating path;
	 * - edit via `setup`;
	 * @type {(paths:{worker: string, root:string, base: string})=>Promise<string>}
	 */
	static pathValidator;
	static #options = /** @type {import('worker_threads').WorkerOptions & { type?: 'module' }} */ ({
		type: 'module',
	});
	/**
	 * @description
	 * - create Worker_instance;
	 * @param {string} handler
	 * - if `isInline` === `false`, `handler` should be:
	 * >- pointing to worker thread file; WHICH
	 * >- the path must be relative to `projectRoot`;
	 * - if `isInline` === `true`, `handler` should be
	 * >- string literal of prebundled worker thread script; OR
	 * >- manually made string literal of worker thread script;
	 * @param {Omit<WorkerOptions|import('worker_threads').WorkerOptions, 'eval'|'type'>} [options]
	 * @param {boolean} [isInline]
	 * @example
	 * import { WorkerMainThread } from 'vivth';
	 *
	 * export const myDoubleWorker = new WorkerMainThread('./doubleWorkerThread.mjs');
	 */
	constructor(handler, options = {}, isInline = false) {
		/**
		 * @param {WT["Receive"]} ev
		 * @returns {void}
		 */
		const listener = (ev) => {
			this.#proxyReceiver.value = ev;
		};
		WorkerMainThread.#workerFilehandler(handler, options, this, listener, isInline);
	}
	/**
	 * @type {import('./Signal.mjs').Signal<import('./WorkerResult.mjs').WorkerResult<WT["Post"]>|MessageEvent<import('./WorkerResult.mjs').WorkerResult<WT["Post"]>>>}
	 */
	#proxyReceiver = new Signal(undefined);
	/**
	 * @param {string} handler
	 * @param { WorkerOptions
	 * | import('worker_threads').WorkerOptions} options
	 * @param {WorkerMainThread} worker
	 * @param {(any:any)=>void} listener
	 * @param {boolean} isInline
	 * @returns {Promise<void>}
	 */
	static #workerFilehandler = async (handler, options, worker, listener, isInline) => {
		let resolvedPath;
		if (!isInline) {
			const pathValidator = WorkerMainThread.pathValidator;
			const [resolvedPath_, error] = await TryAsync(async () => {
				return await pathValidator({
					worker: handler,
					root: Paths.root,
					base: WorkerMainThread.basePath,
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
		} else {
			WorkerMainThread.#options.eval = true;
			resolvedPath = handler;
		}
		const [_1, error1] = await Try({
			universal: async () => {
				const WorkerClass = await WorkerMainThread.workerClass();
				if (!WorkerClass) {
					throw new Error('invalid `Worker` inputed to `WorkerMainThread`;');
				}
				const [_2, error2] = await Try({
					browser: async () => {
						if (!WorkerMainThread.isBrowser) {
							throw new Error('not a browser');
						}
						let worker_;
						if (!isInline) {
							worker_ = worker.#worker.value = new WorkerClass(resolvedPath, {
								...options,
								...WorkerMainThread.#options,
							});
						} else {
							const inlineURL = Base64URL(handler, 'application/javascript', btoa);
							worker_ = worker.#worker.value = new WorkerClass(inlineURL, {
								...options,
								...WorkerMainThread.#options,
							});
						}
						if (!('onmessage' in worker_)) {
							throw new Error();
						}
						worker_.onmessage = listener;
						if (SafeExit.instance) {
							SafeExit.instance.addCallback(async () => {
								worker_.onmessage = null;
							});
						}
					},
					nonBrowser: async () => {
						const worker_ = (worker.#worker.value = new WorkerClass(resolvedPath, {
							...options,
							...WorkerMainThread.#options,
						}));
						if (!('addEventListener' in worker_)) {
							throw new Error();
						}
						worker_.addEventListener('message', listener);
						if (SafeExit.instance) {
							SafeExit.instance.addCallback(async () => {
								worker_.removeEventListener('message', listener);
							});
						}
					},
				});
				if (error2) {
					throw new Error();
				}
				if (SafeExit.instance) {
					SafeExit.instance.addCallback(async () => {
						worker.#worker.value.postMessage(closeWorkerThreadEventObject);
						worker.terminate();
					});
				}
			},
			nodeOrBun: async () => {
				if (!worker.#worker.value) {
					const { Worker } = await import('node:worker_threads');
					worker.#worker.value = new Worker(resolvedPath, {
						...options,
						...WorkerMainThread.#options,
					});
				}
				const worker_ = worker.#worker.value;
				// @ts-expect-error
				worker_.addListener('message', listener);
				if (SafeExit.instance) {
					SafeExit.instance.addCallback(async () => {
						// @ts-expect-error
						worker_.removeListener('message', listener);
						worker_.postMessage(closeWorkerThreadEventObject);
						worker.terminate();
					});
				}
			},
		});
		if (error1) {
			Console.error(error1);
			return;
		}
	};
	/**
	 * @type {boolean}
	 */
	static #isBrowser = undefined;
	/**
	 * @description
	 * - check whether js run in browser
	 * @type {boolean}
	 */
	static get isBrowser() {
		if (WorkerMainThread.#isBrowser === undefined) {
			WorkerMainThread.#isBrowser =
				typeof window !== 'undefined' &&
				typeof location === 'object' &&
				typeof location.origin === 'string';
		}
		return WorkerMainThread.#isBrowser;
	}
	/**
	 * lazyly generated because node version need to await
	 * @type {Signal<Worker | import('worker_threads').Worker>}
	 */
	#worker = new Signal(undefined);
	/**
	 * @type {Signal<WT["Receive"]>}
	 */
	#proxyPost = new Signal(undefined);
	#handler = new Effect(async ({ subscribe }) => {
		const postData = subscribe(this.#proxyPost).value;
		const worker = subscribe(this.#worker).value;
		if (!worker || postData === undefined) {
			return;
		}
		worker.postMessage(postData);
	});
	/**
	 * @description
	 * - terminate all signals that are used on this instance;
	 * @type {()=>void}
	 */
	terminate = () => {
		/**
		 * this is more for browser, as most of this are automatically cleaned with `SafeExit`;
		 */
		this.#worker.value?.terminate();
		this.#worker.remove.ref();
		this.#handler.options.removeEffect();
		this.#proxyPost.remove.ref();
		this.#proxyReceiver.remove.ref();
		this.receiverSignal.remove.ref();
	};
	/**
	 * @description
	 * - result signal of the processed message;
	 * @type {Derived<WorkerResult<WT["Post"]>>}
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
	 * @type {(event: WT["Receive"])=>void}
	 * @example
	 * import { myDoubleWorker } from './myDoubleWorker.mjs';
	 *
	 * myDoubleWorker.postMessage(90);
	 */
	postMessage = (data) => {
		this.#proxyPost.value = data;
	};
}
