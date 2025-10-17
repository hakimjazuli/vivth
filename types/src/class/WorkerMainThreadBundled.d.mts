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
 * @template {WorkerThread<any, any>} WT
 */
export class WorkerMainThread<WT extends WorkerThread<any, any>> {
    /**
     * @type {boolean}
     */
    static #isRegistered: boolean;
    /**
     * @param {Object} param0
     * @param {typeof WorkerMainThread["workerClass"]} param0.workerClass
     * @param {typeof WorkerMainThread["pathValidator"]} param0.pathValidator
     */
    static setup: ({ workerClass, pathValidator }: {
        workerClass: (typeof WorkerMainThread)["workerClass"];
        pathValidator: (typeof WorkerMainThread)["pathValidator"];
    }) => void;
    /**
     * @type {typeof Worker|typeof import('worker_threads').Worker}
     */
    static workerClass: typeof Worker | typeof import("worker_threads").Worker;
    /**
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
     * @param {string} handler
     * @param {Omit<WorkerOptions|import('worker_threads').WorkerOptions, 'eval'|'type'>} [options]
     * @returns {WorkerMainThread<WT>}
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
export type WorkerThread<RECEIVE, POST> = import("./WorkerThread.mjs").WorkerThread<RECEIVE, POST>;
export type unwrapLazy = "vivth:unwrapLazy;";
import { Derived } from './Derived.mjs';
