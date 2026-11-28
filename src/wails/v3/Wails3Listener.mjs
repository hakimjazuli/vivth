// @ts-check

import { Events } from '@wailsio/runtime';
import { ForOfSync } from '../../function/ForOfSync.mjs';
import { WailsMainQ } from '../WailsMainQ.mjs';
import { wailsProjectHelperEmitterUpdatedDatasName } from '../wailsProjectHelper.mjs';
import { TryAsync } from '../../function/TryAsync.mjs';

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
		const handlers = Wails3Listener.#mappedHandler.get(this.#getterName);
		if (!handlers) {
			return;
		}
		handlers.delete(this.#handler);
		if (handlers.size !== 0) {
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
	 * - unlike `wails3` standard emit event listener, this class meant to listen to single `eventName`(`emitter:updated_datas`), with light weight `string[]` `message`(internally handled by this class);
	 * - it is usefull for getter setter pattern, meaning the message should only contains what data on the backends is updated, then you can just call getter `Service` for that particullar name;
	 * @param {string} listenToFORMNotifName
	 * - `// FORM` will notify names go as array of string via `*EmitterInstance`;
	 * - `listenToFORMNotifName` is to listen to one specific string value, then you can run a callback;
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
		if (!Wails3Listener.#mappedHandler.has(listenToFORMNotifName)) {
			Wails3Listener.#mappedHandler.set(listenToFORMNotifName, new Set());
		}
		this.#handler = handler;
		if (!Wails3Listener.#mappedHandler.get(listenToFORMNotifName)?.has(handler)) {
			Wails3Listener.#mappedHandler.get(listenToFORMNotifName)?.add(handler);
		}
		Wails3Listener.#runHandler(handler);
	}
	/**
	 * @param {() => Promise<void>} handler
	 * @returns {ReturnType<typeof TryAsync<void>>}
	 */
	static #runHandler = async (handler) => {
		return await WailsMainQ.callback(handler, async ({ isLastOnQ }) => {
			if (!isLastOnQ()) {
				return;
			}
			return await handler();
		});
	};
	static #isPrepared = false;
	/**
	 * @description
	 * - prepare class for standard definitions;
	 * - you need to call this callback before using this class;
	 * @type {()=>void}
	 * @example
	 * import { Wails3Listener } from 'vivth/neutral';
	 * Wails3Listener.prepare();
	 */
	static prepare = () => {
		if (Wails3Listener.#isPrepared) {
			return;
		}
		Wails3Listener.#isPrepared = true;
		Events.On(wailsProjectHelperEmitterUpdatedDatasName, (getters) => {
			const { data: gettersData } = getters;
			if (!gettersData || !Array.isArray(gettersData)) {
				return;
			}
			for (const getter of gettersData) {
				const setOfHandler = Wails3Listener.#mappedHandler.get(getter);
				if (!setOfHandler) {
					continue;
				}
				ForOfSync(setOfHandler, Wails3Listener.#runHandler);
			}
		});
	};
}
