// @ts-check

import { $ } from './$.mjs';

/**
 * @description
 * - a class for creating signal;
 * - can be subscribed by using [New$](#new$) or [NewDerived](#newderived);
 * - for minimal total bundle size use `function` [NewSignal](#newSignal) instead;
 */
/**
 * @template Value
 */
export class Signal {
	/**
	 * subscribed
	 * @protected
	 */
	get S() {
		return $.S.get(this);
	}
	/**
	 * destroy all props
	 */
	unRef = () => {
		this.removeAll$();
		this.V = null;
	};
	/**
	 * remove all effects
	 * @return {void}
	 */
	removeAll$ = () => {
		this.S.forEach(($_) => {
			$_.remove$();
		});
	};
	/**
	 * remove effect
	 * @param {$} $_
	 * @return {void}
	 */
	remove$ = ($_) => {
		if ($.E.get($_).has(this)) {
			$_.remove$();
		}
	};
	/**
	 * @param {Value} value
	 */
	constructor(value) {
		this.V = value;
	}
	/**
	 * @private
	 * @type {Value}
	 */
	V;
	/**
	 * @type {Value}
	 */
	get value() {
		if ($.R) {
			$.A.push(this);
		}
		return this.V;
	}
	/**
	 * @type {Value}
	 */
	set value(newValue) {
		if (this.V === newValue) {
			return;
		}
		this.V = newValue;
		this.call$();
	}
	/**
	 * @returns {void}
	 */
	call$ = () => {
		if (!this.S) {
			return;
		}
		this.S.forEach(($_) => $_.effect());
	};
}
