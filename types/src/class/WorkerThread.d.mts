/**
 * @description
 * - class helper for `WorkerThread` creation;
 * - before any `Worker` functionaily to be used, you need to setup it with `WorkerThread.setup` and `WorkerMainThread.setup` before runing anytyhing;
 * @template RECEIVE
 * @template POST
 */
export class WorkerThread<RECEIVE, POST> {
    /**
     * @typedef {import('../types/QCBReturn.mjs').QCBReturn} QCBReturn
     */
    /**
     * @type {Parameters<typeof WorkerThread["setup"]>[0]|undefined}
     */
    static "__#private@#refs": Parameters<(typeof WorkerThread)["setup"]>[0] | undefined;
    /**
     * @description
     * - need to be called and exported as new `WorkerThread` class reference;
     * @template RECEIVE
     * @template POST
     * @param {{parentPort:import('node:worker_threads')["parentPort"]}} refs
     * -example:
     * ```js
     * import { parentPort } from 'node:worker_threads';
     * ```
     * @returns {typeof WorkerThread<RECEIVE, POST>}
     * @example
     * import { WorkerThread } from 'vivth';
     * import { parentPort } from 'node:worker_threads';
     *
     * export const MyWorkerThreadRef = WorkerThread.setup({ parentPort });
     */
    static setup<RECEIVE_1, POST_1>(refs: {
        parentPort: typeof import("node:worker_threads")["parentPort"];
    }): typeof WorkerThread<RECEIVE_1, POST_1>;
    /**
     * @param {any} ev
     */
    static "__#private@#isCloseWorkerEvent": (ev: any) => boolean;
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
    handler: (ev: RECEIVE, isLastOnQ: () => boolean) => Promise<POST>;
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
    #private;
}
