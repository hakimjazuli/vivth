/**
 * @description
 * - a class for creating derived version of [Signal](#signal);
 * @template VALUE
 * @extends Signal<VALUE|undefined>
 */
export class Derived<VALUE> extends Signal<VALUE | undefined> {
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
    constructor(derivedFunction: (effectInstanceOptions: Parameters<ConstructorParameters<typeof Effect>[0]>[0] & {
        dontUpdate: Derived<VALUE>["dontUpdate"];
    }) => Promise<Derived<VALUE>["dontUpdate"] | VALUE>, maxTimelapseBeingDebounced?: ConstructorParameters<typeof Effect>[1]);
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
    dontUpdate: Symbol;
}
import { Signal } from './Signal.mjs';
import { Effect } from './Effect.mjs';
