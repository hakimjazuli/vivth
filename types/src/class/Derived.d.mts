/**
 * @description
 * - a class for creating derived version of [Signal](#signal);
 * @template V
 * @extends Signal<V>
 */
export class Derived<V> extends Signal<V> {
    /**
     * @description
     * - Derived used [Signal](#signal) and [Effect](#effect) under the hood;
     * @param {(effectInstanceOptions:Effect["options"])=>Promise<V>} derivedFunction
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
    constructor(derivedFunction: (effectInstanceOptions: Effect["options"]) => Promise<V>);
}
import { Signal } from './Signal.mjs';
import { Effect } from './Effect.mjs';
