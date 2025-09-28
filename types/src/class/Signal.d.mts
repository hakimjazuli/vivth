/**
 * @type {Set<Signal>}
 */
export const setOFSignals: Set<Signal<any>>;
/**
 * @description
 * - a class for creating effect to signals;
 * @template VALUE
 */
export class Signal<VALUE> {
    /**
     * @param {Set<Effect>} setOfSubscribers
     */
    static #notify: (setOfSubscribers: Set<Effect>) => void;
    /**
     * @description
     * - create a `Signal`;
     * @param {VALUE} value
     * @example
     * import { Signal, Effect } from  'vivth';
     *
     * const count = new Signal(0);
     */
    constructor(value: VALUE);
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
         * @returns {void}
         * @example
         * import { Signal } from 'vivth';
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
        }) => Promise<void>) => void;
    } & {
        "vivth:unwrapLazy;": () => {
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
             * @returns {void}
             * @example
             * import { Signal } from 'vivth';
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
            }) => Promise<void>) => void;
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
        "vivth:unwrapLazy;": () => {
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
     * @returns {VALUE}
     */
    get prev(): VALUE;
    /**
     * @description
     * - assign new value then automatically notify all subscribers;
     * @type {VALUE}
     * @example
     * import { Signal } from  'vivth';
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
     * import { Signal, Effect, Derived } from  'vivth';
     *
     * const count = new Signal(0);
     * count.value; // not reactive
     *
     * new Effect(async ({ subscribe }) =>{
     * 	const countValue = subscribe(count).value; // reactive
     * })
     * const oneMoreThanCount = new Derived(async ({ subscribe }) =>{
     * 	return subscribe(count).value + 1; // reactive
     * })
     */
    get value(): VALUE;
    #private;
}
import { Effect } from './Effect.mjs';
