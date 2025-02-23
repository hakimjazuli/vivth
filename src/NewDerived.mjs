// @ts-check

import { Signal } from './NewSignal.mjs';
import { New$ } from './New$.mjs';
import { isAsync } from './common.mjs';

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

/**
 * @template V
 * @param {()=>(V)} derivedFunction
 * @returns {Derived<V>}
 */
export const NewDerived = (derivedFunction) => new Derived(derivedFunction);
