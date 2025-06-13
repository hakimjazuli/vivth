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
     * subscribed
     * @protected
     */
    protected get S(): Set<$>;
    /**
     * destroy all props
     */
    unRef: () => void;
    /**
     * @private
     * @type {Value}
     */
    private V;
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
    /**
     * @private
     * @type {Value}
     */
    private P;
    get prev(): Value;
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
}
import { $ } from './$.mjs';
