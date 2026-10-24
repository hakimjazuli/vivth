// @ts-check

import { WalkThrough } from '../../class/WalkThrough.mjs';
import { ForOfSync } from '../../function/ForOfSync.mjs';
import { WailsMainQ } from '../WailsMainQ.mjs';

/**
 * @typedef {import('../../typehints/VivthCleanup.mjs').VivthCleanup} VivthCleanup
 */

/**
 * @description
 * - getter helper;
 * - `Wails2Dev` will generate `app_ipc.go`;
 * @implements {VivthCleanup}
 */
export class Wails2Listener {
	/**
	 * @type {Map<string, Set<()=>Promise<void>>>}
	 */
	static #mappedHandler = new Map();
	/**
	 * @description
	 * - when wrapped with vivth `WC_extends_instance.this.ON` this method is to auto cleaned;
	 * - you can call this method manually on the framework element cleanup lifecycle;
	 * @type {()=>Promise<void>}
	 */
	vivthCleanup = async () => {
		Wails2Listener.#mappedHandler.get(this.#getterName)?.delete(this.#handler);
		if (Wails2Listener.#mappedHandler.size) {
			return;
		}
		Wails2Listener.#mappedHandler.delete(this.#getterName);
	};
	/**
	 * @type {string}
	 */
	#getterName;
	/**
	 * @type {()=>Promise<void>}
	 */
	#handler;
	/**
	 * @description
	 * @param {string} getterName
	 * @param {()=>Promise<void>} handler
	 * @example
	 * import { Wails2Listener } from 'vivth/browser';
	 * import { MyIPC } from '../wails/go/App.js'
	 * const myListener = new Wails2Listener('users', async () => {
	 * 	const res = await MyIPC();
	 * });
	 * // when no longer needed, eg. element is disconnected;
	 * myListener.vivthCleanup();
	 */
	constructor(getterName, handler) {
		this.#getterName = getterName;
		this.#handler = handler;
		Wails2Listener.#runHandler(handler);
	}
	/**
	 * @param {() => Promise<void>} handler
	 * @returns {Promise<[undefined, Error] | [void, undefined]>}
	 */
	static #runHandler = async (handler) => {
		return await WailsMainQ.callback(handler, async ({ isLastOnQ }) => {
			if (!isLastOnQ()) {
				return;
			}
			return await handler();
		});
	};
	static {
		// @ts-expect-error
		window.runtime.EventsOnMultiple(
			'getter:update',
			// @ts-expect-error
			(getters) => {
				if (!getters || !Array.isArray(getters)) {
					return;
				}
				WalkThrough.array(getters, ([_, getter]) => {
					const setOfHandler = Wails2Listener.#mappedHandler.get(getter);
					if (!setOfHandler) {
						return;
					}
					ForOfSync(setOfHandler, Wails2Listener.#runHandler);
				});
			},
			-1,
		);
	}
}
