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
export class WorkerMainThread<WT extends WorkerThread<any, any>> {
    /**
     * @type {boolean}
     */
    static #isRegistered: boolean;
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
     * @type {typeof Worker|typeof import('worker_threads').Worker}
     */
    static workerClass: typeof Worker | typeof import("worker_threads").Worker;
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
    static #options: import("worker_threads").WorkerOptions & {
        type?: "module";
    };
    /**
     * @template {WorkerThread<any, any>} WT
     * @description
     * - create Worker_instance;
     * @param {string} handler
     * @param {Omit<WorkerOptions|import('worker_threads').WorkerOptions, 'eval'|'type'>} [options]
     * @returns {WorkerMainThread<WT>}
     * @example
     * import { WorkerMainThread } from 'vivth';
     *
     * export const myDoubleWorker = WorkerMainThread.newVivthWorker('./doubleWorkerThread.mjs');
     */
    static newVivthWorker<WT_1 extends WorkerThread<any, any>>(handler: string, options?: Omit<WorkerOptions | import("worker_threads").WorkerOptions, "eval" | "type">): WorkerMainThread<WT_1>;
    /**
     * @template {WorkerThread<any, any>} WT
     * @param {string} handler
     * @param { WorkerOptions
     * | import('worker_threads').WorkerOptions} options
     * @param {WorkerMainThread<WT>} worker
     * @param {(any:any)=>void} listener
     * @returns {Promise<void>}
     */
    static #workerFilehandler<WT_1 extends WorkerThread<any, any>>(handler: string, options: WorkerOptions | import("worker_threads").WorkerOptions, worker: WorkerMainThread<WT_1>, listener: (any: any) => void): Promise<void>;
    /**
     * @private
     * @param {Parameters<typeof WorkerMainThread<WT>["newVivthWorker"]>[0]} handler
     * @param {Parameters<typeof WorkerMainThread<WT>["newVivthWorker"]>[1]} [options]
     * @example
     * import { WorkerMainThread } from 'vivth';
     *
     * export const myDoubleWorker = WorkerMainThread.newVivthWorker('./doubleWorkerThread.mjs');
     */
    private constructor();
    /**
     * @description
     * - terminate all signals that are used on this instance;
     * @type {()=>void}
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
    #private;
}
export type WorkerResult<POST> = import("./WorkerResult.mjs").WorkerResult<POST>;
export type WorkerThread<RECEIVE, POST> = import("./WorkerThread.mjs").WorkerThread<RECEIVE, POST>;
export type unwrapLazy = "vivth:unwrapLazy;";
import { Derived } from './Derived.mjs';
