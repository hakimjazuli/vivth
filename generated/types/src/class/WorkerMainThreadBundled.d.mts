/**
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
     * @param {Object} param0
     * @param {typeof WorkerMainThread["workerClass"]} param0.workerClass
     * @param {typeof WorkerMainThread["pathValidator"]} param0.pathValidator
     */
    static setup: ({ workerClass, pathValidator }: {
        workerClass: (typeof WorkerMainThread)["workerClass"];
        pathValidator: (typeof WorkerMainThread)["pathValidator"];
    }) => void;
    /**
     * @type {typeof Worker|typeof import('node:worker_threads').Worker}
     */
    static workerClass: typeof Worker | typeof import("node:worker_threads").Worker;
    /**
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
     * @param {PathFSFile} handler
     * @param {Omit<WorkerOptions|import('node:worker_threads').WorkerOptions, 'eval'|'type'>} options
     */
    constructor(handler: PathFSFile, options?: Omit<WorkerOptions | import("node:worker_threads").WorkerOptions, "eval" | "type">);
    /**
     * @return {void}
     */
    terminate: () => void;
    /**
     * @type {Derived<WorkerResult<WT["POST"]>>}
     */
    receiverSignal: Derived<import("./WorkerResult.mjs").WorkerResult<WT["POST"]>>;
    /**
     * @type {(event: WT["RECEIVE"])=>void}
     */
    postMessage: (event: WT["RECEIVE"]) => void;
    #private;
}
import { Derived } from './Derived.mjs';
import { PathFSFile } from '../bundler/adds/PathFSFile.mjs';
