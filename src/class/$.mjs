// @ts-check

import { NewPingFIFO } from '../function/NewPingFIFO.mjs';
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
	 * effects
	 * @type {Map<$["effect"], Set<Signal>>}
	 */
	static E = new Map();
	/**
	 * signalInstance
	 * @type {Map<Signal, Set<$["effect"]>>}
	 */
	static S = new Map();
	/**
	 * activeSignalUponRegistering
	 * @type {Signal[]}
	 */
	static A = [];
	/**
	 * isRegistering
	 * @type {boolean}
	 */
	static R = false;
	/**
	 * @returns {void}
	 */
	remove$ = () => {
		if (!$.E.has(this.effect)) {
			return;
		}
		$.E.get(this.effect).forEach((signalInstance) => {
			$.S.get(signalInstance).delete(this.effect);
		});
		$.E.delete(this.effect);
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
		NewPingFIFO(async () => {
			$.R = true;
			if (isAsync(effect)) {
				await effect();
			} else {
				effect();
			}
			$.R = false;
			const signalInstances = $.A;
			$.E.set(effect, new Set(signalInstances));
			for (let i = 0; i < signalInstances.length; i++) {
				const signal = signalInstances[i];
				if (!$.S.has(signal)) {
					$.S.set(signal, new Set());
				}
				$.S.get(signal).add(effect);
			}
			$.A = [];
		});
	}
}
