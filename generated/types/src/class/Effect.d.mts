import { Signal } from './Signal.mjs';
import { FactoryKey } from '../common/FactoryKey.mjs';
export type VivthCleanup = import('../typehints/VivthCleanup.mjs').VivthCleanup;
/**
 * @typedef { import('../typehints/VivthCleanup.mjs').VivthCleanup } VivthCleanup
 */
/**
 * @type {Map<Effect, Set<Signal<any>>>}
 */
export declare const mapOfEffects: Map<Effect, Set<Signal<any>>>;
/**
 * @description
 * - a class for creating effect;
 * - behaviour:
 * >- doesn't autosubscribe at first run;
 * >- it is using passed <b>subscribe</b> named `arg0` options as subscriber;
 * >- doesn't block other queues during first run;
 * >- can dynamically subscribes to signal, even on conditionals, that are not run during first run;
 * @implements {VivthCleanup}
 */
export declare class Effect implements VivthCleanup {
    #private;
    vivthCleanup: () => Promise<void>;
    /**
     * @description
     * @param {(
     * 		arg0: Effect["options"]
     * 	) => Promise<void>
     * } effect
     * @param {number} [maxTimelapseBeingDebounced]
     * - prevent rapid changes from being unhandled more than the value;
     * - in miliseconds;
     * - default: `2_000`;
     * @example
     * import { Signal, Derived, Effect, Console } from 'vivth/neutral';
     *
     * const count = new Signal(0);
     *
     * // double listen to count changes
     * const double = new Derived(async({subscribe}) => subscribe(count).value \* 2);
     *
     * new Effect(async ({
     * 			subscribe, // : registrar callback for this effect instance, immediately return the signal instance
     * 			removeEffect, // : disable this effect instance from reacting to dependency changes;
     * 			isLastCalled, // : check whether this callback run is this instance last called effect;
     * 		}) => {
     * 			const { value: currentValue, prev: prevValue } = subscribe(double); // effect listen to double changes
     * 			Console.log({ currentValue, prevValue });
     * })
     *
     * count.value++;
     */
    constructor(effect: (arg0: Effect["options"]) => Promise<void>, maxTimelapseBeingDebounced?: number);
    /**
     * @description
     * - collections of methods to handle effect calls of this instance;
     */
    options: {
        /**
         * @instance options
         * @description
         * - subscribe to `Signal_instance`;
         * - normally it's passed as argument to constructor, however it is also accessible from `options` property;
         * @template {Signal<any>} SIGV
         * @param {SIGV} signalInstance
         * @returns {SIGV}
         * @example
         * import { Signal, Effect } from 'vivth/neutral';
         *
         * const signal1 = new Signal(0);
         * const signal2 = new Signal(true);
         * const signal3 = new Signal(true);
         * const effect = new Effect(async ({ subscribe }) => {
         * 	const signal1Value = subscribe(signal1).value;
         * 	if(signal1Value % 2){
         * 		// only subscribe to signal3, on conditional block
         * 		const signal3Value = subscribe(signal3).value;
         * 	}
         * })
         * effect.options.subscribe(signal2);
         */
        subscribe: <SIGV extends Signal<any>>(signalInstance: SIGV) => SIGV;
        /**
         * @instance options
         * @description
         * - the same with `.options.subscribe`, but for batches subscription;
         * - ideal for first run which to add signal to subscription on main condition;
         * - normally it's passed as argument to constructor, however it is also accessible from `options` property;
         * @template {ReadonlyArray<any>} T
         * @param {T} signalInstances
         * @returns {T}
         * @example
         * import { Signal, Effect } from 'vivth/neutral';
         *
         * const signal1 = new Signal(0);
         * const signal2 = new Signal(true);
         * const effect = new Effect(async ({ subscribes }) => {
         * 	const [{value: signal1Value}, {value: signal2Value}]= subscribes([signal1, signal2]);
         * })
         */
        subscribes: <T extends ReadonlyArray<any>>(signalInstances: T) => T;
        /**
         * @instance options
         * @description
         * - normally it's passed as argument to constructor, however it is also accessible from `options` property;
         * @type {()=>void}
         * @example
         * import { Effect } from 'vivth/neutral';
         *
         * const effect = new Effect(async ({removeEffect}) => {
         * 	if(someCondition){
         * 		removeEffect();
         * 		return
         * 	}
         * })
         * // OR
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
         * import { Effect, Signal } from 'vivth/neutral';
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
        /**
         * @description
         * - remove inputed `SignalCollection` from this `Effect_instance`;
         * - normally it's passed as argument to constructor, however it is also accessible from `options` property;
         * @param {import('./SignalCollection.mjs').SignalCollection<Record<string, Signal<any>>>} collectionInstance
         * @returns {void}
         * @example
         * import { Signal, Derived, Effect, SignalCollection } from 'vivth/neutral';
         *
         * const a = new Signal('a');
         * const b = new Signal('b');
         * const c = new Derived(async ({ subscribe }) => {
         * 	return `${subscribe(b).value}_b`;
         * });
         * const f = new SignalCollection({ a, c });
         *
         * const e = new Effect(async ({ subscribe, isLastCalled, removeCollection }) => {
         * 	const {
         * 		a: { value: aa }, // safely desctructured and auto subscribed
         * 		c: { value: cc }, // safely desctructured and auto subscribed
         * 	} = f.signals(subscribe);
         * 	if(!await isLastCalled(100)) {
         * 		return; // impertaive debounce
         * 	}
         * 	// removeCollection(f); // standard call from outside callback;
         * });
         * // optional call from outside callback;
         * e.options.removeCollection(f)
         */
        removeCollection: (collectionInstance: import('./SignalCollection.mjs').SignalCollection<Record<string, Signal<any>>>) => void;
        /**
         * @instance options
         * @description
         * @returns {(timeoutMS?:number)=>Promise<boolean>}
         * - timeoutMS only necessary if the operation doesn't naturally await;
         * - if it's operation such as `fetch`, you can just leave it blank;
         * @example
         *
         * import { Effect } from 'vivth/neutral';
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
    } & {
        [FactoryKey]: FACTORY;
    };
    /**
     * @description
     * - normally is to let to be automatically run when dependency signals changes, however it's also accessible as instance method;
     * @type {()=>void}
     * @example
     * import { Effect } from 'vivth/neutral';
     *
     * const effect = new Effect(async ()=>{
     * 	// code
     * })
     * effect.run();
     */
    run: () => void;
}
