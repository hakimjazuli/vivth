/**
 * @description
 * - a class for creating signal which its value are derived from other signal (`Derived` and `Signal` alike);
 * ```js
 * import { $, Derived, Signal } from 'vivth';
 * const signal = new Signal(0);
 * const derived = new Derived(async () =>{
 *  // runs everytime signal.value changes;
 *  return signal.value * 2;
 * });
 * const autosubscriber = new $(async ()=>{
 *  // runs everytime derived.value changes;
 *  console.log(derived.value);
 * });
 * signal.value = 1;
 * ```
 */
/**
 * @template V
 * @extends Signal<V>
 */
export class Derived<V> extends Signal<V> {
    /**
     * @param {(arg:{remove$:$["remove$"]})=>V} derivedFunction
     */
    constructor(derivedFunction: (arg: {
        remove$: $["remove$"];
    }) => V);
}
import { Signal } from './Signal.mjs';
import { $ } from './$.mjs';
