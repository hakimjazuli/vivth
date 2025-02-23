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
    protected get S(): Set<() => void>;
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
import { $ } from '../class/$.mjs';
