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
    static triggerExit: () => void;
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
     * @example
     * import process from 'node:process';
     * import { SafeExit, Console } from 'vivth';
     *
     * new SafeExit({
     * 	eventNames: ['SIGINT', 'SIGTERM', ...eventNames],
     * 	terminator : () => process.exit(0),
     * });
     */
    constructor({ eventNames, terminator }: {
        eventNames: [string, ...string[]];
        terminator: () => void;
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
     * const exitCallback = async () => {
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
