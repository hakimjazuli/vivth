/**
 * @typedef { import('../typehints/VivthCleanup.mjs').VivthCleanup } VivthCleanup
 */
/**
 * @type {Set<Signal<any>>}
 */
export const setOFSignals: Set<Signal<any>>;
/**
 * @description
 * - a class for creating effect to signals;
 * @template VALUE
 * @implements {VivthCleanup}
 */
export class Signal<VALUE> implements VivthCleanup {
    /**
     * @param {Signal<any>} signalInstance
     * @param {(error:Error|undefined)=>void} [afterCompletion]
     * @returns {Promise<void>}
     */
    static #notify: (signalInstance: Signal<any>, afterCompletion?: (error: Error | undefined) => void) => Promise<void>;
    /**
     * @description
     * - create a `Signal`;
     * @param {VALUE} value
     * @param {(data:DataLog<VALUE>)=>void} [performanceChangesReport]
     * - callback independent from effect;
     * >- it will always be called when there's value change;
     * @example
     * import { Signal, Effect } from 'vivth/neutral';
     *
     * const count = new Signal(0);
     */
    constructor(value: VALUE, performanceChangesReport?: (data: DataLog<VALUE>) => void);
    vivthCleanup: () => Promise<void>;
    /**
     * @description
     * - subsrcibers reference of this instance;
     */
    subscribers: {
        /**
         * @instance subscribers
         * @description
         * - subscribedEffects
         * @type {Set<Effect>}
         */
        setOf: Set<Effect>;
        /**
         * @instance subscribers
         * @description
         * - manually notify on non primitive value or value that have depths;
         * @param {(options:{signalInstance:Signal<VALUE>})=>Promise<void>} [callback]
         * @param {(error:Error|undefined)=>Promise<void>} [afterCompletion]
         * @returns {Promise<void>}
         * @example
         * import { Signal } from 'vivth/neutral';
         *
         * // for deep signal like array or object you can:
         * const arraySignal = new Signal([1,2]);
         * arraySignal.value.push(3);
         * arraySignal.subscribers.notify();
         *
         * // OR for more complex mutation:
         * const objectSignal = new Signal({a:'test', b:'test'});
         * objectSignal.subscribers.notify(async ({ signalInstance }) => {
         * 	signalInstance.value['c'] = 'testc';
         * 	signalInstance.value['d'] = 'testd';
         * });
         */
        notify: (callback?: (options: {
            signalInstance: Signal<VALUE>;
        }) => Promise<void>, afterCompletion?: (error: Error | undefined) => Promise<void>) => Promise<void>;
    } & {
        [x: symbol]: {
            /**
             * @instance subscribers
             * @description
             * - subscribedEffects
             * @type {Set<Effect>}
             */
            setOf: Set<Effect>;
            /**
             * @instance subscribers
             * @description
             * - manually notify on non primitive value or value that have depths;
             * @param {(options:{signalInstance:Signal<VALUE>})=>Promise<void>} [callback]
             * @param {(error:Error|undefined)=>Promise<void>} [afterCompletion]
             * @returns {Promise<void>}
             * @example
             * import { Signal } from 'vivth/neutral';
             *
             * // for deep signal like array or object you can:
             * const arraySignal = new Signal([1,2]);
             * arraySignal.value.push(3);
             * arraySignal.subscribers.notify();
             *
             * // OR for more complex mutation:
             * const objectSignal = new Signal({a:'test', b:'test'});
             * objectSignal.subscribers.notify(async ({ signalInstance }) => {
             * 	signalInstance.value['c'] = 'testc';
             * 	signalInstance.value['d'] = 'testd';
             * });
             */
            notify: (callback?: (options: {
                signalInstance: Signal<VALUE>;
            }) => Promise<void>, afterCompletion?: (error: Error | undefined) => Promise<void>) => Promise<void>;
        };
    };
    /**
     * @description
     * - collection of remove methods
     */
    remove: {
        /**
         * @instance remove
         * @description
         * - remove effect subscriber to react from this instance value changes;
         * @param {Effect} effectInstance
         * @returns {void}
         */
        subscriber: (effectInstance: Effect) => void;
        /**
         * @instance remove
         * @description
         * - remove all effect subscribers to react from this instance value changes;
         * @type {()=>void}
         */
        allSubscribers: () => void;
        /**
         * @instance remove
         * @description
         * - remove this instance from `vivth` reactivity engine, and nullify it's own value;
         * @type {()=>void}
         */
        ref: () => void;
    } & {
        [x: symbol]: {
            /**
             * @instance remove
             * @description
             * - remove effect subscriber to react from this instance value changes;
             * @param {Effect} effectInstance
             * @returns {void}
             */
            subscriber: (effectInstance: Effect) => void;
            /**
             * @instance remove
             * @description
             * - remove all effect subscribers to react from this instance value changes;
             * @type {()=>void}
             */
            allSubscribers: () => void;
            /**
             * @instance remove
             * @description
             * - remove this instance from `vivth` reactivity engine, and nullify it's own value;
             * @type {()=>void}
             */
            ref: () => void;
        };
    };
    /**
     * @description
     * - value before change;
     * @returns {VALUE|undefined}
     */
    get prev(): VALUE | undefined;
    /**
     * @description
     * - assign new value then automatically notify all subscribers;
     * @type {VALUE}
     * @example
     * import { Signal } from 'vivth/neutral';
     *
     * const count = new Signal(0);
     * count.value++;
     * // OR
     * count.value = 9;
     */
    set value(newValue: VALUE);
    /**
     * @description
     * - value after change;
     * @returns {VALUE}
     * @example
     * import { Signal, Effect, Derived } from 'vivth/neutral';
     *
     * const count = new Signal(0);
     * count.value; // not reactive
     *
     * new Effect(async ({ subscribe }) =>{
     * 	const countValue = subscribe(count).value; // reactive
     * })
     * const oneMoreThanCount = new Derived(async function({ subscribe }){
     * 	return subscribe(count).value + 1; // reactive
     * })
     */
    get value(): VALUE;
    #private;
}
export type VivthCleanup = import("../typehints/VivthCleanup.mjs").VivthCleanup;
import { Effect } from './Effect.mjs';
import { DataLog } from './DataLog.mjs';
