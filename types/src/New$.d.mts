export class $ {
    /**
     * @typedef {import('./NewSignal.mjs').Signal} Signal
     */
    /**
     * effects
     * @type {Map<$["effect"], Set<Signal>>}
     */
    static E: Map<$["effect"], Set<import("./NewSignal.mjs").Signal<any>>>;
    /**
     * signalInstance
     * @type {Map<Signal, Set<$["effect"]>>}
     */
    static S: Map<import("./NewSignal.mjs").Signal<any>, Set<$["effect"]>>;
    /**
     * activeSignalUponRegistering
     * @type {Signal[]}
     */
    static A: import("./NewSignal.mjs").Signal<any>[];
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
export function New$(effect: () => void): $;
