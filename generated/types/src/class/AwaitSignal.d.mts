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
export class AwaitSignal<VALUE extends unknown, ARGS extends any[]> extends Signal<Error | VALUE | Promise<VALUE>> implements VivthCleanup {
    /**
     * @param {(...args:ARGS)=>Promise<VALUE>} callback
     * @param {ARGS} firstCallArguments
     */
    constructor(callback: (...args: ARGS) => Promise<VALUE>, ...firstCallArguments: ARGS);
    retryCount: number;
    /**
     * @param {number} maxRetries
     * - `0` for no limit;
     * @param {ARGS} args
     * - integer of retryCount;
     */
    retry: (maxRetries: number, ...args: ARGS) => void;
    #private;
}
export type VivthCleanup = import("../typehints/VivthCleanup.mjs").VivthCleanup;
import { Signal } from './Signal.mjs';
