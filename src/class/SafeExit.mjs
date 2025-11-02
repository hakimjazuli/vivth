// @ts-check

import { TryAsync } from '../function/TryAsync.mjs';
import { TrySync } from '../function/TrySync.mjs';
import { Console } from './Console.mjs';
import { Effect, setOfEffects } from './Effect.mjs';
import { EnvSignal } from './EnvSignal.mjs';
import { setOFSignals } from './Signal.mjs';

/**
 * @type {Set<()=>Promise<void>>}
 */
export const safeCleanUpCBs = new Set();

/**
 * @description
 * - class helper for describing how to Safely Response on exit events
 * - singleton;
 * - most of functionality might need to access `SafeExit.instance.exiting`, if you get warning, you can instantiate `SafeExit` before running anything;
 */
export class SafeExit {
	/**
	 * @description
	 * - only accessible after instantiation;
	 * @type {SafeExit|undefined}
	 */
	static instance;
	/**
	 * @description
	 * @param {Object} options
	 * @param {[string, ...string[]]} options.eventNames
	 * - eventNames are blank by default, you need to manually name them all;
	 * - 'exit' will be omited, as it might cause async callbacks failed to execute;
	 * - example:
	 * ```js
	 *  ['SIGINT', 'SIGTERM']
	 * ```
	 * @param {()=>void} options.terminator
	 * - standard, process must be imported statically from 'node:process':
	 * ```js
	 * () => process.exit(0),
	 * ```
	 * @param {(eventName:string)=>void} [options.listener]
	 * - default value
	 * ```js
	 * (eventName) => {
	 * 	process.once(eventName, function () {
	 * 		SafeExit.instance.exiting.correction(true);
	 * 		Console.log(`safe exit via "${eventName}"`);
	 * 	});
	 * }
	 * ```
	 * - if your exit callback doesn't uses `process` global object you need to input on the SafeExit instantiation
	 * @example
	 * import process from 'node:process';
	 * import { SafeExit, Console } from 'vivth';
	 *
	 * new SafeExit({
	 * 	eventNames: ['SIGINT', 'SIGTERM', ...eventNames],
	 * 	terminator : () => process.exit(0),
	 * 	listener : (eventName) => {
	 * 			process.once(eventName, function () {
	 * 				SafeExit.instance?.exiting.correction(true);
	 * 				Console.log(`safe exit via "${eventName}"`);
	 * 			});
	 * 	}
	 * });
	 */
	constructor({ eventNames, terminator, listener = undefined }) {
		if (SafeExit.instance instanceof SafeExit) {
			return SafeExit.instance;
		}
		SafeExit.instance = this;
		this.#exit = terminator;
		if (listener) {
			this.#listener = listener;
		}
		this.#register(eventNames);
	}
	/**
	 * @description
	 * - optional exit event registration, by listening to it inside an `Effect`;
	 * - when the value is `true`, meaning program is exitting;
	 * @type {EnvSignal<boolean>}
	 */
	exiting = new EnvSignal(false);
	/**
	 * @param {ConstructorParameters<typeof SafeExit>[0]["eventNames"]} eventNames
	 * @returns {void}
	 */
	#register = (eventNames) => {
		eventNames.forEach((eventName) => {
			if (eventName.toLowerCase() === 'exit') {
				return;
			}
			this.#listener(eventName);
		});
	};
	/**
	 * @type {(eventName:string)=>void}
	 */
	#listener = (eventName) => {
		if (SafeExit.instance === undefined) {
			return;
		}
		SafeExit.instance.exiting.env.value;
		process.once(eventName, function () {
			if (SafeExit.instance === undefined) {
				return;
			}
			Console.log(`safe exit via "${eventName}"`);
			SafeExit.instance.exiting.correction(true);
		});
	};
	/**
	 * @description
	 * - optional exit event registration;
	 * - the callbacks will be called when exiting;
	 * @param {()=>(Promise<void>)} cb
	 * @example
	 * import { SafeExit } from 'vivth';
	 *
	 * const exitCallback () => {
	 * 	// code
	 * }
	 * SafeExit.instance.addCallback(exitCallback);
	 */
	addCallback = (cb) => {
		safeCleanUpCBs.add(cb);
	};
	/**
	 * @description
	 * - optional exit event removal;
	 * - the callbacks will be removed from registered via `addCallback` exiting;
	 * @param {()=>(Promise<void>)} cb
	 * @example
	 * import { SafeExit } from 'vivth';
	 *
	 * const exitCallback () => {
	 * 	// code
	 * }
	 * SafeExit.instance.addCallback(exitCallback);
	 * // somewhere else
	 * SafeExit.instance.removeCallback(exitCallback);
	 */
	removeCallback = (cb) => {
		safeCleanUpCBs.delete(cb);
	};
	/**
	 * @type {()=>void}
	 */
	#exit = () => {};
	#autoCleanUp = new Effect(async ({ subscribe }) => {
		if (
			//
			!subscribe(this.exiting.env).value
		) {
			return;
		}
		setOFSignals.forEach((signal) => {
			signal.remove.ref();
		});
		setOfEffects.forEach((effect) => {
			effect.options.removeEffect();
		});
		for await (const cleanup of safeCleanUpCBs) {
			const [, error] = await TryAsync(async () => {
				await cleanup();
			});
			if (error === undefined) {
				continue;
			}
			Console.warn(error);
		}
		const [, errorExitting] = TrySync(this.#exit);
		if (errorExitting === undefined) {
			return;
		}
		Console.error(errorExitting);
	});
}
