// @ts-check

import { Signal } from './Signal.mjs';
import { isAsync } from '../common.mjs';
import { $ } from './$.mjs';

/**
 * @description
 * - a class for creating signal which its value are derived from other signal (`Derived` and `Signal` alike);
 * ```js
 * import { $, Derived, Signal } from 'vivth';
 * const signal = new Signal(0);
 * const derived = new Derived(async () =>{
 *  // runs everytime signal.value changes;
 *  return signal.value * 2;
 * });
 * const autosubscriber = new $(async ()=>{
 *  // runs everytime derived.value changes;
 *  console.log(derived.value);
 * });
 * signal.value = 1;
 * ```
 */
/**
 * @template V
 * @extends Signal<V>
 */
export class Derived extends Signal {
	/**
	 * @param {(arg:{remove$:$["remove$"]})=>V} derivedFunction
	 */
	constructor(derivedFunction) {
		super(undefined);
		const real = isAsync(derivedFunction)
			? /**
			   * @param {{remove$:$["remove$"]}} options
			   */
			  async (options) => {
					super.value = await derivedFunction(options);
			  }
			: /**
			   * @param {{remove$:$["remove$"]}} options
			   */
			  (options) => {
					super.value = derivedFunction(options);
			  };
		new $(real);
	}
	/**
	 * @type {V}
	 */
	get value() {
		return super.value;
	}
	/**
	 * @private
	 */
	set value(_) {
		console.warn({
			derivedInstance: this,
			warning: 'NewDerived.value cannot be manually assigned',
		});
	}
}
