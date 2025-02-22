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
export function NewDerived(derivedFunction: () => (void | Promise<void>)): Derived<void | Promise<void>>;
import { Signal } from './NewSignal.mjs';
