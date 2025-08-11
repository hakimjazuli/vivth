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
	 * @param {()=>V} derivedFunction
	 */
	constructor(derivedFunction) {
		// @ts-expect-error
		super(0);
		const real = isAsync(derivedFunction)
			? async () => {
					super.value = await derivedFunction();
			  }
			: () => {
					super.value = derivedFunction();
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
