// @ts-check

import { QFIFO } from '../class/QFIFO.mjs';

/**
 * @description
 * - function to auto queue callbacks that will be called `first in first out` style;
 * ```js
 * // @ts-check
 * import { NewPingFIFO } from 'vivth';
 * const debounceMS = 0; // in miliseconds, optionals, default is 0;
 * const handler = () =>{
 * 	NewPingFIFO(async () => {
 * 		// your code
 * 	}, debounceMS);
 * }
 * ```
 */
/**
 * @param {()=>(any|Promise<any>)} callback
 * @param {number} debounce
 * @returns
 */
export const NewPingFIFO = (callback, debounce = 0) => QFIFO.assign(callback, debounce);
