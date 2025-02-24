// @ts-check

import { Signal } from '../class/Signal.mjs';

/**
 * @description
 *  - function to create `signal`;
 *  - syntatic sugar for [Signal](#signal);
 * ```js
 * import { New$, NewDerived, NewSignal } from 'vivth';
 * const signal = NewSignal(0);
 * const derived = NewDerived(async () =>{
 *  // runs everytime signal.value changes;
 *  return signal.value * 2;
 * });
 * const autosubscriber = New$(async ()=>{
 *  // runs everytime signal.value changes;
 *  console.log(signal.value);
 * });
 * signal.value = 1;
 * ```
 */
/**
 * @template Value
 * @param {Value} value
 * @returns {Signal<Value>}
 */
export const NewSignal = (value) => new Signal(value);
