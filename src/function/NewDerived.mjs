// @ts-check

import { Derived } from '../class/Derived.mjs';

/**
 * @description
 *  - funtion to create `autosubscriber`;
 *  - syntatic sugar for [Derived](#derived);
 * ```js
 * import { New$, NewDerived, NewSignal } from 'vivth';
 * const signal = NewSignal(0);
 * const derived = NewDerived(async () =>{
 *  // runs everytime signal.value changes;
 *  return signal.value * 2;
 * });
 * const autosubscriber = New$(async ()=>{
 *  // runs everytime derived.value changes;
 *  console.log(derived.value);
 * });
 * signal.value = 1;
 * ```
 */
/**
 * @template V
 * @param {()=>(V)} derivedFunction
 * @returns {Derived<V>}
 */
export const NewDerived = (derivedFunction) => new Derived(derivedFunction);
