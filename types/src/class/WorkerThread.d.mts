/**
 * @description
 * - class helper for `WorkerThread` creation;
 * @template Receive
 * @template Post
 */
export class WorkerThread<Receive, Post> {
    /**
     * @type {{parentPort:()=>Promise<any>}}
     */
    static #parentPortRef: {
        parentPort: () => Promise<any>;
    };
    /**
     * @description
     * - need to be called and exported as new `WorkerThread` class reference;
     * @template Receive_
     * @template Post_
     * @param {{parentPort:()=>Promise<any>}} parentPortRef
     * - correct parentPort reference, example:
     * ```js
     * async () => (await import('node:worker_threads')).parentPort
     * ```
     * @returns {typeof WorkerThread<Receive_, Post_>}
     * @example
     * import { WorkerThread } from 'vivth';
     *
     * WorkerThread.setup({ parentPort: async () => (await import('node:worker_threads')).parentPort });
     * // that is the default value, if your parentPort/equivalent API is not that;
     * // you need to call this method;
     */
    static setup: (parentPortRef: {
        parentPort: () => Promise<any>;
    }) => typeof WorkerThread<Receive_, Post_>;
    /**
     * @param {any} ev
     */
    static #isCloseWorkerEvent: (ev: any) => boolean;
    /**
     * @description
     * - instantiate via created class from `setup` static method;
     * @param {WorkerThread["handler"]} handler
     * @example
     * import { MyWorkerThread } from './MyWorkerThread.mjs';
     *
     * const doubleWorker = new MyWorkerThread((ev, isLastOnQ) => {
     * 	// if(!isLastOnQ) {
     * 	// 	return null; // can be used for imperative debouncing;
     * 	// }
     * 	return ev = ev \* 2;
     * });
     */
    constructor(handler: (ev: any, isLastOnQ: boolean) => any);
    /**
     * @description
     * - type helper;
     * @type {(ev: Receive, isLastOnQ:boolean) => Post}
     */
    handler: (ev: Receive, isLastOnQ: boolean) => Post;
    /**
     * @description
     * - helper type, hold no actual value;
     * @type {Receive}
     */
    Receive: Receive;
    /**
     * @description
     * - helper type, hold no actual value;
     * @type {Post}
     */
    Post: Post;
    #private;
}
