// @ts-check

import { Signal } from './Signal.mjs';
import { New$ } from '../function//New$.mjs';
import { isAsync } from '../common.mjs';

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
					this.value = await derivedFunction();
			  }
			: () => {
					this.value = derivedFunction();
			  };
		New$(real);
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
