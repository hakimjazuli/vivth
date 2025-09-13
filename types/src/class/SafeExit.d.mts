/**
 * @type {Set<()=>Promise<void>>}
 */
export const safeCleanUpCBs: Set<() => Promise<void>>;
/**
 * @description
 * - class helper for describing how to Safely Response on exit events
 * - singleton;
 * @template {[string, ...string[]]} ExitEventNames
 */
export class SafeExit<ExitEventNames extends [string, ...string[]]> {
    /**
     * @description
     * - only accessible after instantiation;
     * @type {SafeExit}
     */
    static instance: SafeExit<any>;
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
    constructor({ exitEventNames, exitCallback, exitCallbackListeners }: {
        exitEventNames: ExitEventNames;
        exitCallback: () => void;
        exitCallbackListeners?: (eventName: string) => void;
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
     * SafeExit.instance.addCallback(()=>{
     * 	// code
     * })
     */
    addCallback: (cb: () => (Promise<void>)) => void;
    #private;
}
import { EnvSignal } from './EnvSignal.mjs';
