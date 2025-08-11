// @ts-check

import { Signal } from './Signal.mjs';
import { $ } from './$.mjs';
import { isAsync } from '../common.mjs';

/**
 * @description
 * - a class for creating signal which its value are derived from other signal (`Derived` and `Signal` alike);
 * - can be subscribed by using [New$](#new$);
 * - for minimal total bundle size use `function` [NewDerived](#newderived) instead;
 */
/**
 * @template V
 * @extends Signal<V>
 */
export class Derived extends Signal {
	/**
	 * @param {(arg0:{remove$:()=>void})=>V} derivedFunction
	 */
	constructor(derivedFunction) {
		super(undefined);
		const real = isAsync(derivedFunction)
			? /**
			   * @param {{remove$:()=>void}} options
			   */
			  async (options) => {
					super.value = await derivedFunction(options);
			  }
			: /**
			   * @param {{remove$:()=>void}} options
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
