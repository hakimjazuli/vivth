/**
 * @type {Set<Effect>}
 */
export const setOfEffects: Set<Effect>;
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
     * @description
     * @param {(arg0:Effect["options"])=>Promise<void>} effect
     * @example
     * import { Signal, Derived, Effect, Console } from  'vivth';
     *
     * const count = new Signal(0);
     * const double = new Derived( async({$}) => $(count).value \* 2); // double listen to count changes
     * new Effect(async ({
     * 			subscribe, // : registrar callback for this effect instance, immediately return the signal instance
     * 			removeEffect, // : disable this effect instance from reacting to dependency changes;
     * 		}) => {
     * 			Console.log(subscribe(double).value); // effect listen to double changes
     * 			const a = double.value; //  no need to wrap double twice with $
     * })
     *
     * count.value++;
     */
    constructor(effect: (arg0: Effect["options"]) => Promise<void>);
    options: {
        /**
         * @instance options
         * @description
         * - normally it's passed as argument to constructor, however it is also accessible from `options` property;
         * @template {Signal} S
         * @param {S} signal
         * @returns {S}
         * @example
         * const effect = new Effect(async () => {
         * 	// code
         * })
         * effect.options.subscribe(signalInstance);
         */
        subscribe: <S extends Signal<any>>(signal: S) => S;
        /**
         * @instance options
         * @description
         * - normally it's passed as argument to constructor, however it is also accessible from `options` property;
         * @type {()=>void}
         * @example
         * const effect = new Effect(async () => {
         * 	// code
         * })
         * effect.options.removeEffect();
         */
        removeEffect: () => void;
    } & {
        "vivth:unwrapLazy;": string;
    };
    /**
     * @description
     * - normally is to let to be automatically run when dependency signals changes, however it's also accessible as instance method;
     * @returns {void}
     * @example
     * const effect = new Effect(async ()=>{
     * 	// code
     * })
     * effect.run();
     */
    run: () => void;
    #private;
}
import { Signal } from './Signal.mjs';
