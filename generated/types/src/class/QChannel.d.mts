import { TryAsync } from '../function/TryAsync.mjs';
export type AnyButUndefined = import('../typehints/AnyButUndefined.mjs').AnyButUndefined;
export type QCBReturn = import('../typehints/QCBReturn.mjs').QCBReturn;
export type QCBFIFOReturn = import('../typehints/QCBFIFOReturn.mjs').QCBFIFOReturn;
export type VivthCleanup = import('../typehints/VivthCleanup.mjs').VivthCleanup;
/**
 * @typedef { import('../typehints/VivthCleanup.mjs').VivthCleanup } VivthCleanup
 */
/**
 * @description
 * - class for `Queue` handling;
 * @template {AnyButUndefined} DEFINEDANY
 * @implements {VivthCleanup}
 */
export declare class QChannel<DEFINEDANY extends AnyButUndefined> implements VivthCleanup {
    #private;
    name: string;
    vivthCleanup: () => Promise<void>;
    /**
     * @param {string} name
     * - only used as helper for logging, and has nothing to do with runtime behaviour;
     * @param {boolean} [log]
     */
    constructor(name: string, log?: boolean);
    /**
     * @typedef {import('../typehints/AnyButUndefined.mjs').AnyButUndefined} AnyButUndefined
     * @typedef {import('../typehints/QCBReturn.mjs').QCBReturn} QCBReturn
     * @typedef {import('../typehints/QCBFIFOReturn.mjs').QCBFIFOReturn} QCBFIFOReturn
     */
    /**
     * @description
     * - to modify `MapReference`
     * @param {Map<AnyButUndefined, [Promise<any>, {}]>} uniqueMap
     * @returns {typeof QChannel}
     * - usefull for Queue primitive on multiple library but single reference, like the Web by making the `Map` on `window` object;
     * @example
     * import { QChannel } from 'vivth/neutral';
     *
     * const myMappedQref = (window['myMappedQref'] = new Map());
     * export const MyQClass = QChannel.setup(myMappedQref);
     */
    static setup: (uniqueMap: Map<AnyButUndefined, [Promise<any>, {}]>) => typeof QChannel;
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
        key: () => Promise<QCBFIFOReturn>;
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
        callback: <RESULT>(
        /**
         * @type {()=>Promise<RESULT>}
         */
        asyncCallback: () => Promise<RESULT>) => ReturnType<typeof TryAsync<RESULT>>;
    } & {
        [x: symbol]: {
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
            key: () => Promise<QCBFIFOReturn>;
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
            callback: <RESULT>(
            /**
             * @type {()=>Promise<RESULT>}
             */
            asyncCallback: () => Promise<RESULT>) => ReturnType<typeof TryAsync<RESULT>>;
        };
    };
    /**
     * @description
     * - disable queue;
     * - when `closed`, `isLastOnQ` will allways return `false`;
     * @type {()=>void}
     */
    close: () => void;
    /**
     * @description
     * - enable queue;
     * - when `opened`, `isLastOnQ` will evaluate whether calls are actually the last of queue;
     * @type {()=>void}
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
    key: (keyID: DEFINEDANY) => Promise<QCBReturn>;
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
     * 	// return result
     * })
     */
    callback<RESULT>(keyID: DEFINEDANY, asyncCallback: (options: Omit<QCBReturn, "resume">) => Promise<RESULT>): ReturnType<typeof TryAsync<RESULT>>;
}
