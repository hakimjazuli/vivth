/**
 * @type {Map<Effect, Set<Signal<any>>>}
 */
export const mapOfEffects: Map<Effect, Set<Signal<any>>>;
/**
 * @description
 * - a class for creating effect;
 * - compared to previous class <b>$</b> reactivity model, `Effect`:
 * >- doesn't autosubscribe at first run;
 * >- it is using passed <b>$</b> named `arg0` options as subscriber;
 * >- doesn't block other queues during first run(previously blocks other queues to safely register signal autoscubscriber);
 * >- now can dynamically subscribes to signal, even on conditionals, that are not run during first run;
 */
export class Effect {
    /**
     * @description
     * @param {( arg0:
     * Omit<Effect["options"], typeof unwrapLazy>
     * ) =>
     * Promise<void>} effect
     * @example
     * import { Signal, Derived, Effect, Console } from  'vivth';
     *
     * const count = new Signal(0);
     * const double = new Derived( async({$}) => $(count).value \* 2); // double listen to count changes
     * new Effect(async ({
     * 			subscribe, // : registrar callback for this effect instance, immediately return the signal instance
     * 			removeEffect, // : disable this effect instance from reacting to dependency changes;
     * 			isLastCalled, // : check whether this callback run is this instant last called effect;
     * 		}) => {
     * 			Console.log(subscribe(double).value); // effect listen to double changes
     * 			const a = double.value; //  no need to wrap double twice with $
     * })
     *
     * count.value++;
     */
    constructor(effect: (arg0: Omit<Effect["options"], typeof unwrapLazy>) => Promise<void>);
    /**
     * @typedef {import('../common/lazie.mjs').unwrapLazy} unwrapLazy
     */
    /**
     * @description
     * - collections of lazy methods to handle effect calls of this instance;
     */
    options: {
        /**
         * @instance options
         * @description
         * @returns {(timeoutMS?:number)=>Promise<boolean>}
         * - timeoutMS only necessary if the operation doesn't naturally await;
         * - if it's operation such as `fetch`, you can just leave it blank;
         * @example
         *
         * import { Effect } from 'vivth';
         *
         * const effect = new Effect(async ({ isLastCalled }) => {
         * 	if (!(await isLastCalled(100))) {
         * 		return;
         * 	}
         * 	// OR
         * 	const res = await fetch('some/path');
         * 	if (!(await isLastCalled(
         * 		// no need to add timeoutMS argument, as fetch are naturally add delay;
         * 	))) {
         * 		return;
         * 	}
         * })
         */
        readonly isLastCalled: (timeoutMS?: number) => Promise<boolean>;
        /**
         * @instance options
         * @description
         * - subscribe to `Signal_instance`;
         * - normally it's passed as argument to constructor, however it is also accessible from `options` property;
         * @template V
         * @param {Signal<V>} signalInstance
         * @returns {Signal<V>}
         * @example
         * import { Effect } from 'vivth';
         *
         * const effect = new Effect(async () => {
         * 	// code
         * })
         * effect.options.subscribe(signalInstance);
         */
        subscribe: <V>(signalInstance: Signal<V>) => Signal<V>;
        /**
         * @instance options
         * @description
         * - normally it's passed as argument to constructor, however it is also accessible from `options` property;
         * @type {()=>void}
         * @example
         * import { Effect } from 'vivth';
         *
         * const effect = new Effect(async () => {
         * 	// code
         * })
         * effect.options.removeEffect();
         */
        removeEffect: () => void;
        /**
         * @description
         * - remove inputed signal from this `Effect_instance`;
         * - if effect signal has no other `Signal_instance` to listen to, it will then completely rendered non reactive;
         * - normally it's passed as argument to constructor, however it is also accessible from `options` property;
         * @param {Signal<any>} signalInstance
         * @returns {void}
         * @example
         * import { Effect, Signal } from 'vivth';
         *
         * const count = new Signal(0);
         * const effect = new Effect(async ({ subscribe }) => {
         * 	console.log(subscribe(count).value); // will subscribe  count changes;
         * })
         * count.value++; // will increase the count and trigger effect;
         * effect.options.removeSignal(count);
         * count.value++; // will increase the count but will no longer trigger effect;
         */
        removeSignal: (signalInstance: Signal<any>) => void;
    } & {
        "vivth:unwrapLazy;": () => {
            /**
             * @instance options
             * @description
             * @returns {(timeoutMS?:number)=>Promise<boolean>}
             * - timeoutMS only necessary if the operation doesn't naturally await;
             * - if it's operation such as `fetch`, you can just leave it blank;
             * @example
             *
             * import { Effect } from 'vivth';
             *
             * const effect = new Effect(async ({ isLastCalled }) => {
             * 	if (!(await isLastCalled(100))) {
             * 		return;
             * 	}
             * 	// OR
             * 	const res = await fetch('some/path');
             * 	if (!(await isLastCalled(
             * 		// no need to add timeoutMS argument, as fetch are naturally add delay;
             * 	))) {
             * 		return;
             * 	}
             * })
             */
            readonly isLastCalled: (timeoutMS?: number) => Promise<boolean>;
            /**
             * @instance options
             * @description
             * - subscribe to `Signal_instance`;
             * - normally it's passed as argument to constructor, however it is also accessible from `options` property;
             * @template V
             * @param {Signal<V>} signalInstance
             * @returns {Signal<V>}
             * @example
             * import { Effect } from 'vivth';
             *
             * const effect = new Effect(async () => {
             * 	// code
             * })
             * effect.options.subscribe(signalInstance);
             */
            subscribe: <V>(signalInstance: Signal<V>) => Signal<V>;
            /**
             * @instance options
             * @description
             * - normally it's passed as argument to constructor, however it is also accessible from `options` property;
             * @type {()=>void}
             * @example
             * import { Effect } from 'vivth';
             *
             * const effect = new Effect(async () => {
             * 	// code
             * })
             * effect.options.removeEffect();
             */
            removeEffect: () => void;
            /**
             * @description
             * - remove inputed signal from this `Effect_instance`;
             * - if effect signal has no other `Signal_instance` to listen to, it will then completely rendered non reactive;
             * - normally it's passed as argument to constructor, however it is also accessible from `options` property;
             * @param {Signal<any>} signalInstance
             * @returns {void}
             * @example
             * import { Effect, Signal } from 'vivth';
             *
             * const count = new Signal(0);
             * const effect = new Effect(async ({ subscribe }) => {
             * 	console.log(subscribe(count).value); // will subscribe  count changes;
             * })
             * count.value++; // will increase the count and trigger effect;
             * effect.options.removeSignal(count);
             * count.value++; // will increase the count but will no longer trigger effect;
             */
            removeSignal: (signalInstance: Signal<any>) => void;
        };
    };
    /**
     * @description
     * - normally is to let to be automatically run when dependency signals changes, however it's also accessible as instance method;
     * @returns {void}
     * @example
     * import { Effect } from 'vivth';
     *
     * const effect = new Effect(async ()=>{
     * 	// code
     * })
     * effect.run();
     */
    run: () => void;
    #private;
}
import { Signal } from './Signal.mjs';
type unwrapLazy = "vivth:unwrapLazy;";
import { unwrapLazy } from '../common/lazie.mjs';
export {};
