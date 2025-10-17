// @ts-check

import { LazyFactory } from '../function/LazyFactory.mjs';
import { Console } from './Console.mjs';
import { Derived } from './Derived.mjs';
import { Signal } from './Signal.mjs';

/**
 * @description
 * - uses [Signal](#signal) and [Derived](#derived) under the hood;
 * @template VALUE
 */
export class EnvSignal {
	/**
	 * @description
	 * - create `EnvSignal` instance;
	 * @param {VALUE} initialValue
	 */
	constructor(initialValue) {
		this.#proxyConst = LazyFactory(() => new Signal(initialValue));
		this.env = LazyFactory(
			() =>
				new Derived(async ({ subscribe }) => {
					return subscribe(this.#proxyConst).value;
				})
		);
	}
	#isModified = false;
	/**
	 * @type {Signal<VALUE>}
	 */
	#proxyConst;
	/**
	 * @description
	 * - exposed property to listen to;
	 * @type {Derived<VALUE>}
	 * @example
	 * import { EnvSignal, Effect } from 'vivth';
	 *
	 * export const myEnv = new EnvSignal(true);
	 * new Effect(async ({ subscribe }) => {
	 * 	const myEnvValue = subscribe(myEnv.env).value;
	 * 	// code
	 * })
	 */
	env;
	/**
	 * @description
	 * - call to correct the value of previously declared value;
	 * - can only be called once;
	 * @param {VALUE} correctedValue
	 * @returns {void}
	 * @example
	 * import { EnvSignal } from 'vivth';
	 *
	 * export const myEnv = new EnvSignal(true);
	 *
	 * // somewhere else on the program
	 * import { myEnv } from './myEnv.mjs'
	 *
	 * myEnv.correction(false); // this will notify all subscribers;
	 */
	correction = (correctedValue) => {
		if (this.#proxyConst.value === null) {
			return;
		}
		Console;
		if (this.#isModified) {
			Console.warn({
				correctedValue,
				value: this.#proxyConst.value,
				instance: this,
				message: '"correct" of this instance can only be called once',
			});
			return;
		}
		this.#isModified = true;
		this.#proxyConst.value = correctedValue;
		this.#proxyConst.remove.ref();
	};
}
