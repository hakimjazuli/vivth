// @ts-check

import { $ } from './$.mjs';

/**
 * @description
 * - a class for creating signal;
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
 * });
 * signal.value = 1;
 * ```
 */
/**
 * @template Value
 */
export class Signal {
	/**
	 * @protected
	 */
	get subscribed() {
		return $.mappedSignals.get(this);
	}
	/**
	 * destroy all props
	 */
	unRef = () => {
		this.removeAll$();
		this.#Value = null;
	};
	/**
	 * remove all effects
	 * @return {void}
	 */
	removeAll$ = () => {
		this.subscribed?.forEach(($_) => {
			$_.remove$();
		});
	};
	/**
	 * remove effect
	 * @param {$} $_
	 * @return {void}
	 */
	remove$ = ($_) => {
		if ($.effects.get($_)?.has(this)) {
			$_.remove$();
		}
	};
	/**
	 * @param {Value} value
	 */
	constructor(value) {
		this.#Value = value;
	}
	/**
	 * @type {Value}
	 */
	#prev = undefined;
	get prev() {
		return this.#prev;
	}
	/**
	 * @type {Value}
	 */
	#Value;
	/**
	 * @type {Value}
	 */
	get nonReactiveValue() {
		return this.#Value;
	}
	/**
	 * @type {Value}
	 */
	get value() {
		if ($.isRegistering) {
			$.activeSignal.add(this);
		}
		return this.#Value;
	}
	/**
	 * @type {Value}
	 */
	set value(newValue) {
		if (this.#Value === newValue) {
			return;
		}
		this.#prev = this.#Value;
		this.#Value = newValue;
		this.call$();
	}
	/**
	 * @returns {void}
	 */
	call$ = () => {
		if (!this.subscribed) {
			return;
		}
		this.subscribed.forEach(($_) => $_.effect({ remove$: $_.remove$ }));
	};
}
