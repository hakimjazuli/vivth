// @ts-check

import { unwrapLazy } from '../common/lazie.mjs';
import { LazyFactory } from '../function/LazyFactory.mjs';
import { Timeout } from '../function/Timeout.mjs';
import { TryAsync } from '../function/TryAsync.mjs';
import { Console } from './Console.mjs';
import { Signal } from './Signal.mjs';

/**
 * @type {Set<Effect>}
 */
export const setOfEffects = new Set();

/**
 * @description
 * - a class for creating effect;
 * - compared to previous class <b>$</b> reactivity model, `Effect`:
 * >- doesn't autosubscribe at first run;
 * >- it is using passed <b>$</b> named `arg0` options as subscriber;
 * >- doesn't block other queues during first run(previously blocks other queues to safely register signal autoscubscriber);
 * >- now can dynamically subscribes to signal, even on conditionals, that are not run during first run;
 */
export class Effect {
	/**
	 * @typedef {import('../common/lazie.mjs').unwrapLazy} unwrapLazy
	 */
	/**
	 * @description
	 * - collections of lazy methods to handle effect calls of this instance;
	 */
	options = LazyFactory(() => {
		const this_ = this;
		return {
			/**
			 * @instance options
			 * @description
			 * @returns {(timeoutMS?:number)=>Promise<boolean>}
			 * - timeoutMS only necessary if the operation doesn't naturally await;
			 * - if it's operation such as `fetch`, you can just leave it blank;
			 * @example
			 *
			 * import { Effect } from 'vivth';
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
			get isLastCalled() {
				const current = {};
				this_.#current = current;
				return async (timeoutMS = 0) => {
					if (timeoutMS) {
						await Timeout(timeoutMS);
					}
					return current === this_.#current;
				};
			},
			/**
			 * @instance options
			 * @description
			 * - normally it's passed as argument to constructor, however it is also accessible from `options` property;
			 * @template {Signal} SIGNAL
			 * @param {SIGNAL} signal
			 * @returns {SIGNAL}
			 * @example
			 * import { Effect } from 'vivth';
			 *
			 * const effect = new Effect(async () => {
			 * 	// code
			 * })
			 * effect.options.subscribe(signalInstance);
			 */
			subscribe: (signal) => {
				if (!(signal instanceof Signal)) {
					// @ts-expect-error
					signal = signal[unwrapLazy]();
				}
				signal.subscribers.setOf.add(this_);
				return signal;
			},
			/**
			 * @instance options
			 * @description
			 * - normally it's passed as argument to constructor, however it is also accessible from `options` property;
			 * @type {()=>void}
			 * @example
			 * import { Effect } from 'vivth';
			 *
			 * const effect = new Effect(async () => {
			 * 	// code
			 * })
			 * effect.options.removeEffect();
			 */
			removeEffect: () => {
				setOfEffects.delete(this);
			},
		};
	});
	/**
	 * @description
	 * @param {( arg0:
	 * Omit<Effect["options"], typeof unwrapLazy>
	 * ) =>
	 * Promise<void>} effect
	 * @example
	 * import { Signal, Derived, Effect, Console } from  'vivth';
	 *
	 * const count = new Signal(0);
	 * const double = new Derived( async({$}) => $(count).value \* 2); // double listen to count changes
	 * new Effect(async ({
	 * 			subscribe, // : registrar callback for this effect instance, immediately return the signal instance
	 * 			removeEffect, // : disable this effect instance from reacting to dependency changes;
	 * 			isLastCalled, // : check whether this callback run is this instant last called effect;
	 * 		}) => {
	 * 			Console.log(subscribe(double).value); // effect listen to double changes
	 * 			const a = double.value; //  no need to wrap double twice with $
	 * })
	 *
	 * count.value++;
	 */
	constructor(effect) {
		this.#effect = effect;
		setOfEffects.add(this);
		this.run();
	}
	/**
	 * @type {Object}
	 */
	#current;
	/**
	 * @param {Omit<Effect["options"], typeof unwrapLazy>} effectInstance
	 * @returns {Promise<void>}
	 */
	#effect;
	/**
	 * @description
	 * - normally is to let to be automatically run when dependency signals changes, however it's also accessible as instance method;
	 * @returns {void}
	 * @example
	 * import { Effect } from 'vivth';
	 *
	 * const effect = new Effect(async ()=>{
	 * 	// code
	 * })
	 * effect.run();
	 */
	run = () => {
		TryAsync(async () => {
			await this.#effect(this.options[unwrapLazy]());
		}).then(([, error]) => {
			if (!error) {
				return;
			}
			Console.error(error);
		});
	};
}
