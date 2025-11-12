/**
 * @description
 * - class for `Queue` handling;
 * @template {AnyButUndefined} DEFINEDANY
 */
export class QChannel<DEFINEDANY extends import("../types/AnyButUndefined.mjs").AnyButUndefined> {
    /**
     * @typedef {import('../types/AnyButUndefined.mjs').AnyButUndefined} AnyButUndefined
     * @typedef {import('../types/QCBReturn.mjs').QCBReturn} QCBReturn
     * @typedef {import('../types/QCBFIFOReturn.mjs').QCBFIFOReturn} QCBFIFOReturn
     */
    /**
     * @description
     * - to modify `MapReference`
     * @param {Map<AnyButUndefined, [Promise<any>, {}]>} uniqueMap
     * @returns {typeof QChannel}
     * - usefull for Queue primitive on multiple library but single reference, like the Web by making the `Map` on `window` object;
     * @example
     * import { QChannel } from 'vivth';
     *
     * const myMappedQref = (window['myMappedQref'] = new Map());
     * export const MyQClass = QChannel.setup(myMappedQref);
     */
    static setup: (uniqueMap: Map<import("../types/AnyButUndefined.mjs").AnyButUndefined, [Promise<any>, {}]>) => typeof QChannel;
    /**
     * @type {Map<AnyButUndefined, [Promise<any>, {}]>}
     */
    static "__#private@#uniquePromiser": Map<import("../types/AnyButUndefined.mjs").AnyButUndefined, [Promise<any>, {}]>;
    /**
     * - ensures that each id has only one task running at a time.
     * - calls with the same id will wait for the previous call to finish.
     * @param {AnyButUndefined} id
     * @param {QChannel<any>} instance
     * @returns {Promise<QCBReturn>} Resolves when it's safe to proceed for the given id, returning a cleanup function
     */
    static "__#private@#uniqueCB": (id: import("../types/AnyButUndefined.mjs").AnyButUndefined, instance: QChannel<any>) => Promise<import("../types/QCBReturn.mjs").QCBReturn>;
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
         * @template RESULT
         * @param {()=>Promise<RESULT>} asyncCallback
         * @returns {ReturnType<typeof TryAsync<RESULT>>}
         * @example
         * const [result, error] = await QChannel.fifo.callback(async () = > {
         * 	// code
         * })
         */
        callback: <RESULT>(asyncCallback: () => Promise<RESULT>) => ReturnType<typeof TryAsync<RESULT>>;
    } & {
        "vivth:unwrapLazy;": () => {
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
             * @template RESULT
             * @param {()=>Promise<RESULT>} asyncCallback
             * @returns {ReturnType<typeof TryAsync<RESULT>>}
             * @example
             * const [result, error] = await QChannel.fifo.callback(async () = > {
             * 	// code
             * })
             */
            callback: <RESULT>(asyncCallback: () => Promise<RESULT>) => ReturnType<typeof TryAsync<RESULT>>;
        };
    };
    /**
     * @param {string} name
     * - only used as helper for logging, and has nothing to do with runtime behaviour;
     */
    constructor(name: string);
    name: string;
    /**
     * @description
     * - disable queue;
     * - when `closed`, `isLastOnQ` will allways return `false`;
     * @returns {void}
     */
    close: () => void;
    /**
     * @description
     * - enable queue;
     * - when `opened`, `isLastOnQ` will evaluate whether calls are actually the last of queue;
     * @returns {void}
     */
    open: () => void;
    /**
     * @description
     * - each `QChannelInstance` are managing it's own `queue`, and will not `await` for other `QChannelInstance`;
     * - caveat:
     * >- need to manually call resume();
     * >- slightly more performant than `callback`;
     * @param {DEFINEDANY} keyID
     * @returns {Promise<QCBReturn>}
     * @example
     * const q = new QChannel('channel name');
     * const handler = async () => {
     * 	const { resume, isLastOnQ } = await q.key(keyID);
     * 	// if (!isLastOnQ()) { // imperative debounce if needed
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
    key: (keyID: DEFINEDANY) => Promise<import("../types/QCBReturn.mjs").QCBReturn>;
    /**
     * @description
     * - `callbackBlock` with error as value:
     * - caveat:
     * >- no need to manually call resume();
     * >- slightly less performant than `key`;
     * @template RESULT
     * @param {DEFINEDANY} keyID
     * @param {(options:Omit<QCBReturn,
     * "resume">) =>
     * Promise<RESULT>} asyncCallback
     * @returns {ReturnType<typeof TryAsync<RESULT>>}
     * @example
     * const q = new QChannel('channel name');
     * const [result, error] = await q.callback(keyID, async ({ isLastOnQ }) => {
     * 	// if (!isLastOnQ()) { // imperative debounce if needed
     * 	// 	return;
     * 	// }
     * 	// code
     * })
     */
    callback<RESULT>(keyID: DEFINEDANY, asyncCallback: (options: Omit<import("../types/QCBReturn.mjs").QCBReturn, "resume">) => Promise<RESULT>): ReturnType<typeof TryAsync<RESULT>>;
    #private;
}
import { TryAsync } from '../function/TryAsync.mjs';
