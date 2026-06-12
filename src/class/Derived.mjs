// @ts-check

import { Signal } from './Signal.mjs';
import { Console } from './Console.mjs';
import { Effect } from './Effect.mjs';

/**
 * @description
 * - a class for creating derived version of [Signal](#signal);
 * @template VALUE
 * @extends Signal<VALUE|undefined>
 */
export class Derived extends Signal {
	/**
	 * @description
	 * - Derived used [Signal](#signal) and [Effect](#effect) under the hood;
	 * @param {(
	 * 		effectInstanceOptions: Parameters<ConstructorParameters<typeof Effect>[0]>[0] &
	 * 		{
	 * 			dontUpdate:Derived<VALUE>["dontUpdate"]
	 * 		}
	 * 	) => Promise<Derived<VALUE>["dontUpdate"] | VALUE>
	 * } derivedFunction
	 * @param {ConstructorParameters<typeof Effect>[1]} [maxTimelapseBeingDebounced]
	 * - prevent rapid changes from being unhandled more than the value;
	 * - in miliseconds;
	 * - default: `2_000`;
	 * @example
	 * import { Signal, Derived } from 'vivth/neutral';
	 *
	 * const count = new Signal(0);
	 * const double = new Derived(async({
	 * 		subscribe,
	 * 		// : registrar callback for this derived instance, immediately return the signal instance
	 * 	}) => {
	 * 	return subscribe(count).value \* 2;
	 * 	// double listen to count changes, by returning the value, double.value also changes
	 * 	// notice the count.value are accessed double, but it's all safe,
	 * 	// since the wrapped one is the only one that are recorded as notifier.
	 * });
	 *
	 * count.value++;
	 */
	constructor(derivedFunction, maxTimelapseBeingDebounced = undefined) {
		super(undefined);
		new Effect(async (options) => {
			const currentValue = await derivedFunction(
				Object.assign(options, { dontUpdate: this.dontUpdate }),
			);
			if (currentValue === this.dontUpdate) {
				return;
			}
			// @ts-expect-error
			super.value = currentValue;
		}, maxTimelapseBeingDebounced);
	}
	/**
	 * @description
	 * - return this value to not to update the value of this instance, even when returning early;
	 * @type {Symbol}
	 * @example
	 * import { Signal, Derived } from 'vivth/neutral';
	 *
	 * const count = new Signal(0);
	 * const double = new Derived(async({
	 * 		subscribe,
	 * 		isLastCalled,
	 * 	}) => {
	 * 		if(!(await isLastCalled(100))) {
	 * 			return this.dontUpdate;
	 * 		}
	 * 		const currentValue = subscribe(count).value;
	 * 		const res = await fetch(`some/path/${curentValue.toString()}`);
	 * 		if (
	 * 			!(await isLastCalled()) ||
	 * 			!res
	 * 		) {
	 * 			// returning early prevent race condition, even if the earlier fetch return late;
	 *			return this.dontUpdate;
	 *			// returning this.dontUpdate, will not modify the derived instance value;
	 * 		}
	 * 		count.value++;
	 * 		return res;
	 * });
	 *
	 */
	dontUpdate = Symbol('');
	/**
	 * @description
	 * - the most recent value of the instance;
	 * - can be turn into reactive with Effect or Derived instantiation;
	 * - value are allowed to be `undefined` and always be `undefined` at the instantiation time;
	 * >- make sure to put a check before consuming(inside an `Effect`);
	 * @returns {VALUE|undefined}
	 * @override
	 * @example
	 * import { Signal, Derived, Effect } from 'vivth/neutral';
	 *
	 * const numberSignal = new Signal(0);
	 * const doubleDerived = new Derived(async({ subscribe }) => {
	 * 	return subscribe(numberSignal).value \* 2;
	 * });
	 *
	 * new Effect(async({ subscribe }) => {
	 * 	console.log(subscribe(doubleDerived).value);
	 * })
	 * numberSignal++;
	 */
	get value() {
		return super.value;
	}
	/**
	 * @description
	 * - Derived instance value cannot be manually assigned;
	 * - it's value should always be determined by it's own returned value from `derivedFunction`;
	 * @private
	 * @type {(value:VALUE|undefined)=>void}
	 * @override
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
