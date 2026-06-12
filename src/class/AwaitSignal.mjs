// @ts-check

import { IsInstanceOf } from '../function/IsInstanceOf.mjs';
import { TryAsync } from '../function/TryAsync.mjs';
import { Console } from './Console.mjs';
import { Effect } from './Effect.mjs';
import { Signal } from './Signal.mjs';

/**
 * @typedef {import('../typehints/VivthCleanup.mjs').VivthCleanup} VivthCleanup
 */

/**
 * @description
 * - `Signal` to unwrap `Promise`;
 * - useful to create underlying mechanism for something like react `Suspense` component;
 * - auto queued for last unwrap request;
 * @template {any} VALUE
 * @template {any[]} ARGS
 * @extends {Signal<VALUE|Promise<VALUE>|Error>}
 * @implements {VivthCleanup}
 * @example
 * import { AwaitSignal, Effect } from 'vivth/neutral'
 * const bigAwaitSignal = new AwaitSignal(fetch('../SomethingReallyBig'));
 * new Effect(async({ subscribe })=>{
 * 	const myBigLoadProgress = subscribe(bigAwaitSignal).value;
 * 	const isError = IsInstanceOf(myBigLoadProgress, Error);
 * 	if(isError){
 * 		// handle error here
 * 		return;
 * 	}
 * 	const isAPromise = IsInstanceOf(myBigLoadProgress, Promise);
 * 	if(isAPromise){
 * 		// handle suspense here;
 * 		return;
 * 	}
 * 	// handle ready state here;
 * })
 */
export class AwaitSignal extends Signal {
	/**
	 * @override
	 */
	vivthCleanup = async () => {
		this.#unwrapper.vivthCleanup();
		this.remove.ref();
	};
	/**
	 * @type {number}
	 */
	#latestPromise = Date.now();
	/**
	 * @param {(...args:ARGS)=>Promise<VALUE>} callback
	 * @param {ARGS} firstCallArguments
	 */
	constructor(callback, ...firstCallArguments) {
		super(callback(...firstCallArguments), ({ timeStamp, value }) => {
			if (!IsInstanceOf(value, Promise)) {
				return;
			}
			this.#latestPromise = timeStamp;
		});
		this.#callback = callback;
		this.#unwrapper = new Effect(async ({ subscribe, isLastCalled }) => {
			const latestPromise = this.#latestPromise;
			const currentValue = subscribe(this).value;
			if (!IsInstanceOf(currentValue, Promise) || !(await isLastCalled())) {
				return;
			}
			const [newValue, errorUnwrappingPromise] = await TryAsync(async () => {
				return await currentValue;
			});
			if (latestPromise !== this.#latestPromise) {
				return;
			}
			if (!errorUnwrappingPromise) {
				super.value = newValue;
				return;
			}
			Console.error({ errorUnwrappingPromise });
			super.value = errorUnwrappingPromise;
		});
	}
	#unwrapper;
	/**
	 * @override
	 * @param {VALUE|Promise<VALUE>|Error} _newValue
	 */
	set value(_newValue) {
		Console.warn({ _newValue, AwaitSignalValueSetter: 'are not to be used' });
	}
	/**
	 * @override
	 * @returns {VALUE|Promise<VALUE>|Error}
	 */
	get value() {
		return super.value;
	}
	/**
	 * @type {(...args:ARGS)=>Promise<VALUE>}
	 */
	#callback;
	retryCount = 0;
	/**
	 * @param {number} maxRetries
	 * - `0` for no limit;
	 * @param {ARGS} args
	 * - integer of retryCount;
	 */
	retry = (maxRetries, ...args) => {
		if (maxRetries !== 0 || ++this.retryCount > maxRetries) {
			Console.error({
				AwaitSignal: { callback: this.#callback, retryCount: maxRetries },
			});
			return;
		}
		super.value = this.#callback(...args);
	};
}
