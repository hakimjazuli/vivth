/**
 * @description
 * - a class for Queue;
 * > - different `uniqueID`: called `first in first out` style;
 * > - same `uniqueID`: will be grouped, only the already running callback and the last callback will be called;
 * ```js
 * // @ts-check
 * import { PingUnique } from 'vivth';
 * const uniqueID = 'yourUniqueID'; // can be anything, even a reference to an object;
 * const debounceMS = 0; // in miliseconds, optionals, default is 0;
 * const handler = () =>{
 *  new PingUnique(uniqueID, async () => {
 * 		// your code
 * 	}, debounceMS);
 * }
 * ```
 * - this class provides `QUnique.makeQClass`;
 * >- this method will setup `QUnique` to use the inputed `queueMap`(as arg0) as centralized lookup for queue managed by `QUnique`;
 * >- usefull to modify this class for browser runtime, since `vivth` cannot just refer to window, you can just add `window["someobject"]`: `Map<any, [()=>Promise<any>,number]>` as lookups;
 */
export class PingUnique {
    /**
     * @param {Map<any, [()=>Promise<void>,number]>} queueMap
     * @returns {typeof PingUnique}
     */
    static makeQClass: (queueMap: Map<any, [() => Promise<void>, number]>) => typeof PingUnique;
    /**
     * @type {Map<any, [()=>Promise<void>,number]>}
     */
    static "__#3@#queue": Map<any, [() => Promise<void>, number]>;
    /**
     * @type {boolean}
     */
    static "__#3@#isRunning": boolean;
    /**
     * @param {any} id
     * @param {()=>Promise<void>} callback
     * @param {number} debounceMS
     */
    static "__#3@#push": (id: any, callback: () => Promise<void>, debounceMS: number) => void;
    static "__#3@#run": () => Promise<void>;
    /**
     * @param {any} id
     * @param {()=>Promise<void>} callback
     * @param {number} [debounceMS]
     */
    constructor(id: any, callback: () => Promise<void>, debounceMS?: number);
}
