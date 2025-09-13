// @ts-check

import { TryAsync } from '../function/TryAsync.mjs';
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
 * @template {[string, ...string[]]} ExitEventNames
 */
export class SafeExit {
	/**
	 * @description
	 * - only accessible after instantiation;
	 * @type {SafeExit}
	 */
	static instance = undefined;
	/**
	 * @description
	 * @param {Object} options
	 * @param {ExitEventNames} options.exitEventNames
	 * @param {()=>void} options.exitCallback
	 * - standard node/bun:
	 * ```js
	 * () => process.exit(0),
	 * ```
	 * - Deno:
	 * ```js
	 * () => Deno.exit(0),
	 * ```
	 * @param {(eventName:string)=>void} [options.exitCallbackListeners]
	 * - default value
	 * ```js
	 * (eventName) => {
	 * 	process.once(eventName, function () {
	 * 		SafeExit.instance.exiting.correction(true);
	 * 		Console.log(`safe exit via "${eventName}"`);
	 * 	});
	 * };
	 * ```
	 * - if your exit callback doesn't uses `process` global object you need to input on the SafeExit instantiation
	 * @example
	 * import { SafeExit, Console } from 'vivth';
	 *
	 * new SafeExit({
	 * 	// exitEventNames are blank by default, you need to manually name them all;
	 * 	// 'exit' will be omited, as it might cause async callbacks failed to execute;
	 * 	exitEventNames: ['SIGINT', 'SIGTERM', ...otherExitEventNames],
	 * 	exitCallback = () => process.exit(0), // OR on deno () => Deno.exit(0),
	 * 	// optional deno example
	 * 	exitCallbackListeners = (eventName) => {
	 * 		const sig = Deno.signal(eventName);
	 * 			for await (const _ of sig) {
	 * 				exiting.correction(true);
	 * 				sig.dispose();
	 * 				Console.log(`safe exit via "${eventName}"`);
	 * 			}
	 * 	}
	 * });
	 */
	constructor({ exitEventNames, exitCallback, exitCallbackListeners = undefined }) {
		if (SafeExit.instance) {
			return SafeExit.instance;
		}
		SafeExit.instance = this;
		this.#exit = exitCallback;
		if (exitCallbackListeners) {
			this.#exitCallbackListeners = exitCallbackListeners;
		}
		this.#register(exitEventNames);
	}
	/**
	 * @description
	 * - optional exit event registration, by listening to it inside an `Effect`;
	 * - when the value is `true`, meaning program is exitting;
	 * @type {EnvSignal<boolean>}
	 */
	exiting = new EnvSignal(false);
	/**
	 * @param {ExitEventNames} exitEventNames
	 * @returns {void}
	 */
	#register = (exitEventNames) => {
		exitEventNames.forEach((eventName) => {
			if (eventName == 'exit') {
				return;
			}
			this.#exitCallbackListeners(eventName);
		});
	};
	/**
	 * @type {(eventName:string)=>void}
	 */
	#exitCallbackListeners = (eventName) => {
		SafeExit.instance.exiting.env.value;
		process.once(eventName, function () {
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
	 * SafeExit.instance.addCallback(()=>{
	 * 	// code
	 * })
	 */
	addCallback = (cb) => {
		safeCleanUpCBs.add(cb);
	};
	/**
	 * @type {()=>void}
	 */
	#exit;
	#autoCleanUp = new Effect(async ({ subscribe }) => {
		if (!subscribe(this.exiting.env).value) {
			return;
		}
		setOFSignals.forEach((signal) => {
			signal.remove.ref();
		});
		setOfEffects.forEach((effect) => {
			effect.options.removeEffect();
		});
		for await (const cleanup of safeCleanUpCBs) {
			const [_, error] = await TryAsync(async () => {
				await cleanup();
			});
			if (!error) {
				continue;
			}
			Console.error(error);
		}
		this.#exit();
	});
}
