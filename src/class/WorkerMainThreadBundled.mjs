// @ts-check

import { FSInline } from '../bundler/FSInline.mjs';
import { Base64URL } from '../common/Base64URL.mjs';
import { closeWorkerThreadEventObject } from '../common/eventObjects.mjs';
import { GetRuntime } from '../function/GetRuntime.mjs';
import { Try } from '../function/Try.mjs';
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
 * @typedef {import('./WorkerThread.mjs').WorkerThread} WorkerThread
 * @typedef {import('../common/lazie.mjs').unwrapLazy} unwrapLazy
 */

/**
 * @template {WorkerThread} WT
 */
export class WorkerMainThread {
	/**
	 * @type {boolean}
	 */
	static #isRegistered = false;
	/**
	 * @param {Object} param0
	 * @param {typeof WorkerMainThread["workerClass"]} param0.workerClass
	 * @param {typeof WorkerMainThread["pathValidator"]} param0.pathValidator
	 */
	static setup = ({ workerClass, pathValidator }) => {
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
	};
	/**
	 * @type {typeof Worker|typeof import('worker_threads').Worker}
	 */
	static workerClass;
	/**
	 * @type {(paths:{worker: string, root:string})=>Promise<string>}
	 */
	static pathValidator;
	static #options = /** @type {import('worker_threads').WorkerOptions & { type?: 'module' }} */ ({
		type: 'module',
	});
	/**
	 * @template {WorkerThread} WT
	 * @param {string} handler
	 * @param {Omit<WorkerOptions|import('worker_threads').WorkerOptions, 'eval'|'type'>} [options]
	 * @returns {WorkerMainThread<WT>}
	 */
	static newVivthWorker = (handler, options = {}) => {
		return new WorkerMainThread(handler, options);
	};
	/**
	 * @param {Parameters<typeof WorkerMainThread<WT>["newVivthWorker"]>[0]} handler
	 * @param {Parameters<typeof WorkerMainThread<WT>["newVivthWorker"]>[1]} [options]
	 */
	constructor(handler, options = {}) {
		/**
		 * @param {WT["RECEIVE"]} ev
		 * @returns {void}
		 */
		const listener = (ev) => {
			this.#proxyReceiver.value = ev;
		};
		WorkerMainThread.#workerFilehandler(handler, options, this, listener);
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
	 * @returns {Promise<void>}
	 */
	static #workerFilehandler = async (handler, options, worker, listener) => {
		let resolvedPath;
		WorkerMainThread.#options.eval = true;
		resolvedPath = (await FSInline.vivthFSInlineFile(handler)).toString('utf-8');
		const runtime = GetRuntime();
		const workerClass = WorkerMainThread.workerClass;
		if (!workerClass) {
			Console.error('invalid `Worker` inputed to `WorkerMainThread`;');
			return;
		}
		const [, errorCreatingWorker] = await Try({
			browser: async () => {
				if (runtime !== 'browser') {
					throw new Error('not a browser');
				}
				let worker_;
				const inlineURL = Base64URL(handler, 'application/javascript', btoa);
				worker_ = worker.#worker.value = new workerClass(inlineURL, {
					...options,
					...WorkerMainThread.#options,
				});
				if (!('onmessage' in worker_)) {
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
				const worker_ = (worker.#worker.value = new workerClass(resolvedPath, {
					...options,
					...WorkerMainThread.#options,
				}));
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
					worker.#worker.value.postMessage(closeWorkerThreadEventObject);
				}
				worker.terminate();
			});
		}
	};
	/**
	 * lazyly generated because node version need to await
	 * @type {Signal<Worker | import('worker_threads').Worker>}
	 */
	#worker = new Signal(undefined);
	/**
	 * @type {Signal<WT["RECEIVE"]>}
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
	 * @type {Derived<WorkerResult<WT["POST"]>>}
	 */
	receiverSignal = new Derived(async ({ subscribe }) => {
		const val = subscribe(this.#proxyReceiver).value;
		if (val instanceof MessageEvent) {
			return val.data;
		}
		return val;
	});
	/**
	 * @type {(event: WT["RECEIVE"])=>void}
	 */
	postMessage = (data) => {
		this.#proxyPost.value = data;
	};
}
