// @ts-check

import { LazyFactory } from '../function/LazyFactory.mjs';
import { Derived } from './Derived.mjs';
import { QChannel } from './QChannel.mjs';
import { Signal } from './Signal.mjs';

/**
 * @description
 * - Signal based on shared/globally available `Object` as key;
 * @template {any} SHAREDOBJECT
 */
export class ObjectSignal {
	/**
	 * @type {WeakMap<Object, ObjectSignal<any>>}
	 */
	static #mappedSignal = new WeakMap();
	/**
	 * @type {QChannel<Object>}
	 */
	static #q = LazyFactory(() => new QChannel('ObjectSignal:q'));
	/**
	 * @template {any} SHAREDOBJECT
	 * @param {Object} object
	 * @returns {Promise<ObjectSignal<SHAREDOBJECT>>}
	 */
	static async get(object) {
		const mapped = ObjectSignal.#mappedSignal;
		const { resume } = await ObjectSignal.#q.key(object);
		if (
			/**  */
			!mapped.has(object)
		) {
			mapped.set(object, new ObjectSignal());
		}
		resume();
		// @ts-expect-error
		return mapped.get(object);
	}
	/**
	 * @private
	 */
	constructor() {}
	/**
	 * @description
	 * - is [Signal](#signal);
	 * - if needed to pass along the messages, it can be used as `dispatcher` and `listener` at the same time;
	 * - is `lazily` created;
	 * @type {Signal<SHAREDOBJECT>}
	 * @example
	 * import { ObjectSignal, Effect, Console } from 'vivth';
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
	// @ts-expect-error
	dispatcher = LazyFactory(() => {
		return new Signal(undefined);
	});
	/**
	 * @description
	 * - is [Derived](#derived);
	 * - can be used as listener when passed down value shouldn't be modified manually;
	 * - is `lazily` created along with `dispatch`, if `listen` is accessed first, then `dispatch` will also be created automatically;
	 * @type {Derived<SHAREDOBJECT>}
	 * @example
	 * import { ObjectSignal, Effect, Console } from 'vivth';
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
	listener = LazyFactory(() => {
		const dispatch = this.dispatcher;
		return new Derived(async ({ subscribe }) => {
			return subscribe(dispatch).value;
		});
	});
	/**
	 * @description
	 * - methods of this static property is lazily created;
	 * - remove signal and effect subscription of the named `ObjectSignal_instance`;
	 */
	static remove = LazyFactory(() => ({
		/**
		 * @static remove
		 * @description
		 * - remove subscriber from the named `ObjectSignal_instance`;
		 * @param {string} name
		 * @param {import('./Effect.mjs').Effect} effectInstance
		 * @returns {void}
		 * @example
		 * import { ObjectSignal } from 'vivth';
		 *
		 * ObjectSignal.remove.subscriber('yourObjectSignalName', myEffectInstance);
		 */
		subscriber: (name, effectInstance) => {
			/**
			 * this part is not needed, as the effect might need to react to other signals
			// effectInstance.options.removeEffect();
			 */
			ObjectSignal.get(name).then(({ remove }) => {
				remove.subscriber(effectInstance);
			});
		},
		/**
		 * @static remove
		 * @description
		 * - remove all subscribers from the named `ObjectSignal_instance`;
		 * @param {string} name
		 * @returns {void}
		 * @example
		 * import { ObjectSignal } from 'vivth';
		 *
		 * ObjectSignal.remove.allSubscribers('yourObjectSignalName');
		 */
		allSubscribers: (name) => {
			ObjectSignal.get(name).then(({ remove }) => {
				remove.allSubscribers();
			});
		},
		/**
		 * @static remove
		 * @description
		 * - remove reference of the `proxySignals` of the named `ObjectSignal_instance`;
		 * @param {string} name
		 * @returns {void}
		 * @example
		 * import { ObjectSignal } from 'vivth';
		 *
		 * ObjectSignal.remove.refs('yourObjectSignalName');
		 */
		refs: (name) => {
			ObjectSignal.get(name).then(({ remove }) => {
				remove.ref();
			});
		},
	}));
	remove = LazyFactory(() => ({
		/**
		 * @instance remove
		 * @description
		 * - remove subscriber from the `ObjectSignal_instance`;
		 * @param {import('./Effect.mjs').Effect} effectInstance
		 * @returns {void}
		 * @example
		 * import { ObjectSignal, Effect, Console } from 'vivth';
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
		 * - remove allSubscribers from the `ObjectSignal_instance`;
		 * @type  {()=>void}
		 * @example
		 * import { ObjectSignal, Effect, Console } from 'vivth';
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
		allSubscribers: () => {
			this.dispatcher.remove.allSubscribers();
			this.listener.remove.allSubscribers();
		},
		/**
		 * @instance remove
		 * @description
		 * - remove reference of the `proxySignals` of the `ObjectSignal_instance`;
		 * @type {()=>void}
		 * @example
		 * import { ObjectSignal, Effect, Console } from 'vivth';
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
		ref: () => {
			this.dispatcher.remove.ref();
			this.listener.remove.ref();
		},
	}));
}
