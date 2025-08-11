/**
 * @description
 * - a class to `autosubscribe` to an signal changes (`Derived` and `Signal` alike);
 * ```js
 * import { $, Derived, Signal } from 'vivth';
 * const signal = new Signal(0);
 * const derived = new Derived(async () =>{
 *  // runs everytime signal.value changes;
 *  return signal.value * 2;
 * });
 * const autosubscriber = new $(async ()=>{
 *  // runs everytime signal.value changes;
 *  console.log(signal.value);
 *  // console.log(derived.value);
 * });
 * signal.value = 1;
 * ```
 */
export class $ {
    /**
     * @typedef {import('../class/Signal.mjs').Signal} Signal
     */
    /**
     * @type {Map<$, Set<Signal>>}
     */
    static effects: Map<$, Set<import("../class/Signal.mjs").Signal<any>>>;
    /**
     * @type {Map<Signal, Set<$>>}
     */
    static mappedSignals: Map<import("../class/Signal.mjs").Signal<any>, Set<$>>;
    /**
     * @type {Set<Signal>}
     */
    static activeSignal: Set<import("../class/Signal.mjs").Signal<any>>;
    /**
     * @type {boolean}
     */
    static isRegistering: boolean;
    /**
     * @param {(arg:{remove$:$["remove$"]})=>void} effect
     */
    constructor(effect: (arg: {
        remove$: $["remove$"];
    }) => void);
    /**
     * @returns {void}
     */
    remove$: () => void;
    /**
     * @type {(arg:{remove$:$["remove$"]})=>void};
     */
    effect: (arg: {
        remove$: $["remove$"];
    }) => void;
}
