import { Signal } from './Signal.mjs';
export type VivthCleanup = import('../typehints/VivthCleanup.mjs').VivthCleanup;
/**
 * @typedef {import('../typehints/VivthCleanup.mjs').VivthCleanup} VivthCleanup
 */
/**
 * @description
 * - `Signal` to unwrap `Promise`;
 * - useful to create underlying mechanism for something like react `Suspense` component;
 * - auto queued for last unwrap request;
 * @template {any} VALUE
 * @template {any[]} ARGS
 * @extends {Signal<VALUE|Promise<VALUE>|Error>}
 * @implements {VivthCleanup}
 * @example
 * import { AwaitSignal, Effect } from 'vivth/neutral'
 * const bigAwaitSignal = new AwaitSignal(fetch('../SomethingReallyBig'));
 * new Effect(async({ subscribe })=>{
 * 	const myBigLoadProgress = subscribe(bigAwaitSignal).value;
 * 	const isError = IsInstanceOf(myBigLoadProgress, Error);
 * 	if(isError){
 * 		// handle error here
 * 		return;
 * 	}
 * 	const isAPromise = IsInstanceOf(myBigLoadProgress, Promise);
 * 	if(isAPromise){
 * 		// handle suspense here;
 * 		return;
 * 	}
 * 	// handle ready state here;
 * })
 */
export declare class AwaitSignal<VALUE extends any, ARGS extends any[]> extends Signal<VALUE | Promise<VALUE> | Error> implements VivthCleanup {
    #private;
    /**
     * @override
     */
    vivthCleanup: () => Promise<void>;
    /**
     * @param {(...args:ARGS)=>Promise<VALUE>} callback
     * @param {ARGS} firstCallArguments
     */
    constructor(callback: (...args: ARGS) => Promise<VALUE>, ...firstCallArguments: ARGS);
    /**
     * @override
     * @param {VALUE|Promise<VALUE>|Error} _newValue
     */
    set value(_newValue: VALUE | Promise<VALUE> | Error);
    /**
     * @override
     * @returns {VALUE|Promise<VALUE>|Error}
     */
    get value(): VALUE | Promise<VALUE> | Error;
    retryCount: number;
    /**
     * @param {number} maxRetries
     * - `0` for no limit;
     * @param {ARGS} args
     * - integer of retryCount;
     */
    retry: (maxRetries: number, ...args: ARGS) => void;
}
