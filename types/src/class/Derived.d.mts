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
