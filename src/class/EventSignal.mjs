// @ts-check

import { LazyFactory } from '../function/LazyFactory.mjs';
import { Derived } from './Derived.mjs';
import { QChannel } from './QChannel.mjs';
import { Signal } from './Signal.mjs';

/**
 * @typedef { import('../typehints/VivthCleanup.mjs').VivthCleanup } VivthCleanup
 */

/**
 * @description
 * - Signal implementation for `CustomEvent`, to dispatch and listen;
 * - it's based on string as key, so it can be listened/dispatched even without direct instance reference;
 * @template {any} TYPE
 * @implements {VivthCleanup}
 */
export class EventSignal {
	vivthCleanup = async () => {
		this.remove.ref();
	};
	/**
	 * @type {QChannel<string>}
	 */
	static #q = LazyFactory(() => new QChannel('EventSignal'));
	/**
	 * - `Map` of `EventSignal`, using the `stringName` of the `EventSignal_instance` as `key`;
	 * @type {Map<string, EventSignal<any>>}
	 */
	static #map = new Map();
	/**
	 * @description
	 * - the constructor it self is set to `private`;
	 * - it's globally queued:
	 * >- the `Promise` nature is to prevent race condition on creating the instance;
	 * @param {string} stringName
	 * @returns {Promise<EventSignal<any>>}
	 * @example
	 * import { EventSignal, Trace } from 'vivth/neutral';
	 *
	 * const myEventSignal = await EventSignal.get('dataEvent');
	 * // recommendation
	 * const myEventSignalGenerator = async (name) => {
	 * 	return await EventSignal.get(`myEventSignalGenerator:${name}`);
	 * }
	 */
	static get = async (stringName) => {
		const { resume } = await EventSignal.#q.key(stringName);
		const mapped = EventSignal.#map;
		if (!mapped.has(stringName)) {
			let instance = new EventSignal(stringName);
			mapped.set(stringName, instance);
		}
		resume();
		// @ts-expect-error already setted upstream
		return mapped.get(stringName);
	};
	/**
	 * @private
	 * @param {string} name
	 */
	constructor(name) {
		this.name = name;
	}
	/**
	 * @type {string}
	 */
	name;
	/**
	 * @description
	 * - is [Signal](#signal) instance;
	 * - if needed to pass along the messages, it can be used as `dispatcher` and `listener` at the same time;
	 * - is `lazily` created;
	 * @type {Signal<TYPE>}
	 * @example
	 * import { EventSignal, Effect, Console } from 'vivth/neutral';
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
	// @ts-expect-error
	dispatcher = LazyFactory(() => {
		return new Signal(undefined);
	});
	/**
	 * @description
	 * - is [Derived](#derived);
	 * - can be used as listener when passed down value shouldn't be modified manually;
	 * - is `lazily` created along with `dispatch`, if `listen` is accessed first, then `dispatch` will also be created automatically;
	 * @type {Derived<TYPE>}
	 * @example
	 * import { EventSignal, Effect, Console } from 'vivth/neutral';
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
	listener = LazyFactory(() => {
		const dispatch = this.dispatcher;
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
		 * import { EventSignal } from 'vivth/neutral';
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
		 * import { EventSignal } from 'vivth/neutral';
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
		 * import { EventSignal } from 'vivth/neutral';
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
		 * import { EventSignal, Effect, Console } from 'vivth/neutral';
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
			this.dispatcher.remove.subscriber(effectInstance);
			this.listener.remove.subscriber(effectInstance);
		},
		/**
		 * @instance remove
		 * @description
		 * - remove allSubscribers from the `EventSignal_instance`;
		 * @type  {()=>void}
		 * @example
		 * import { EventSignal, Effect, Console } from 'vivth/neutral';
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
			this.dispatcher.remove.allSubscribers();
			this.listener.remove.allSubscribers();
		},
		/**
		 * @instance remove
		 * @description
		 * - remove reference of the `proxySignals` of the `EventSignal_instance`;
		 * @type {()=>void}
		 * @example
		 * import { EventSignal, Effect, Console } from 'vivth/neutral';
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
			this.dispatcher.remove.ref();
			this.listener.remove.ref();
		},
	}));
}
