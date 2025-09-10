// @ts-check

import { LazyFactory } from '../function/LazyFactory.mjs';
import { TryAsync } from '../function/TryAsync.mjs';

/**
 * @description
 * - class for `Queue` handling;
 * @template {AnyButUndefined} T
 */
export class QChannel {
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
	 */
	static makeQClass = (uniqueMap) => {
		QChannel.#uniquePromiser = uniqueMap;
		return QChannel;
	};
	/**
	 * @type {Map<AnyButUndefined, [Promise<any>, {}]>}
	 */
	static #uniquePromiser = new Map();
	/**
	 * - ensures that each id has only one task running at a time.
	 * - calls with the same id will wait for the previous call to finish.
	 * @param {AnyButUndefined} id
	 * @returns {Promise<QCBReturn>} Resolves when it's safe to proceed for the given id, returning a cleanup function
	 */
	static #uniqueCB = async (id) => {
		const existing = QChannel.#uniquePromiser.get(id);
		let resolveFn;
		const nextPromise = new Promise((resolve) => {
			resolveFn = resolve;
		});
		const context = {};
		if (!existing) {
			QChannel.#uniquePromiser.set(id, [nextPromise, context]);
			await Promise.resolve();
		} else {
			const [prevPromise] = existing;
			await prevPromise;
			QChannel.#uniquePromiser.set(id, [nextPromise, context]);
		}
		const resume = () => {
			resolveFn();
			QChannel.#uniquePromiser.delete(id);
		};
		return {
			resume,
			get isLastOnQ() {
				const [_, lastContext] = QChannel.#uniquePromiser.get(id);
				return lastContext === context;
			},
		};
	};
	/**
	 * @description
	 * - first in first out handler
	 */
	static fifo = LazyFactory(() => {
		const qfifo = new QChannel();
		return {
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
			key: async () => {
				return await qfifo.key(
					/**
					 * uses locally declared object to make it unique from other QChannel instances;
					 */
					qfifo
				);
			},
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
			callback: async (asyncCallback) => {
				return await TryAsync(async () => {
					const { resume } = await this.fifo.key();
					const result = await asyncCallback();
					resume();
					return result;
				});
			},
		};
	});
	/**
	 * @type {Map<T, WeakKey>}
	 */
	#mapped = new Map();
	/**
	 * @description
	 * - clear up all queued on the instance;
	 * - only clear up the reference, the already called will not be stoped;
	 * @returns {void}
	 */
	clear = () => {
		this.#mapped.clear();
	};
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
	key = async (keyID) => {
		const { resume } = await QChannel.#uniqueCB(this);
		const mapped = this.#mapped;
		if (!mapped.has(keyID)) {
			mapped.set(keyID, {});
		}
		resume();
		return await QChannel.#uniqueCB(mapped.get(keyID));
	};
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
	callback = async (keyID, asyncCallback) => {
		return await TryAsync(async () => {
			const { resume, isLastOnQ } = await this.key(keyID);
			const result = await asyncCallback({ isLastOnQ });
			resume();
			return result;
		});
	};
}
