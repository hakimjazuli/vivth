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
     * @param {$["effect"]} effect
     */
    constructor(effect: $["effect"]);
    /**
     * @returns {void}
     */
    remove$: () => void;
    /**
     * @type {(arg0:{remove$:()=>void})=>void}
     */
    effect: (arg0: {
        remove$: () => void;
    }) => void;
}
