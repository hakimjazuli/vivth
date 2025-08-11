/**
 * @description
 * ```js
 * /**
 *  * @typedef {[callback:()=>(any|Promise<any>),debounce?:(number)]} queueFIFODetails
 *  *[blank]/
 * ```
 * - a class for Queue;
 * - function to auto queue callbacks that will be called `first in first out` style;
 * ```js
 * // @ts-check
 * import { PingFIFO } from 'vivth';
 * const debounceMS = 0; // in miliseconds, optionals, default is 0;
 * const handler = () =>{
 * 	new PingFIFO(async () => {
 * 		// your code
 * 	}, debounceMS);
 * }
 * ```
 * - this class provides `QFIFO.makeQClass`;
 * >- this method will setup `QFIFO` to use the inputed `queueArray`(as arg0) as centralized lookup for queue managed by `QFIFO`;
 * >- usefull to modify this class for browser runtime, since `vivth` cannot just refer to window, you can just add `window["someobject"]`: `Array<queueFIFODetails>` as lookups;
 */
export class PingFIFO {
    /**
     * @param {queueFIFODetails[]} queueArray
     * @returns {typeof PingFIFO}
     */
    static makeQClass: (queueArray: queueFIFODetails[]) => typeof PingFIFO;
    /**
     * @type {queueFIFODetails[]}
     */
    static "__#1@#queue": queueFIFODetails[];
    /**
     * @type {boolean}
     */
    static "__#1@#isRunning": boolean;
    /**
     * @param {queueFIFODetails} _queue
     */
    static "__#1@#push": (_queue: queueFIFODetails) => void;
    static "__#1@#run": () => Promise<void>;
    /**
     * @param {()=>(any|Promise<any>)} callback
     * @param {number} [debounce]
     */
    constructor(callback: () => (any | Promise<any>), debounce?: number);
}
/**
 * *[blank]/
 * ```
 * - a class for Queue;
 * - function to auto queue callbacks that will be called `first in first out` style;
 * ```js
 * //
 */
export type queueFIFODetails = [callback: () => (any | Promise<any>), debounce?: (number)];
