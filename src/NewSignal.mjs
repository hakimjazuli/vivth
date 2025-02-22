// @ts-check

import { $ } from './New$.mjs';

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
		$.E.forEach((signals) => {
			if (signals.has(this)) {
				signals.delete(this);
			}
		});
		this.S.clear();
	};
	/**
	 * remove effect
	 * @param {$} $_
	 * @return {void}
	 */
	remove$ = ($_) => {
		if ($.E.has($_.effect)) {
			$.E.get($_.effect).delete(this);
		}
		this.S.delete($_.effect);
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
		if (!$.R) {
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
		this.call$();
		this.V = newValue;
	}
	/**
	 * @returns {void}
	 */
	call$ = () => {
		this.S.forEach((subsciber) => subsciber());
	};
}
/**
 * @template Value
 * @param {Value} value
 * @returns {Signal<Value>}
 */
export const NewSignal = (value) => new Signal(value);
