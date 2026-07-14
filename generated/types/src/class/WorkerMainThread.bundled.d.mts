import { PathFSFile } from '../bundler/adds/PathFSFile.mjs';
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
 * @template {WorkerThread<any, any>} WT
 * @implements {VivthCleanup}
 */
export declare class WorkerMainThread<WT extends WorkerThread<any, any>> implements VivthCleanup {
    #private;
    /**
     * @param {Object} param0
     * @param {typeof WorkerMainThread["workerClass"]} param0.workerClass
     * @param {typeof WorkerMainThread["pathValidator"]} param0.pathValidator
     */
    static setup: ({ workerClass, pathValidator }: {
        workerClass: typeof WorkerMainThread["workerClass"];
        pathValidator: typeof WorkerMainThread["pathValidator"];
    }) => void;
    /**
     * @type {typeof Worker|typeof import('node:worker_threads').Worker}
     */
    static workerClass: typeof Worker | typeof import('node:worker_threads').Worker;
    /**
     * @type {(paths:{worker: string, root:string})=>Promise<string>}
     */
    static pathValidator: (paths: {
        worker: string;
        root: string;
    }) => Promise<string>;
    /**
     * @param {PathFSFile} handler
     * @param {Omit<WorkerOptions|import('node:worker_threads').WorkerOptions, 'eval'|'type'>} options
     */
    constructor(handler: PathFSFile, options?: Omit<WorkerOptions | import('node:worker_threads').WorkerOptions, 'eval' | 'type'>);
    /**
     * @return {Promise<void>}
     */
    vivthCleanup: () => Promise<void>;
    /**
     * @type {Derived<WorkerResult<WT["POST"]>>}
     */
    receiverSignal: Derived<WorkerResult<WT["POST"]>>;
    /**
     * @type {(event: WT["RECEIVE"])=>void}
     */
    postMessage: (event: WT["RECEIVE"]) => void;
}
