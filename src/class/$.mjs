// @ts-check

import { PingFIFO } from './PingFIFO.mjs';
import { isAsync } from '../common.mjs';

/**
 * @description
 * - a class to `autosubscribe` to an signal changes (`Derived` and `Signal` alike);
 * - for minimal total bundle size use `function` [New$](#new$) instead;
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
		$.effects.get(this)?.forEach((signalInstance) => {
			$.mappedSignals.get(signalInstance).delete(this);
		});
		$.effects.set(this, new Set());
	};
	/**
	 * @type {()=>void}
	 */
	effect;
	/**
	 * @param {$["effect"]} effect
	 */
	constructor(effect) {
		this.effect = effect;
		new PingFIFO(async () => {
			$.isRegistering = true;
			if (isAsync(effect)) {
				await effect();
			} else {
				effect();
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
		});
	}
}
