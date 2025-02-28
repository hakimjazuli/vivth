/**
 * @description
 * - a class to `autosubscribe` to an signal changes (`Derived` and `Signal` alike);
 * - for minimal total bundle size use `function` [New$](#new$) instead;
 */
export class $ {
    /**
     * @typedef {import('../class/Signal.mjs').Signal} Signal
     */
    /**
     * effects
     * @type {Map<$, Set<Signal>>}
     */
    static E: Map<$, Set<import("../class/Signal.mjs").Signal<any>>>;
    /**
     * signalInstance
     * @type {Map<Signal, Set<$>>}
     */
    static S: Map<import("../class/Signal.mjs").Signal<any>, Set<$>>;
    /**
     * activeSignalUponRegistering
     * @type {Set<Signal>}
     */
    static A: Set<import("../class/Signal.mjs").Signal<any>>;
    /**
     * isRegistering
     * @type {boolean}
     */
    static R: boolean;
    /**
     * @param {$["effect"]} effect
     */
    constructor(effect: $["effect"]);
    /**
     * @returns {void}
     */
    remove$: () => void;
    /**
     * @type {()=>void}
     */
    effect: () => void;
}
