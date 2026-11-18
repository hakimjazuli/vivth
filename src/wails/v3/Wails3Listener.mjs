// @ts-check

import { Events } from '@wailsio/runtime';

import { WalkThrough } from '../../class/WalkThrough.mjs';
import { ForOfSync } from '../../function/ForOfSync.mjs';
import { WailsMainQ } from '../WailsMainQ.mjs';

/**
 * @typedef {import('../../typehints/VivthCleanup.mjs').VivthCleanup} VivthCleanup
 */

/**
 * @description
 * - getter helper;
 * - `Wails3Dev` will generate `main_services.go`;
 * @implements {VivthCleanup}
 */
export class Wails3Listener {
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
		Wails3Listener.#mappedHandler.get(this.#getterName)?.delete(this.#handler);
		if (Wails3Listener.#mappedHandler.size) {
			return;
		}
		Wails3Listener.#mappedHandler.delete(this.#getterName);
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
	 * @param {string} listenToFORMNotifName
	 * - `// FORM` will notify names go as array of string via `*EmitterInstance`;
	 * - `listenToFORMNotifName` is to listen to one specific string value, then you can run a callback;
	 * > - as of `wails3` they didn't expose `ipc`(now `Service`) with human readable name like on `wails2` so you could technically obfuscate it slightly better;
	 * > - so this class is to help you wrap that `Service` bindings into your callback;
	 * - multi instance listening to same name can run in parallel;
	 * > - so different handler could pass different arguments;
	 * @param {()=>Promise<void>} handler
	 * @example
	 * import { Wails3Listener } from 'vivth/neutral';
	 * import { MyIPC } from '../wails/go/App.js'
	 * const myListener = new Wails3Listener('users', async () => {
	 * 	const res = await MyIPC();
	 * });
	 * // when no longer needed, eg. element is disconnected;
	 * myListener.vivthCleanup();
	 */
	constructor(listenToFORMNotifName, handler) {
		this.#getterName = listenToFORMNotifName;
		this.#handler = handler;
		Wails3Listener.#runHandler(handler);
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
	/**
	 * @description
	 * - prepare class for standard definitions;
	 * @type {()=>void}
	 */
	static prepare = () => {
		Events.On('getter:update', (getters) => {
			const { data: gettersData } = getters;
			if (!gettersData || !Array.isArray(gettersData)) {
				return;
			}
			WalkThrough.array(gettersData, ([_, getter]) => {
				const setOfHandler = Wails3Listener.#mappedHandler.get(getter);
				if (!setOfHandler) {
					return;
				}
				ForOfSync(setOfHandler, Wails3Listener.#runHandler);
			});
		});
	};
}
