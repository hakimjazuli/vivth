/**
 * @description
 * - class helper to create `Worker` instance;
 * - before any `Worker` functionaily to be used, you need to setup it with `WorkerThread.setup` and `WorkerMainThread.setup` before runing anytyhing;
 * @template {WorkerThread<any, any>} WT
 */
export class WorkerMainThread<WT extends import("./WorkerThread.mjs").WorkerThread<any, any>> {
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
     * @type {boolean}
     */
    static "__#private@#isRegistered": boolean;
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
    static setup: ({ workerClass, pathValidator }: {
        workerClass: (typeof WorkerMainThread)["workerClass"];
        pathValidator: (typeof WorkerMainThread)["pathValidator"];
    }) => void;
    /**
     * @description
     * - reference for `Worker` class;
     * - edit via `setup`;
     * @type {typeof Worker|typeof import('node:worker_threads').Worker}
     */
    static workerClass: typeof Worker | typeof import("node:worker_threads").Worker;
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
    static "__#private@#options": import("node:worker_threads").WorkerOptions & {
        type?: "module";
    };
    /**
     * @template {WorkerThread<any, any>} WT
     * @param {string} handler
     * @param { WorkerOptions
     * | import('node:worker_threads').WorkerOptions} options
     * @param {WorkerMainThread<WT>} worker
     * @param {(any:any)=>void} listener
     * @returns {Promise<void>}
     */
    static "__#private@#workerFilehandler"<WT_1 extends import("./WorkerThread.mjs").WorkerThread<any, any>>(handler: string, options: WorkerOptions | import("node:worker_threads").WorkerOptions, worker: WorkerMainThread<WT_1>, listener: (any: any) => void): Promise<void>;
    /**
     * @description
     * - create Worker_instance;
     * @param {import('../bundler/adds/PathFSBundles.mjs').PathFSBundles} handler
     * @param {Omit<WorkerOptions|import('node:worker_threads').WorkerOptions, 'eval'|'type'>} options
     * @example
     * import { WorkerMainThread } from 'vivth';
     *
     * export const myDoubleWorker = new WorkerMainThread(PathFSBundles.vivthBundles('./doubleWorkerThread.mjs'));
     */
    constructor(handler: import("../bundler/adds/PathFSBundles.mjs").PathFSBundles, options?: Omit<WorkerOptions | import("node:worker_threads").WorkerOptions, "eval" | "type">);
    /**
     * @description
     * - terminate all signals that are used on this instance;
     * @return {void}
     */
    terminate: () => void;
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
    receiverSignal: Derived<import("./WorkerResult.mjs").WorkerResult<WT["POST"]>>;
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
    #private;
}
import { Derived } from './Derived.mjs';
