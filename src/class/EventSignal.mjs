// @ts-check

import { LazyFactory } from '../function/LazyFactory.mjs';
import { Derived } from './Derived.mjs';
import { ListDerived } from './ListDerived.mjs';
import { ListSignal } from './ListSignal.mjs';
import { QChannel } from './QChannel.mjs';
import { Signal } from './Signal.mjs';

/**
 * @description
 * - Signal implementation for `CustomEvent`, to dispatch and listen;
 * - it's based on string as key, so it can be listened/dispatched even without direct instance reference;
 * @template {IsListSignal} ISLIST
 * - boolean;
 */
export class EventSignal {
	/**
	 * @typedef {import('../types/IsListSignal.mjs').IsListSignal} IsListSignal
	 */
	/**
	 * @description
	 * - `Map` of `EventSignal`, using the `stringName` of the `EventSignal_instance` as `key`;
	 * @type {Map<string, EventSignal<any>>}
	 */
	static map = new Map();
	/**
	 * @type {QChannel<string>}
	 */
	static #qChannelEventSignal = new QChannel('EventSignal');
	/**
	 * @description
	 * - the constructor it self is set to `private`;
	 * - it's globally queued:
	 * >- the `Promise` nature is to prevent race condition on creating the instance;
	 * @param {string} stringName
	 * @param {IsListSignal} [isList_]
	 * @returns {Promise<EventSignal<any>>}
	 * @example
	 * import { EventSignal } from 'vivth';
	 *
	 * const myEventSignal = await EventSignal.get('dataEvent');
	 */
	static get = async (stringName, isList_ = false) => {
		const { resume } = await EventSignal.#qChannelEventSignal.key(stringName);
		const mapped = EventSignal.map;
		if (mapped.has(stringName) === false) {
			let instance = new EventSignal(stringName, isList_);
			mapped.set(stringName, instance);
		}
		resume();
		// @ts-expect-error
		return mapped.get(stringName);
	};
	/**
	 * @private
	 * @param {string} name
	 * @param {ISLIST} [isList]
	 */
	// @ts-expect-error
	constructor(name, isList = false) {
		this.name = name;
		this.#isList = isList;
	}
	/**
	 * @type {IsListSignal}
	 */
	#isList;
	/**
	 * @type {string}
	 */
	name;
	/**
	 * @description
	 * - is [Signal](#signal) or [ListSignal](#listsignal) instance, depending on the `isList` argument;
	 * - if needed to pass along the messages, it can be used as `dispatcher` and `listener` at the same time;
	 * - is `lazily` created;
	 * @type {Signal<any>|ListSignal<any>}
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
	dispatch = LazyFactory(() => {
		if (this.#isList) {
			return new ListSignal([]);
		}
		return new Signal(undefined);
	});
	/**
	 * @description
	 * - is [Derived](#derived) or [ListDerived](#listderived) instance, depending on the `isList` argument;
	 * - can be used as listener when passed down value shouldn't be modified manually;
	 * - is `lazily` created along with `dispatch`, if `listen` is accessed first, then `dispatch` will also be created automatically;
	 * @type {Derived<any>|ListDerived<any>}
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
	listen = LazyFactory(() => {
		const dispatch = this.dispatch;
		const _ = dispatch.value;
		if (this.#isList) {
			return new ListDerived(async ({ subscribe }) => {
				return subscribe(dispatch).value;
			});
		}
		return new Derived(async ({ subscribe }) => {
			return subscribe(dispatch).value;
		});
	});
	/**
	 * @description
	 * - methods of this static property is lazily created;
	 * - remove signal and effect subscription of the named `EventSignal_instance`;
	 */
	static remove = LazyFactory(() => ({
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
		subscriber: (name, effectInstance) => {
			/**
			 * this part is not needed, as the effect might need to react to other signals
			// effectInstance.options.removeEffect();
			 */
			EventSignal.get(name).then(({ remove }) => {
				remove.subscriber(effectInstance);
			});
		},
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
		allSubscribers: (name) => {
			EventSignal.get(name).then(({ remove }) => {
				remove.allSubscribers();
			});
		},
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
		refs: (name) => {
			EventSignal.get(name).then(({ remove }) => {
				remove.ref();
			});
		},
	}));
	remove = LazyFactory(() => ({
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
		subscriber: (effectInstance) => {
			/**
			 * this part is not needed, as the effect might need to react to other signals
			// effectInstance.options.removeEffect();
			 */
			this.dispatch.remove.subscriber(effectInstance);
			this.listen.remove.subscriber(effectInstance);
		},
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
		allSubscribers: () => {
			this.dispatch.remove.allSubscribers();
			this.listen.remove.allSubscribers();
		},
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
		ref: () => {
			this.dispatch.remove.ref();
			this.listen.remove.ref();
		},
	}));
}
