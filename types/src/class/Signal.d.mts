/**
 * @description
 * - a class for creating signal;
 * - can be subscribed by using [New$](#new$) or [NewDerived](#newderived);
 * - for minimal total bundle size use `function` [NewSignal](#newSignal) instead;
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
