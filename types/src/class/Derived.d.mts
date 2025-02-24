/**
 * @description
 * - a class for creating signal which its value are derived from other signal (`Derived` and `Signal` alike);
 * - can be subscribed by using [New$](#new$);
 * - for minimal total bundle size use `function` [NewDerived](#newderived) instead;
 */
/**
 * @template V
 * @extends Signal<V>
 */
export class Derived<V> extends Signal<V> {
    /**
     * @param {()=>V} derivedFunction
     */
    constructor(derivedFunction: () => V);
}
import { Signal } from './Signal.mjs';
