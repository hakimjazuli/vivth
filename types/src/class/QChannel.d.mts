/**
 * @description
 * - class for `Queue` handling;
 * @template {AnyButUndefinedType} T
 */
export class QChannel<T extends import("../types/AnyButUndefined.mjs").AnyButUndefined> {
    /**
     * @typedef {import('../types/AnyButUndefined.mjs').AnyButUndefined} AnyButUndefinedType
     * @typedef {import('../types/QCBReturn.mjs').QCBReturn} QCBReturn
     * @typedef {import('../types/QCBFIFOReturn.mjs').QCBFIFOReturn} QCBFIFOReturn
     */
    /**
     * @description
     * - to modify `MapReference`
     * @param {Map<AnyButUndefinedType, [Promise<any>, {}]>} uniqueMap
     * @returns {typeof QChannel}
     * - usefull for Queue primitive on multiple library but single reference, like the Web by making the `Map` on `window` object;
     */
    static makeQClass: (uniqueMap: Map<import("../types/AnyButUndefined.mjs").AnyButUndefined, [Promise<any>, {}]>) => typeof QChannel;
    /**
     * @type {Map<AnyButUndefinedType, [Promise<any>, {}]>}
     */
    static "__#6@#uniquePromiser": Map<import("../types/AnyButUndefined.mjs").AnyButUndefined, [Promise<any>, {}]>;
    /**
     * - ensures that each id has only one task running at a time.
     * - calls with the same id will wait for the previous call to finish.
     * @param {AnyButUndefinedType} id
     * @returns {Promise<QCBReturn>} Resolves when it's safe to proceed for the given id, returning a cleanup function
     */
    static "__#6@#uniqueCB": (id: import("../types/AnyButUndefined.mjs").AnyButUndefined) => Promise<import("../types/QCBReturn.mjs").QCBReturn>;
    /**
     * @description
     * - first in first out handler
     */
    static fifo: {
        /**
         * @static fifo
         * @description
         * - blocks execution for subsequent calls until the current one finishes.
         * @returns {Promise<QCBFIFOReturn>} Resolves when it's safe to proceed, returning a cleanup function
         * @example
         * const { resume } = await QChannel.fifo.key();
         * // blocks all `FIFO` called using this method and QChannel.fifoCallback;
         * resume();
         */
        key: () => Promise<import("../types/QCBFIFOReturn.mjs").QCBFIFOReturn>;
        /**
         * @static fifo
         * @description
         * - blocks execution for subsequent calls until the current one finishes.
         * @template ResultType
         * @param {()=>Promise<ResultType>} asyncCallback
         * @returns {Promise<[ResultType|undefined, Error|undefined]>}
         * @example
         * const [result, error] = await QChannel.fifo.callback(async () = > {
         * 	// code
         * })
         */
        callback: <ResultType>(asyncCallback: () => Promise<ResultType>) => Promise<[ResultType | undefined, Error | undefined]>;
    } & {
        "vivth:unwrapLazy;": string;
    };
    /**
     * @description
     * - clear up all queued on the instance;
     * - only clear up the reference, the already called will not be stoped;
     * @returns {void}
     */
    clear: () => void;
    /**
     * @description
     * - each `QChannelInstance` are managing it's own `queue`, and will not `await` for other `QChannelInstance`;
     * - caveat:
     * >- need to manually call resume();
     * >- slightly more performant than `callback`;
     * @param {T} keyID
     * @returns {Promise<QCBReturn>}
     * @example
     * const q = new QChannel();
     * const handler = async () => {
     * 	const { resume, isLastOnQ } = await q.key(keyID);
     * 	// if (!isLastOnQ) { // imperative debounce if needed
     * 	// 	resume();
     * 	// 	return;
     * 	// }
     * 	// don't forget to call resume before any returns;
     * 	// blocks only if keyID is the same, until resume is called;
     * 	resume(); // don't forget to call resume before any returns;
     * 	return 'something';
     * }
     * handler();
     */
    key: (keyID: T) => Promise<import("../types/QCBReturn.mjs").QCBReturn>;
    /**
     * @description
     * - `callbackBlock` with error as value:
     * - caveat:
     * >- no need to manually call resume();
     * >- slightly less performant than `callback`;
     * @template ResultType
     * @param {T} keyID
     * @param {(options:Omit<QCBReturn, "resume">)=>Promise<ResultType>} asyncCallback
     * @returns {Promise<[ResultType|undefined, Error|undefined]>}
     * @example
     * const q = new QChannel();
     * const [result, error] = await q.callback(keyID, async ({ isLastOnQ }) = > {
     * 	// if (!isLastOnQ) { // imperative debounce if needed
     * 	// 	return;
     * 	// }
     * 	// code
     * })
     */
    callback: (keyID: T, asyncCallback: (options: Omit<import("../types/QCBReturn.mjs").QCBReturn, "resume">) => Promise<ResultType>) => Promise<[ResultType | undefined, Error | undefined]>;
    #private;
}
