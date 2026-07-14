import { Derived } from './Derived.mjs';
import { Signal } from './Signal.mjs';
export type VivthCleanup = import('../typehints/VivthCleanup.mjs').VivthCleanup;
/**
 * @typedef { import('../typehints/VivthCleanup.mjs').VivthCleanup } VivthCleanup
 */
/**
 * @description
 * - Signal based on shared/globally available `Object` as key;
 * @template {any} SHAREDOBJECT
 * @implements {VivthCleanup}
 */
export declare class ObjectSignal<SHAREDOBJECT extends any> implements VivthCleanup {
    #private;
    vivthCleanup: () => Promise<void>;
    /**
     * @template {any} SHAREDOBJECT
     * @param {Object} object
     * @returns {Promise<ObjectSignal<SHAREDOBJECT>>}
     */
    static get<SHAREDOBJECT extends any>(object: Object): Promise<ObjectSignal<SHAREDOBJECT>>;
    /**
     * @private
     */
    private constructor();
    /**
     * @description
     * - is [Signal](#signal);
     * - if needed to pass along the messages, it can be used as `dispatcher` and `listener` at the same time;
     * - is `lazily` created;
     * @type {Signal<SHAREDOBJECT|undefined>}
     * @example
     * import { ObjectSignal, Effect, Console } from 'vivth/neutral';
     *
     * const myObjectSignal = await ObjectSignal.get('dataEvent', false);
     *
     * new Effect(({ subscribe })=>{
     * 	const listenValue = subscribe(myObjectSignal.dispatch).value;
     * 	// dispatch can be used as two way communication;
     * 	Console.log({ listenValue });
     * })
     * myObjectSignal.dispatch.value = 'hey';
     */
    dispatcher: Signal<SHAREDOBJECT | undefined>;
    /**
     * @description
     * - is [Derived](#derived);
     * - can be used as listener when passed down value shouldn't be modified manually;
     * - is `lazily` created along with `dispatch`, if `listen` is accessed first, then `dispatch` will also be created automatically;
     * @type {Derived<SHAREDOBJECT|undefined>}
     * @example
     * import { ObjectSignal, Effect, Console } from 'vivth/neutral';
     *
     * const myObjectSignal = await ObjectSignal.get('dataEvent', false);
     *
     * new Effect(({ subscribe })=>{
     * 	const listenValue = subscribe(myObjectSignal.listen).value;
     * 	// listen can be used only as listener for one way communication;
     * 	Console.log({ listenValue });
     * })
     * myObjectSignal.dispatch.value = 'hey';
     */
    listener: Derived<SHAREDOBJECT | undefined>;
    /**
     * @description
     * - methods of this static property is lazily created;
     * - remove signal and effect subscription of the named `ObjectSignal_instance`;
     */
    static remove: {
        /**
         * @static remove
         * @description
         * - remove subscriber from the named `ObjectSignal_instance`;
         * @param {string} name
         * @param {import('./Effect.mjs').Effect} effectInstance
         * @returns {void}
         * @example
         * import { ObjectSignal } from 'vivth/neutral';
         *
         * ObjectSignal.remove.subscriber('yourObjectSignalName', myEffectInstance);
         */
        subscriber: (name: string, effectInstance: import('./Effect.mjs').Effect) => void;
        /**
         * @static remove
         * @description
         * - remove all subscribers from the named `ObjectSignal_instance`;
         * @param {string} name
         * @returns {void}
         * @example
         * import { ObjectSignal } from 'vivth/neutral';
         *
         * ObjectSignal.remove.allSubscribers('yourObjectSignalName');
         */
        allSubscribers: (name: string) => void;
        /**
         * @static remove
         * @description
         * - remove reference of the `proxySignals` of the named `ObjectSignal_instance`;
         * @param {string} name
         * @returns {void}
         * @example
         * import { ObjectSignal } from 'vivth/neutral';
         *
         * ObjectSignal.remove.refs('yourObjectSignalName');
         */
        refs: (name: string) => void;
    } & {
        [x: symbol]: {
            /**
             * @static remove
             * @description
             * - remove subscriber from the named `ObjectSignal_instance`;
             * @param {string} name
             * @param {import('./Effect.mjs').Effect} effectInstance
             * @returns {void}
             * @example
             * import { ObjectSignal } from 'vivth/neutral';
             *
             * ObjectSignal.remove.subscriber('yourObjectSignalName', myEffectInstance);
             */
            subscriber: (name: string, effectInstance: import('./Effect.mjs').Effect) => void;
            /**
             * @static remove
             * @description
             * - remove all subscribers from the named `ObjectSignal_instance`;
             * @param {string} name
             * @returns {void}
             * @example
             * import { ObjectSignal } from 'vivth/neutral';
             *
             * ObjectSignal.remove.allSubscribers('yourObjectSignalName');
             */
            allSubscribers: (name: string) => void;
            /**
             * @static remove
             * @description
             * - remove reference of the `proxySignals` of the named `ObjectSignal_instance`;
             * @param {string} name
             * @returns {void}
             * @example
             * import { ObjectSignal } from 'vivth/neutral';
             *
             * ObjectSignal.remove.refs('yourObjectSignalName');
             */
            refs: (name: string) => void;
        };
    };
    remove: {
        /**
         * @instance remove
         * @description
         * - remove subscriber from the `ObjectSignal_instance`;
         * @param {import('./Effect.mjs').Effect} effectInstance
         * @returns {void}
         * @example
         * import { ObjectSignal, Effect, Console } from 'vivth/neutral';
         *
         * const myObjectSignal = await ObjectSignal.get('dataEvent', false);
         *
         * const myEffectInstance = new Effect(({ subscribe })=>{
         * 	const listenValue = subscribe(myObjectSignal.dispatch).value;
         * 	Console.log({ listenValue });
         * })
         * myObjectSignal.dispatch.value = 'hey';
         * objectSigObjectSignal_instance.remove.subscriber(myEffectInstance);
         */
        subscriber: (effectInstance: import('./Effect.mjs').Effect) => void;
        /**
         * @instance remove
         * @description
         * - remove allSubscribers from the `ObjectSignal_instance`;
         * @type  {()=>void}
         * @example
         * import { ObjectSignal, Effect, Console } from 'vivth/neutral';
         *
         * const myObjectSignal = await ObjectSignal.get('dataEvent', false);
         *
         * const myEffectInstance = new Effect(({ subscribe })=>{
         * 	const listenValue = subscribe(myObjectSignal.dispatch).value;
         * 	Console.log({ listenValue });
         * })
         * myObjectSignal.dispatch.value = 'hey';
         * objectSigObjectSignal_instance.remove.allSubscribers();
         */
        allSubscribers: () => void;
        /**
         * @instance remove
         * @description
         * - remove reference of the `proxySignals` of the `ObjectSignal_instance`;
         * @type {()=>void}
         * @example
         * import { ObjectSignal, Effect, Console } from 'vivth/neutral';
         *
         * const myObjectSignal = await ObjectSignal.get('dataEvent', false);
         *
         * const myEffectInstance = new Effect(({ subscribe })=>{
         * 	const listenValue = subscribe(myObjectSignal.dispatch).value;
         * 	Console.log({ listenValue });
         * });
         *
         * objectSigObjectSignal_instance.remove.ref();
         */
        ref: () => void;
    } & {
        [x: symbol]: {
            /**
             * @instance remove
             * @description
             * - remove subscriber from the `ObjectSignal_instance`;
             * @param {import('./Effect.mjs').Effect} effectInstance
             * @returns {void}
             * @example
             * import { ObjectSignal, Effect, Console } from 'vivth/neutral';
             *
             * const myObjectSignal = await ObjectSignal.get('dataEvent', false);
             *
             * const myEffectInstance = new Effect(({ subscribe })=>{
             * 	const listenValue = subscribe(myObjectSignal.dispatch).value;
             * 	Console.log({ listenValue });
             * })
             * myObjectSignal.dispatch.value = 'hey';
             * objectSigObjectSignal_instance.remove.subscriber(myEffectInstance);
             */
            subscriber: (effectInstance: import('./Effect.mjs').Effect) => void;
            /**
             * @instance remove
             * @description
             * - remove allSubscribers from the `ObjectSignal_instance`;
             * @type  {()=>void}
             * @example
             * import { ObjectSignal, Effect, Console } from 'vivth/neutral';
             *
             * const myObjectSignal = await ObjectSignal.get('dataEvent', false);
             *
             * const myEffectInstance = new Effect(({ subscribe })=>{
             * 	const listenValue = subscribe(myObjectSignal.dispatch).value;
             * 	Console.log({ listenValue });
             * })
             * myObjectSignal.dispatch.value = 'hey';
             * objectSigObjectSignal_instance.remove.allSubscribers();
             */
            allSubscribers: () => void;
            /**
             * @instance remove
             * @description
             * - remove reference of the `proxySignals` of the `ObjectSignal_instance`;
             * @type {()=>void}
             * @example
             * import { ObjectSignal, Effect, Console } from 'vivth/neutral';
             *
             * const myObjectSignal = await ObjectSignal.get('dataEvent', false);
             *
             * const myEffectInstance = new Effect(({ subscribe })=>{
             * 	const listenValue = subscribe(myObjectSignal.dispatch).value;
             * 	Console.log({ listenValue });
             * });
             *
             * objectSigObjectSignal_instance.remove.ref();
             */
            ref: () => void;
        };
    };
}
