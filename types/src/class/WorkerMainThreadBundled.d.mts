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
export class WorkerMainThread<WT extends WorkerThread> {
    /**
     * @type {boolean}
     */
    static #isRegistered: boolean;
    /**
     * @param {Object} param0
     * @param {typeof WorkerMainThread["workerClass"]} param0.workerClass
     * @param {typeof WorkerMainThread["pathValidator"]} param0.pathValidator
     * @param {typeof WorkerMainThread["basePath"]} [param0.basePath]
     */
    static setup: ({ workerClass, pathValidator, basePath }: {
        workerClass: (typeof WorkerMainThread)["workerClass"];
        pathValidator: (typeof WorkerMainThread)["pathValidator"];
        basePath?: (typeof WorkerMainThread)["basePath"];
    }) => void;
    /**
     * @type {typeof Worker|typeof import('worker_threads').Worker}
     */
    static workerClass: typeof Worker | typeof import("worker_threads").Worker;
    /**
     * @type {string}
     */
    static basePath: string;
    /**
     * @type {(paths:{worker: string, root:string, base: string})=>Promise<string>}
     */
    static pathValidator: (paths: {
        worker: string;
        root: string;
        base: string;
    }) => Promise<string>;
    static #options: import("worker_threads").WorkerOptions & {
        type?: "module";
    };
    /**
     * @template {WorkerThread} WT
     * @param {string} handler
     * @param {Omit<WorkerOptions|import('worker_threads').WorkerOptions, 'eval'|'type'>} [options]
     * @returns {WorkerMainThread<WT>}
     */
    static newVivthWorker: (handler: string, options?: Omit<WorkerOptions | import("worker_threads").WorkerOptions, "eval" | "type">) => WorkerMainThread<WT_1>;
    /**
     * @param {string} handler
     * @param { WorkerOptions
     * | import('worker_threads').WorkerOptions} options
     * @param {WorkerMainThread} worker
     * @param {(any:any)=>void} listener
     * @returns {Promise<void>}
     */
    static #workerFilehandler: (handler: string, options: WorkerOptions | import("worker_threads").WorkerOptions, worker: WorkerMainThread<any>, listener: (any: any) => void) => Promise<void>;
    /**
     * @param {Parameters<typeof WorkerMainThread<WT>["newVivthWorker"]>[0]} handler
     * @param {Parameters<typeof WorkerMainThread<WT>["newVivthWorker"]>[1]} [options]
     */
    constructor(handler: Parameters<(typeof WorkerMainThread<WT>)["newVivthWorker"]>[0], options?: Parameters<(typeof WorkerMainThread<WT>)["newVivthWorker"]>[1]);
    /**
     * @type {()=>void}
     */
    terminate: () => void;
    /**
     * @type {Derived<WorkerResult<WT["POST"]>>}
     */
    receiverSignal: Derived<WorkerResult<WT["POST"]>>;
    /**
     * @type {(event: WT["RECEIVE"])=>void}
     */
    postMessage: (event: WT["RECEIVE"]) => void;
    #private;
}
export type WorkerResult<POST> = import("./WorkerResult.mjs").WorkerResult<POST>;
export type WorkerThread = import("./WorkerThread.mjs").WorkerThread<any, any>;
export type unwrapLazy = "vivth:unwrapLazy;";
import { Derived } from './Derived.mjs';
