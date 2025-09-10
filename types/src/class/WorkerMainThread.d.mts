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
export class WorkerMainThread<WT extends WorkerThread> {
    static "__#11@#isRegistered": boolean;
    /**
     * @description
     * - need to be called first, before any `WorkerMainThread` instantiation:
     * @param {Object} param0
     * @param {typeof WorkerMainThread["workerClass"]} param0.workerClass
     * @param {typeof WorkerMainThread["pathValidator"]} param0.pathValidator
     * ```js
     *	async(relativePath) => {
     *		// verify whether relativePath exist, then return the full path
     *		// use fetch | fs, chained with Paths.instance.root + WorkerMainThread.basePath;
     *	}
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
    static setup: ({ workerClass, pathValidator, basePath }: {
        workerClass: (typeof WorkerMainThread)["workerClass"];
        pathValidator: (typeof WorkerMainThread)["pathValidator"];
        basePath?: (typeof WorkerMainThread)["basePath"];
    }) => void;
    /**
     * @description
     * - reference for `Worker` class;
     * - edit via `setup`;
     * @type {()=>Promise<typeof Worker|typeof import('worker_threads').Worker>}
     */
    static workerClass: () => Promise<typeof Worker | typeof import("worker_threads").Worker>;
    /**
     * @description
     * - reference for worker file `basePath`;
     * - edit via `setup`;
     * @type {string}
     */
    static basePath: string;
    /**
     * @description
     * - reference for validating path;
     * - edit via `setup`;
     * @type {(paths:{worker: string, root:string, base: string})=>Promise<string>}
     */
    static pathValidator: (paths: {
        worker: string;
        root: string;
        base: string;
    }) => Promise<string>;
    static "__#11@#options": import("worker_threads").WorkerOptions & {
        type?: "module";
    };
    /**
     * @param {string} handler
     * @param { WorkerOptions
     * | import('worker_threads').WorkerOptions} options
     * @param {WorkerMainThread} worker
     * @param {(any:any)=>void} listener
     * @param {boolean} isInline
     * @returns {Promise<void>}
     */
    static "__#11@#workerFilehandler": (handler: string, options: WorkerOptions | import("worker_threads").WorkerOptions, worker: WorkerMainThread<any>, listener: (any: any) => void, isInline: boolean) => Promise<void>;
    /**
     * @type {boolean}
     */
    static "__#11@#isBrowser": boolean;
    /**
     * @description
     * - check whether js run in browser
     * @type {boolean}
     */
    static get isBrowser(): boolean;
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
    constructor(handler: string, options?: Omit<WorkerOptions | import("worker_threads").WorkerOptions, "eval" | "type">, isInline?: boolean);
    /**
     * @description
     * - terminate all signals that are used on this instance;
     * @type {()=>void}
     */
    terminate: () => void;
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
    receiverSignal: Derived<WorkerResult<WT["Post"]>>;
    /**
     * @description
     * - callback to send message to the worker thread;
     * @type {(event: WT["Receive"])=>void}
     * @example
     * import { myDoubleWorker } from './myDoubleWorker.mjs';
     *
     * myDoubleWorker.postMessage(90);
     */
    postMessage: (event: WT["Receive"]) => void;
    #private;
}
export type WorkerResult<A> = import("./WorkerResult.mjs").WorkerResult<A>;
export type WorkerThread = import("./WorkerThread.mjs").WorkerThread<any, any>;
import { Derived } from './Derived.mjs';
