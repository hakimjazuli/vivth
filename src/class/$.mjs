// @ts-check

import { isAsync } from '../common.mjs';
import { NewQBlock } from '../function/NewQBlock.mjs';

/**
 * @description
 * - a class to `autosubscribe` to an signal changes (`Derived` and `Signal` alike);
 * ```js
 * import { $, Derived, Signal } from 'vivth';
 * const signal = new Signal(0);
 * const derived = new Derived(async () =>{
 *  // runs everytime signal.value changes;
 *  return signal.value * 2;
 * });
 * const autosubscriber = new $(async ()=>{
 *  // runs everytime signal.value changes;
 *  console.log(signal.value);
 *  // console.log(derived.value);
 * });
 * signal.value = 1;
 * ```
 */
export class $ {
	/**
	 * @typedef {import('../class/Signal.mjs').Signal} Signal
	 */
	/**
	 * @type {Map<$, Set<Signal>>}
	 */
	static effects = new Map();
	/**
	 * @type {Map<Signal, Set<$>>}
	 */
	static mappedSignals = new Map();
	/**
	 * @type {Set<Signal>}
	 */
	static activeSignal = new Set();
	/**
	 * @type {boolean}
	 */
	static isRegistering = false;
	/**
	 * @returns {void}
	 */
	remove$ = () => {
		NewQBlock(async () => {
			$.effects.get(this)?.forEach((signalInstance) => {
				$.mappedSignals.get(signalInstance).delete(this);
			});
			$.effects.set(this, new Set());
		}, $);
	};
	/**
	 * @type {(arg:{remove$:$["remove$"]})=>void};
	 */
	effect;
	/**
	 * @param {(arg:{remove$:$["remove$"]})=>void} effect
	 */
	constructor(effect) {
		this.effect = effect;
		NewQBlock(async () => {
			$.isRegistering = true;
			const check = this.effect({ remove$: this.remove$ });
			if (isAsync(effect)) {
				await check;
			}
			$.isRegistering = false;
			const signalInstances = $.activeSignal;
			$.effects.set(this, $.activeSignal);
			signalInstances.forEach((signal) => {
				if (!$.mappedSignals.has(signal)) {
					$.mappedSignals.set(signal, new Set());
				}
				$.mappedSignals.get(signal).add(this);
			});
			$.activeSignal = new Set();
		}, $);
	}
}
