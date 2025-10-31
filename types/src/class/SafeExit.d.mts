/**
 * @type {Set<()=>Promise<void>>}
 */
export const safeCleanUpCBs: Set<() => Promise<void>>;
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
    static instance: SafeExit | undefined;
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
     * - standard node/bun:
     * ```js
     * () => process.exit(0),
     * ```
     * - Deno:
     * ```js
     * () => Deno.exit(0),
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
     * - example Deno:
     * ```js
     * (eventName) => {
     * 	const sig = Deno.signal(eventName);
     * 		for await (const _ of sig) {
     * 			exiting.correction(true);
     * 			sig.dispose();
     * 			Console.log(`safe exit via "${eventName}"`);
     * 		}
     * }
     * ```
     * - if your exit callback doesn't uses `process` global object you need to input on the SafeExit instantiation
     * @example
     * import { SafeExit, Console } from 'vivth';
     *
     * new SafeExit({
     * 	eventNames: ['SIGINT', 'SIGTERM', ...eventNames],
     * 	terminator : () => process.exit(0), // OR on deno () => Deno.exit(0),
     * 	// optional deno example
     * 	listener : (eventName) => {
     * 		const sig = Deno.signal(eventName);
     * 		for await (const _ of sig) {
     * 			exiting.correction(true);
     * 			sig.dispose();
     * 			Console.log(`safe exit via "${eventName}"`);
     * 		}
     * 	}
     * });
     */
    constructor({ eventNames, terminator, listener }: {
        eventNames: [string, ...string[]];
        terminator: () => void;
        listener?: ((eventName: string) => void) | undefined;
    });
    /**
     * @description
     * - optional exit event registration, by listening to it inside an `Effect`;
     * - when the value is `true`, meaning program is exitting;
     * @type {EnvSignal<boolean>}
     */
    exiting: EnvSignal<boolean>;
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
    addCallback: (cb: () => (Promise<void>)) => void;
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
    removeCallback: (cb: () => (Promise<void>)) => void;
    #private;
}
import { EnvSignal } from './EnvSignal.mjs';
