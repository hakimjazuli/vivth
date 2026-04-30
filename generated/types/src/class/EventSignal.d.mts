/**
 * @description
 * - Signal implementation for `CustomEvent`, to dispatch and listen;
 * - it's based on string as key, so it can be listened/dispatched even without direct instance reference;
 * @template {any} TYPE
 */
export class EventSignal<TYPE extends unknown> {
    /**
     * - `Map` of `EventSignal`, using the `stringName` of the `EventSignal_instance` as `key`;
     * @type {Map<string, EventSignal<any>>}
     */
    static "__#private@#map": Map<string, EventSignal<any>>;
    /**
     * @type {QChannel<string>}
     */
    static "__#private@#qChannelEventSignal": QChannel<string>;
    /**
     * @description
     * - the constructor it self is set to `private`;
     * - it's globally queued:
     * >- the `Promise` nature is to prevent race condition on creating the instance;
     * @param {string} stringName
     * @returns {Promise<EventSignal<any>>}
     * @example
     * import { EventSignal, Trace } from 'vivth';
     *
     * const myEventSignal = await EventSignal.get('dataEvent');
     * // recommendation
     * const myEventSignalGenerator = async (name) => {
     * 	return await EventSignal.get(`myEventSignalGenerator:${name}`);
     * }
     */
    static get: (stringName: string) => Promise<EventSignal<any>>;
    /**
     * @description
     * - methods of this static property is lazily created;
     * - remove signal and effect subscription of the named `EventSignal_instance`;
     */
    static remove: {
        /**
         * @static remove
         * @description
         * - remove subscriber from the named `EventSignal_instance`;
         * @param {string} name
         * @param {import('./Effect.mjs').Effect} effectInstance
         * @returns {void}
         * @example
         * import { EventSignal } from 'vivth';
         *
         * EventSignal.remove.subscriber('yourEventSignalName', myEffectInstance);
         */
        subscriber: (name: string, effectInstance: import("./Effect.mjs").Effect) => void;
        /**
         * @static remove
         * @description
         * - remove all subscribers from the named `EventSignal_instance`;
         * @param {string} name
         * @returns {void}
         * @example
         * import { EventSignal } from 'vivth';
         *
         * EventSignal.remove.allSubscribers('yourEventSignalName');
         */
        allSubscribers: (name: string) => void;
        /**
         * @static remove
         * @description
         * - remove reference of the `proxySignals` of the named `EventSignal_instance`;
         * @param {string} name
         * @returns {void}
         * @example
         * import { EventSignal } from 'vivth';
         *
         * EventSignal.remove.refs('yourEventSignalName');
         */
        refs: (name: string) => void;
    } & {
        "vivth:unwrapLazy;": () => {
            /**
             * @static remove
             * @description
             * - remove subscriber from the named `EventSignal_instance`;
             * @param {string} name
             * @param {import('./Effect.mjs').Effect} effectInstance
             * @returns {void}
             * @example
             * import { EventSignal } from 'vivth';
             *
             * EventSignal.remove.subscriber('yourEventSignalName', myEffectInstance);
             */
            subscriber: (name: string, effectInstance: import("./Effect.mjs").Effect) => void;
            /**
             * @static remove
             * @description
             * - remove all subscribers from the named `EventSignal_instance`;
             * @param {string} name
             * @returns {void}
             * @example
             * import { EventSignal } from 'vivth';
             *
             * EventSignal.remove.allSubscribers('yourEventSignalName');
             */
            allSubscribers: (name: string) => void;
            /**
             * @static remove
             * @description
             * - remove reference of the `proxySignals` of the named `EventSignal_instance`;
             * @param {string} name
             * @returns {void}
             * @example
             * import { EventSignal } from 'vivth';
             *
             * EventSignal.remove.refs('yourEventSignalName');
             */
            refs: (name: string) => void;
        };
    };
    /**
     * @private
     * @param {string} name
     */
    private constructor();
    /**
     * @type {string}
     */
    name: string;
    /**
     * @description
     * - is [Signal](#signal) instance;
     * - if needed to pass along the messages, it can be used as `dispatcher` and `listener` at the same time;
     * - is `lazily` created;
     * @type {Signal<TYPE>}
     * @example
     * import { EventSignal, Effect, Console } from 'vivth';
     *
     * const myEventSignal = await EventSignal.get('dataEvent', false);
     *
     * new Effect(({ subscribe })=>{
     * 	const listenValue = subscribe(myEventSignal.dispatch).value;
     * 	// dispatch can be used as two way communication;
     * 	Console.log({ listenValue });
     * })
     * myEventSignal.dispatch.value = 'hey';
     */
    dispatcher: Signal<TYPE>;
    /**
     * @description
     * - is [Derived](#derived);
     * - can be used as listener when passed down value shouldn't be modified manually;
     * - is `lazily` created along with `dispatch`, if `listen` is accessed first, then `dispatch` will also be created automatically;
     * @type {Derived<TYPE>}
     * @example
     * import { EventSignal, Effect, Console } from 'vivth';
     *
     * const myEventSignal = await EventSignal.get('dataEvent', false);
     *
     * new Effect(({ subscribe })=>{
     * 	const listenValue = subscribe(myEventSignal.listen).value;
     * 	// listen can be used only as listener for one way communication;
     * 	Console.log({ listenValue });
     * })
     * myEventSignal.dispatch.value = 'hey';
     */
    listener: Derived<TYPE>;
    remove: {
        /**
         * @instance remove
         * @description
         * - remove subscriber from the `EventSignal_instance`;
         * @param {import('./Effect.mjs').Effect} effectInstance
         * @returns {void}
         * @example
         * import { EventSignal, Effect, Console } from 'vivth';
         *
         * const myEventSignal = await EventSignal.get('dataEvent', false);
         *
         * const myEffectInstance = new Effect(({ subscribe })=>{
         * 	const listenValue = subscribe(myEventSignal.dispatch).value;
         * 	Console.log({ listenValue });
         * })
         * myEventSignal.dispatch.value = 'hey';
         * eventSignal_instance.remove.subscriber(myEffectInstance);
         */
        subscriber: (effectInstance: import("./Effect.mjs").Effect) => void;
        /**
         * @instance remove
         * @description
         * - remove allSubscribers from the `EventSignal_instance`;
         * @type  {()=>void}
         * @example
         * import { EventSignal, Effect, Console } from 'vivth';
         *
         * const myEventSignal = await EventSignal.get('dataEvent', false);
         *
         * const myEffectInstance = new Effect(({ subscribe })=>{
         * 	const listenValue = subscribe(myEventSignal.dispatch).value;
         * 	Console.log({ listenValue });
         * })
         * myEventSignal.dispatch.value = 'hey';
         * eventSignal_instance.remove.allSubscribers();
         */
        allSubscribers: () => void;
        /**
         * @instance remove
         * @description
         * - remove reference of the `proxySignals` of the `EventSignal_instance`;
         * @type {()=>void}
         * @example
         * import { EventSignal, Effect, Console } from 'vivth';
         *
         * const myEventSignal = await EventSignal.get('dataEvent', false);
         *
         * const myEffectInstance = new Effect(({ subscribe })=>{
         * 	const listenValue = subscribe(myEventSignal.dispatch).value;
         * 	Console.log({ listenValue });
         * });
         *
         * eventSignal_instance.remove.ref();
         */
        ref: () => void;
    } & {
        "vivth:unwrapLazy;": () => {
            /**
             * @instance remove
             * @description
             * - remove subscriber from the `EventSignal_instance`;
             * @param {import('./Effect.mjs').Effect} effectInstance
             * @returns {void}
             * @example
             * import { EventSignal, Effect, Console } from 'vivth';
             *
             * const myEventSignal = await EventSignal.get('dataEvent', false);
             *
             * const myEffectInstance = new Effect(({ subscribe })=>{
             * 	const listenValue = subscribe(myEventSignal.dispatch).value;
             * 	Console.log({ listenValue });
             * })
             * myEventSignal.dispatch.value = 'hey';
             * eventSignal_instance.remove.subscriber(myEffectInstance);
             */
            subscriber: (effectInstance: import("./Effect.mjs").Effect) => void;
            /**
             * @instance remove
             * @description
             * - remove allSubscribers from the `EventSignal_instance`;
             * @type  {()=>void}
             * @example
             * import { EventSignal, Effect, Console } from 'vivth';
             *
             * const myEventSignal = await EventSignal.get('dataEvent', false);
             *
             * const myEffectInstance = new Effect(({ subscribe })=>{
             * 	const listenValue = subscribe(myEventSignal.dispatch).value;
             * 	Console.log({ listenValue });
             * })
             * myEventSignal.dispatch.value = 'hey';
             * eventSignal_instance.remove.allSubscribers();
             */
            allSubscribers: () => void;
            /**
             * @instance remove
             * @description
             * - remove reference of the `proxySignals` of the `EventSignal_instance`;
             * @type {()=>void}
             * @example
             * import { EventSignal, Effect, Console } from 'vivth';
             *
             * const myEventSignal = await EventSignal.get('dataEvent', false);
             *
             * const myEffectInstance = new Effect(({ subscribe })=>{
             * 	const listenValue = subscribe(myEventSignal.dispatch).value;
             * 	Console.log({ listenValue });
             * });
             *
             * eventSignal_instance.remove.ref();
             */
            ref: () => void;
        };
    };
}
import { Signal } from './Signal.mjs';
import { Derived } from './Derived.mjs';
import { QChannel } from './QChannel.mjs';
