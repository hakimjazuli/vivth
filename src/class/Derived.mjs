// @ts-check

import { Signal } from './Signal.mjs';
import { Console } from './Console.mjs';
import { Effect } from './Effect.mjs';
import { LazyFactory } from '../function/LazyFactory.mjs';
import { unwrapLazy } from '../common/lazie.mjs';

/**
 * @description
 * - a class for creating derived version of [Signal](#signal);
 * @template VALUE
 * @extends Signal<VALUE>
 */
export class Derived extends Signal {
	/**
	 * @description
	 * - Derived used [Signal](#signal) and [Effect](#effect) under the hood;
	 * @param {(effectInstanceOptions:Omit<Effect["options"] &
	 * Derived["options"], unwrapLazy>) =>
	 * Promise<VALUE>} derivedFunction
	 * @example
	 * import { Signal, Derived } from  'vivth';
	 *
	 * const count = new Signal(0);
	 * const double = new Derived(async({
	 * 		subscribe,
	 * 		// : registrar callback for this derived instance, immediately return the signal instance
	 * 	}) => {
	 * 	return subscribe(count).value + count.value;
	 * 	// double listen to count changes, by returning the value, double.value also changes
	 * 	// notice the count.value are accessed double, but it's all safe,
	 * 	// since the wrapped one is the only one that are recorded as notifier.
	 * });
	 *
	 * count.value++;
	 */
	constructor(derivedFunction) {
		super(undefined);
		const derived_instanceOptions = this.options;
		new Effect(async (options) => {
			const currentValue = await derivedFunction({
				...options,
				...derived_instanceOptions[unwrapLazy](),
			});
			if (currentValue === derived_instanceOptions.dontUpdate) {
				return;
			}
			super.value = currentValue;
		});
	}
	/**
	 * @description
	 * - additional helper to be accessed on effect;
	 */
	options = LazyFactory(() => {
		return {
			/**
			 * @instance options
			 * @description
			 * - return this value tandem with `isLastCalled`, to not to update the value of this instance, even when returning early;
			 * @type {Object}
			 * @example
			 * import { Signal, Derived } from  'vivth';
			 *
			 * const count = new Signal(0);
			 * const double = new Derived(async({
			 * 		subscribe,
			 * 		dontUpdate,
			 * 		isLastCalled,
			 * 	}) => {
			 * 		const currentValue = subscribe(count).value;
			 * 		if (!(await isLastCalled(10))) {
			 *			return dontUpdate;
			 * 		}
			 * 		const res = await fetch(`some/path/${curentValue.toString()}`);
			 * 		if (!(await isLastCalled())) {
			 *			return dontUpdate; // this will prevent race condition, even if the earlier fetch return late;
			 * 		}
			 * 		return res;
			 * });
			 *
			 * count.value++;
			 */
			dontUpdate: {},
		};
	});
	/**
	 * @description
	 * - the most recent value of the instance
	 * - can be turn into reactive with Effect or Derived instantiation;
	 * @returns {VALUE}
	 */
	get value() {
		return super.value;
	}
	/**
	 * @description
	 * - Derived instance value cannot be manually assigned;
	 * - it's value should always be determined by it's own `derivedFunction`;
	 * @private
	 * @type {VALUE}
	 */
	set value(newValue) {
		Console.warn({
			newValue,
			currentValue: super.value,
			derivedInstance: this,
			warning: 'derivedInstance.value cannot be manually assigned',
		});
	}
}
