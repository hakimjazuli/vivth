// @ts-check

import { LazyFactory } from '../function/LazyFactory.mjs';
import { TryAsync } from '../function/TryAsync.mjs';
import { TrySync } from '../function/TrySync.mjs';
import { Console } from './Console.mjs';
import { Effect, setOfEffects } from './Effect.mjs';

/**
 * @type {Set<Signal<any>>}
 */
export const setOFSignals = new Set();

/**
 * @description
 * - a class for creating effect to signals;
 * @template VALUE
 */
export class Signal {
	/**
	 * @description
	 * - create a `Signal`;
	 * @param {VALUE} value
	 * @example
	 * import { Signal, Effect } from  'vivth';
	 *
	 * const count = new Signal(0);
	 */
	constructor(value) {
		this.#value = value;
		setOFSignals.add(this);
	}
	/**
	 * @description
	 * - subsrcibers reference of this instance;
	 */
	subscribers = LazyFactory(() => ({
		/**
		 * @instance subscribers
		 * @description
		 * - subscribedEffects
		 * @type {Set<Effect>}
		 */
		setOf: new Set(),
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
		notify: (callback = undefined) => {
			if (callback === undefined) {
				Signal.#notify(this.subscribers.setOf);
				return;
			}
			TryAsync(async () => {
				await callback({ signalInstance: this });
			}).then(([, error]) => {
				if (error) {
					Console.error({ message: 'unable to run callback', callback, error });
					return;
				}
				Signal.#notify(this.subscribers.setOf);
			});
		},
	}));
	/**
	 * @param {Set<Effect>} setOfSubscribers
	 */
	static #notify = (setOfSubscribers) => {
		const [, error] = TrySync(() => {
			const effects = setOfSubscribers;
			effects.forEach((effect) => {
				if (setOfEffects.has(effect) === false) {
					effects.delete(effect);
					return;
				}
				/**
				 * effect.run is already TryAsync
				 */
				effect.run();
			});
		});
		if (error === undefined) {
			return;
		}
		Console.error(error);
	};
	/**
	 * @description
	 * - collection of remove methods
	 */
	remove = LazyFactory(() => ({
		/**
		 * @instance remove
		 * @description
		 * - remove effect subscriber to react from this instance value changes;
		 * @param {Effect} effectInstance
		 * @returns {void}
		 */
		subscriber: (effectInstance) => {
			effectInstance.options.removeEffect();
			this.subscribers.setOf.delete(effectInstance);
		},
		/**
		 * @instance remove
		 * @description
		 * - remove all effect subscribers to react from this instance value changes;
		 * @type {()=>void}
		 */
		allSubscribers: () => {
			const $ = this.subscribers.setOf;
			$.forEach(this.remove.subscriber);
		},
		/**
		 * @instance remove
		 * @description
		 * - remove this instance from `vivth` reactivity engine, and nullify it's own value;
		 * @type {()=>void}
		 */
		ref: () => {
			this.remove.allSubscribers();
			// @ts-expect-error
			this.#value = null;
			setOFSignals.delete(this);
		},
	}));

	/**
	 * @type {VALUE|undefined}
	 */
	#prev;
	/**
	 * @description
	 * - value before change;
	 * @returns {VALUE|undefined}
	 */
	get prev() {
		return this.#prev;
	}
	/**
	 * @type {VALUE}
	 */
	#value;
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
	get value() {
		return this.#value;
	}
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
	set value(newValue) {
		if (this.#value === newValue) {
			return;
		}
		this.#prev = this.#value;
		this.#value = newValue;
		this.subscribers.notify();
	}
}
