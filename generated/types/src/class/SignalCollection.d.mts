/**
 * @typedef {import('../typehints/VivthCleanup.mjs').VivthCleanup} VivthCleanup
 */
/**
 * @description
 * - class helper for creating Collection of `Signals` for Object of Signals to be subscribed to(on `Effect`/`Derived`) collectively as signals;
 * >- uses as `Facade` Pattern;
 * @template {Record<string, import('./Signal.mjs').Signal<any>>} SIGNALS
 * @implements {VivthCleanup}
 */
export class SignalCollection<SIGNALS extends Record<string, import("./Signal.mjs").Signal<any>>> implements VivthCleanup {
    /**
     * @description
     * - creates instance of `SignalCollection`, by referencing to named Signal;
     * @param {SIGNALS} signalsObject
     * @example
     * import { Signal, Derived, SignalCollection } from 'vivth/neutral';
     *
     * const a = new Signal('a');
     * const b = new Signal('b');
     * const c = new Derived(async ({ subscribe }) => {
     * 	return `${subscribe(b).value}_b`;
     * });
     *
     * const f = new SignalCollection({ a, c });
     */
    constructor(signalsObject: SIGNALS);
    vivthCleanup: () => Promise<void>;
    /**
     * @description
     * - accessor for signals, to be subscribed to;
     * @param {import('./Effect.mjs').Effect["options"]["subscribe"]} [subscribe]
     * @returns {SIGNALS}
     * @example
     * import { Signal, Derived, Effect, SignalCollection } from 'vivth/neutral';
     *
     * const a = new Signal('a');
     * const b = new Signal('b');
     * const c = new Derived(async ({ subscribe }) => {
     * 	return `${subscribe(b).value}_b`;
     * });
     *
     * const f = new SignalCollection({ a, c });
     *
     * new Effect(async ({ subscribe, isLastCalled }) => {
     * 	const {
     * 		a: { value: aa }, // aa is safely desctructured and auto subscribed
     * 		c: { value: cc }, // cc is safely desctructured and auto subscribed
     * 	} = f.signals(subscribe);
     * 	if(!await isLastCalled(100)) {
     * 		return; // impertaive debounce
     * 	}
     * });
     *
     * const d = new Derived(async function({ subscribe, isLastCalled }) {
     * 	const {
     * 		a: { value: aa }, // aa is safely desctructured and auto subscribed
     * 		c: { value: cc }, // cc is safely desctructured and auto subscribed
     * 	} = f.signals(subscribe);
     * 	if(!await isLastCalled(100)) {
     * 		return this.dontUpdate; // impertaive debounce
     * 	}
     * 	// return something;
     * });
     */
    signals: (subscribe?: import("./Effect.mjs").Effect["options"]["subscribe"]) => SIGNALS;
    /**
     * @description
     * - is looping synchronously;
     * >- will not await any async block;
     * - use for operation that doesn't need the value:
     * >- unsub from the signal;
     * @template {keyof SIGNALS} K
     * @param {(key: K,
     * signal: SIGNALS[K]
     * )=>void} callback
     * @returns {void}
     * @example
     * import { Signal, Derived, Effect, SignalCollection } from 'vivth/neutral';
     *
     * const a = new Signal('a');
     * const b = new Signal('b');
     * const c = new Derived(async ({ subscribe }) => {
     * 	return `${subscribe(b).value}_b`;
     * });
     *
     * const f = new SignalCollection({ a, c });
     *
     * f.forInSignals((key, signal)=>{
     * 	// code
     * })
     */
    forInSignals<K extends keyof SIGNALS>(callback: (key: K, signal: SIGNALS[K]) => void): void;
    #private;
}
export type VivthCleanup = import("../typehints/VivthCleanup.mjs").VivthCleanup;
