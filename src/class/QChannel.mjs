// @ts-check

import { LazyFactory } from '../function/LazyFactory.mjs';
import { TryAsync } from '../function/TryAsync.mjs';
import { Console } from './Console.mjs';

/**
 * @description
 * - class for `Queue` handling;
 * @template {AnyButUndefined} DEFINEDANY
 */
export class QChannel {
	/**
	 * @param {string} name
	 * - only used as helper for logging, and has nothing to do with runtime behaviour;
	 */
	constructor(name) {
		this.name = name;
		this.open();
	}
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
	static setup = (uniqueMap) => {
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
	 * @param {QChannel<any>} instance
	 * @returns {Promise<QCBReturn>} Resolves when it's safe to proceed for the given id, returning a cleanup function
	 */
	static #uniqueCB = async (id, instance) => {
		const existing = QChannel.#uniquePromiser.get(id);
		// @ts-expect-error
		let resolveFn;
		const nextPromise = new Promise((resolve) => {
			resolveFn = resolve;
		});
		const context = {};
		if (existing === undefined) {
			QChannel.#uniquePromiser.set(id, [nextPromise, context]);
			await Promise.resolve();
		} else {
			const [prevPromise] = existing;
			await prevPromise;
			QChannel.#uniquePromiser.set(id, [nextPromise, context]);
		}
		const resume = () => {
			// @ts-expect-error
			resolveFn();
			QChannel.#uniquePromiser.delete(id);
		};
		return {
			resume,
			isLastOnQ: () => {
				if (QChannel.#uniquePromiser.has(id) === false) {
					return false;
				}
				// @ts-expect-error
				const [, lastContext] = QChannel.#uniquePromiser.get(id);
				return instance.#shouldRun && lastContext === context;
			},
		};
	};
	/**
	 * @description
	 * - first in first out handler
	 */
	static fifo = LazyFactory(() => {
		const qfifo = new QChannel('main fifo');
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
			 * @template RESULT
			 * @param {()=>Promise<RESULT>} asyncCallback
			 * @returns {ReturnType<typeof TryAsync<RESULT>>}
			 * @example
			 * const [result, error] = await QChannel.fifo.callback(async () = > {
			 * 	// code
			 * })
			 */
			callback: async (
				/**
				 * @type {()=>Promise<RESULT>}
				 */
				asyncCallback
			) => {
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
	 * @type {Map<DEFINEDANY, WeakKey>}
	 */
	#mapped = new Map();
	/**
	 * @type {boolean}
	 */
	#shouldRun_ = true;
	/**
	 * @returns {boolean}
	 */
	get #shouldRun() {
		const shoulRun = this.#shouldRun_;
		if (shoulRun === false) {
			Console.warn({ qChannel_name: this.name, message: 'is closed' });
		}
		return shoulRun;
	}
	/**
	 * @description
	 * - disable queue;
	 * - when `closed`, `isLastOnQ` will allways return `false`;
	 * @returns {void}
	 */
	close = () => {
		this.#shouldRun_ = false;
		Console.info({ qChannel_name: this.name, message: 'closed' });
	};
	/**
	 * @description
	 * - enable queue;
	 * - when `opened`, `isLastOnQ` will evaluate whether calls are actually the last of queue;
	 * @returns {void}
	 */
	open = () => {
		this.#shouldRun_ = true;
		Console.info({ qChannel_name: this.name, message: 'opened' });
	};
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
	key = async (keyID) => {
		const { resume } = await QChannel.#uniqueCB(this, this);
		const mapped = this.#mapped;
		if (mapped.has(keyID) === false) {
			mapped.set(keyID, {});
		}
		resume();
		return await QChannel.#uniqueCB(
			// @ts-expect-error
			mapped.get(keyID),
			this
		);
	};
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
	async callback(keyID, asyncCallback) {
		return await TryAsync(async () => {
			const { resume, isLastOnQ } = await this.key(keyID);
			const result = await asyncCallback({ isLastOnQ });
			resume();
			return result;
		});
	}
}
