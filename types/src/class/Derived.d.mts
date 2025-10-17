/**
 * @description
 * - a class for creating derived version of [Signal](#signal);
 * @template VALUE
 * @extends Signal<VALUE>
 */
export class Derived<VALUE> extends Signal<VALUE> {
    /**
     * @description
     * - Derived used [Signal](#signal) and [Effect](#effect) under the hood;
     * @param {(effectInstanceOptions:Omit<Effect["options"] &
     * Derived<VALUE>["options"], unwrapLazy>) =>
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
    constructor(derivedFunction: (effectInstanceOptions: Omit<Effect["options"] & Derived<VALUE>["options"], "vivth:unwrapLazy;">) => Promise<VALUE>);
    /**
     * @description
     * - additional helper to be accessed on effect;
     */
    options: {
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
        dontUpdate: Object;
    } & {
        "vivth:unwrapLazy;": () => {
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
            dontUpdate: Object;
        };
    };
}
import { Signal } from './Signal.mjs';
import { Effect } from './Effect.mjs';
