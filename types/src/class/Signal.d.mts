/**
 * @description
 * - a class for creating signal;
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
 * });
 * signal.value = 1;
 * ```
 */
/**
 * @template Value
 */
export class Signal<Value> {
    /**
     * @param {Value} value
     */
    constructor(value: Value);
    /**
     * @protected
     */
    protected get subscribed(): Set<$>;
    /**
     * destroy all props
     */
    unRef: () => void;
    /**
     * remove all effects
     * @return {void}
     */
    removeAll$: () => void;
    /**
     * remove effect
     * @param {$} $_
     * @return {void}
     */
    remove$: ($_: $) => void;
    get prev(): Value;
    /**
     * @type {Value}
     */
    get nonReactiveValue(): Value;
    /**
     * @type {Value}
     */
    set value(newValue: Value);
    /**
     * @type {Value}
     */
    get value(): Value;
    /**
     * @returns {void}
     */
    call$: () => void;
    #private;
}
import { $ } from './$.mjs';
