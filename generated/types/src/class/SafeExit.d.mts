/**
 * @description
 * - class helper for describing how to Safely Response on exit events
 * - singleton;
 * - most of functionality might need to access `SafeExit.instance.exiting`, if you get warning, you can instantiate `SafeExit` before running anything;
 */
export declare class SafeExit {
    #private;
    /**
     * @description
     * - only accessible after instantiation;
     * @type {SafeExit|undefined}
     */
    static instance: SafeExit | undefined;
    /**
     * @type {Set<()=>Promise<void>>}
     */
    safeCleanUpCBs: Set<() => Promise<void>>;
    /**
     * @description
     * @param {...NodeJS.Signals} eventNames
     * - `beforeExit` is auto included;
     * - example:
     * ```js
     *  ['SIGINT', 'SIGTERM'] // both are automatically added
     * ```
     * @example
     * import process from 'node:process';
     * import { SafeExit } from 'vivth/node';
     *
     * new SafeExit('SIGINT', 'SIGTERM', ...eventNames);
     */
    constructor(...eventNames: NodeJS.Signals[]);
    /**
     * @description
     * - `SafeExit` ${eventName}.Callback registration;
     * - `onEventName` all callbacks are called simultanousely using `await Promise.all`;
     * >- for sequential event you need to put them in a single callback;
     * @param {()=>(Promise<void>)} safeExitCallback
     * @returns {{removeCallback:()=>void}}
     * @example
     * import { SafeExit } from 'vivth/node';
     *
     * const exitCallback = async () => {
     * 	// code
     * }
     * SafeExit.instance.addCallback(exitCallback);
     */
    addCallback: (safeExitCallback: () => (Promise<void>)) => {
        removeCallback: () => void;
    };
    /**
     * @description
     * - optional exit event removal;
     * - the callbacks will be removed from registered via `addCallback` exiting;
     * @param {()=>(Promise<void>)} cb
     * @example
     * import { SafeExit } from 'vivth/node';
     *
     * const exitCallback () => {
     * 	// code
     * }
     * SafeExit.instance.addCallback(exitCallback);
     * // somewhere else
     * SafeExit.instance.removeCallback(exitCallback);
     */
    removeCallback: (cb: () => (Promise<void>)) => void;
    triggerExit: () => Promise<void>;
}
