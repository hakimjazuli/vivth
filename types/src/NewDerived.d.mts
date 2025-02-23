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
export function NewDerived<V>(derivedFunction: () => (V)): Derived<V>;
import { Signal } from './NewSignal.mjs';
