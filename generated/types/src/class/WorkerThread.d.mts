export type QCBReturn = import('../typehints/QCBReturn.mjs').QCBReturn;
export type VivthCleanup = import('../typehints/VivthCleanup.mjs').VivthCleanup;
/**
 * @typedef { import('../typehints/VivthCleanup.mjs').VivthCleanup } VivthCleanup
 */
/**
 * @description
 * - class helper for `WorkerThread` creation;
 * - before any `Worker` functionaily to be used, you need to setup it with `WorkerThread.setup` and `WorkerMainThread.setup` before runing anytyhing;
 * @template RECEIVE
 * @template POST
 * @implements {VivthCleanup}
 */
export declare class WorkerThread<RECEIVE, POST> implements VivthCleanup {
    #private;
    vivthCleanup: () => Promise<void>;
    /**
     * @description
     * - need to be called and exported as new `WorkerThread` class reference;
     * @template RECEIVE
     * @template POST
     * @param {{parentPort:typeof import('node:worker_threads')["parentPort"]}} refs
     * -example:
     * ```js
     * import { parentPort } from 'node:worker_threads';
     * ```
     * @returns {typeof WorkerThread<RECEIVE, POST>}
     * @example
     * import { parentPort } from 'node:worker_threads';
     * import { WorkerThread } from 'vivth/neutral';
     *
     * export const MyWorkerThreadRef = WorkerThread.setup({ parentPort });
     */
    static setup<RECEIVE, POST>(refs: {
        parentPort: typeof import('node:worker_threads')["parentPort"];
    }): typeof WorkerThread<RECEIVE, POST>;
    /**
     * @description
     * - instantiate via created class from `setup` static method;
     * @param {WorkerThread<RECEIVE, POST>["handler"]} handler
     * @example
     * import { MyWorkerThread } from './MyWorkerThread.mjs';
     *
     * const handler = async (ev, isLastOnQ) => {
     * 	// if(!isLastOnQ()) {
     * 	// 	return null; // can be used for imperative debouncing;
     * 	// }
     * 	// await fetch('some/path')
     * 	// if(!isLastOnQ()) {
     * 	// 	return;
     * 	// }
     * 	return ev = ev \* 2;
     * }
     * new MyWorkerThread(handler);
     */
    constructor(handler: WorkerThread<RECEIVE, POST>["handler"]);
    /**
     * @description
     * - type helper;
     * @type {(ev: RECEIVE, isLastOnQ:QCBReturn["isLastOnQ"]) => Promise<POST>}
     */
    handler: (ev: RECEIVE, isLastOnQ: QCBReturn["isLastOnQ"]) => Promise<POST>;
    /**
     * @description
     * - helper type, hold no actual value;
     * @type {RECEIVE}
     */
    RECEIVE: RECEIVE;
    /**
     * @description
     * - helper type, hold no actual value;
     * @type {POST}
     */
    POST: POST;
}
