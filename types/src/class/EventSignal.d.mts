/**
 * @description
 * - Signal implementation for `CustomEvent`, to dispatch and listen;
 * - it's based on string as key, so it can be listened/dispatched even without direct instance reference;
 * @template {IsListSignal} ISLIST
 * - boolean;
 */
export class EventSignal<ISLIST extends boolean> {
    /**
     * @typedef {import('../types/IsListSignal.mjs').IsListSignal} IsListSignal
     */
    /**
     * @description
     * - `Map` of `EventSignal`, using the `stringName` of the `EventSignal_instance` as `key`;
     * @type {Map<string, EventSignal>}
     */
    static map: Map<string, EventSignal<any>>;
    /**
     * @type {QChannel<string>}
     */
    static #qChannelEventSignal: QChannel<string>;
    /**
     * @description
     * - the constructor it self is set to `private`;
     * - it's globally queued:
     * >- the `Promise` nature is to prevent race condition on creating the instance;
     * @param {string} stringName
     * @param {IsListSignal} [isList_]
     * @returns {Promise<EventSignal>}
     * @example
     * import { EventSignal } from 'vivth';
     *
     * const myEventSignal = await EventSignal.get('dataEvent');
     */
    static get(stringName: string, isList_?: boolean): Promise<EventSignal<any>>;
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
         * @param {import('./Effect.mjs').Effect} effect
         * @returns {void}
         * @example
         * import { EventSignal } from 'vivth';
         *
         * EventSignal.remove.subscriber('yourEventSignalName', myEffectInstance);
         */
        subscriber: (name: string, effect: import("./Effect.mjs").Effect) => void;
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
             * @param {import('./Effect.mjs').Effect} effect
             * @returns {void}
             * @example
             * import { EventSignal } from 'vivth';
             *
             * EventSignal.remove.subscriber('yourEventSignalName', myEffectInstance);
             */
            subscriber: (name: string, effect: import("./Effect.mjs").Effect) => void;
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
     * @param {ISLIST} [isList]
     */
    private constructor();
    /**
     * @type {string}
     */
    name: string;
    /**
     * @description
     * - is [Signal](#signal) or [ListSignal](#listsignal) instance, depending on the `isList` argument;
     * - if needed to pass along the messages, it can be used as `dispatcher` and `listener` at the same time;
     * - is `lazily` created;
     * @type {Signal|ListSignal}
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
    dispatch: Signal<any> | ListSignal<any>;
    /**
     * @description
     * - is [Derived](#derived) or [ListDerived](#listderived) instance, depending on the `isList` argument;
     * - can be used as listener when passed down value shouldn't be modified manually;
     * - is `lazily` created along with `dispatch`, if `listen` is accessed first, then `dispatch` will also be created automatically;
     * @type {Derived|ListDerived}
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
    listen: Derived<any> | ListDerived<any>;
    remove: {
        /**
         * @instance remove
         * @description
         * - remove subscriber from the `EventSignal_instance`;
         * @param {import('./Effect.mjs').Effect} effect
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
        subscriber: (effect: import("./Effect.mjs").Effect) => void;
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
             * @param {import('./Effect.mjs').Effect} effect
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
            subscriber: (effect: import("./Effect.mjs").Effect) => void;
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
    #private;
}
import { Signal } from './Signal.mjs';
import { ListSignal } from './ListSignal.mjs';
import { Derived } from './Derived.mjs';
import { ListDerived } from './ListDerived.mjs';
import { QChannel } from './QChannel.mjs';
