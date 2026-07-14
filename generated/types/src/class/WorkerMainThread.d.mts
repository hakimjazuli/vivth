import { Derived } from './Derived.mjs';
export type WorkerResult<POST> = import('./WorkerResult.mjs').WorkerResult<POST>;
export type WorkerThread<RECEIVE, POST> = import('./WorkerThread.mjs').WorkerThread<RECEIVE, POST>;
export type VivthCleanup = import('../typehints/VivthCleanup.mjs').VivthCleanup;
/**
 * it supposed to be able to call on browser too
 * ```js
 * import { SafeExit } from './SafeExit.mjs';
 * ```
 * need to add cleaner for SafeExit.instance?.addCallback
 */
/**
 * @typedef {import('../typehints/VivthCleanup.mjs').VivthCleanup} VivthCleanup
 */
/**
 * @description
 * - class helper to create `Worker` instance;
 * - before any `Worker` functionaily to be used, you need to setup it with `WorkerThread.setup` and `WorkerMainThread.setup` before runing anytyhing;
 * @template {WorkerThread<any, any>} WT
 * @implements {VivthCleanup}
 */
export declare class WorkerMainThread<WT extends WorkerThread<any, any>> implements VivthCleanup {
    #private;
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
     * import { WorkerMainThread } from 'vivth/neutral';
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
    static setup: ({ workerClass, pathValidator }: {
        workerClass: typeof WorkerMainThread["workerClass"];
        pathValidator: typeof WorkerMainThread["pathValidator"];
    }) => void;
    /**
     * @description
     * - reference for `Worker` class;
     * - edit via `setup`;
     * @type {typeof Worker|typeof import('node:worker_threads').Worker}
     */
    static workerClass: typeof Worker | typeof import('node:worker_threads').Worker;
    /**
     * @description
     * - reference for validating path;
     * - edit via `setup`;
     * @type {(paths:{worker: string, root:string})=>Promise<string>}
     */
    static pathValidator: (paths: {
        worker: string;
        root: string;
    }) => Promise<string>;
    /**
     * @description
     * - create Worker_instance;
     * @param {import('../bundler/adds/PathFSBundles.mjs').PathFSBundles} handler
     * @param {Omit<WorkerOptions|import('node:worker_threads').WorkerOptions, 'eval'|'type'>} options
     * @example
     * import { WorkerMainThread } from 'vivth/neutral';
     *
     * export const myDoubleWorker = new WorkerMainThread(PathFSBundles.vivthBundles('./doubleWorkerThread.mjs'));
     */
    constructor(handler: import('../bundler/adds/PathFSBundles.mjs').PathFSBundles, options?: Omit<WorkerOptions | import('node:worker_threads').WorkerOptions, 'eval' | 'type'>);
    /**
     * @description
     * - terminate all signals that are used on this instance;
     * @return {Promise<void>}
     */
    vivthCleanup: () => Promise<void>;
    /**
     * @description
     * - result signal of the processed message;
     * @type {Derived<WorkerResult<WT["POST"]>>}
     * @example
     * import { Effect } from 'vivth/neutral';
     * import { myDoubleWorker } from './myDoubleWorker.mjs';
     *
     * const doubleReceiverSignal = myDoubleWorker.receiverSignal;
     * new Effect(async({ subscribe }) => {
     * 	const value = subscribe(doubleReceiverSignal).value;
     * 	// code
     * })
     */
    receiverSignal: Derived<WorkerResult<WT["POST"]>>;
    /**
     * @description
     * - callback to send message to the worker thread;
     * @type {(event: WT["RECEIVE"])=>void}
     * @example
     * import { myDoubleWorker } from './myDoubleWorker.mjs';
     *
     * myDoubleWorker.postMessage(90);
     */
    postMessage: (event: WT["RECEIVE"]) => void;
}
