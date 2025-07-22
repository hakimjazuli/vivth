// @ts-check

import { QUnique } from '../../index.mjs';

/**
 * @description
 * - function to auto queue callbacks:
 * > - different `uniqueID`: called `first in first out` style;
 * > - same `uniqueID`: will be grouped, only the already running callback and the last callback will be called;
 * ```js
 * // @ts-check
 * import { NewPingUnique } from 'vivth';
 * const uniqueID = 'yourUniqueID'; // can be anything, even a reference to an object;
 * const debounceMS = 0; // in miliseconds, optionals, default is 0;
 * const handler = () =>{
 * 	NewPingUnique(uniqueID, async () => {
 * 		// your code
 * 	}, debounceMS);
 * }
 * ```
 */
/**
 * @param {import('../../index.mjs').anyButUndefined} uniqueID
 * @param {()=>(any|Promise<any>)} callback
 * @param {number} debounce
 * @returns
 */
export const NewPingUnique = (uniqueID, callback, debounce = 0) =>
	QUnique.assign({ i: uniqueID, c: callback, d: debounce });
