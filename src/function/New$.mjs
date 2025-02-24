// @ts-check

import { $ } from '../class/$.mjs';

/**
 * @description
 *  - function to create `autosubscriber`;
 *  - syntatic sugar for [$](#$);
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
 *  // console.log(derived.value);
 * });
 * signal.value = 1;
 * ```
 */
/**
 * @param {()=>void} effect subscriber
 * @returns {$} instance of `$`
 */
export const New$ = (effect) => new $(effect);
