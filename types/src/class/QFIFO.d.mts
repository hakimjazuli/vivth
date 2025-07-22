/**
 * @description
 * ```js
 * /**
 *  * @typedef {[callback:()=>(any|Promise<any>),debounce?:(number)]} queueFIFODetails
 *  *[blank]/
 * ```
 * - a class for Queue;
 * - for minimal total bundle size use `function` [NewPingFIFO](#newpingfifo) instead;
 * - this class provides `QFIFO.makeQClass`;
 * >- this method will setup `QFIFO` to use the inputed `queueArray`(as arg0) as centralized lookup for queue managed by `QFIFO`;
 * >- usefull to modify this class for browser runtime, since `vivth` cannot just refer to window, you can just add `window["someobject"]`: `Array<queueFIFODetails>` as lookups;
 */
export class QFIFO {
    /**
     * @param {queueFIFODetails[]} queueArray
     * @returns {typeof QFIFO}
     */
    static makeQClass: (queueArray: queueFIFODetails[]) => typeof QFIFO;
    /**
     * @type {queueFIFODetails[]}
     */
    static "__#1@#queue": queueFIFODetails[];
    /**
     * @type {boolean}
     */
    static "__#1@#isRunning": boolean;
    /**
     * @type {(...queueFIFODetails:queueFIFODetails)=>void}
     */
    static assign: (...queueFIFODetails: queueFIFODetails) => void;
    /**
     * @param {queueFIFODetails} _queue
     */
    static "__#1@#push": (_queue: queueFIFODetails) => void;
    static "__#1@#run": () => Promise<void>;
}
/**
 * *[blank]/
 * ```
 * - a class for Queue;
 * - for minimal total bundle size use `function` [NewPingFIFO](#newpingfifo) instead;
 * - this class provides `QFIFO.makeQClass`;
 * >- this method will setup `QFIFO` to use the inputed `queueArray`(as arg0) as centralized lookup for queue managed by `QFIFO`;
 * >- usefull to modify this class for browser runtime, since `vivth` cannot just refer to window, you can just add `window["someobject"]`: `Array<queueFIFODetails>` as lookups;
 */
export type queueFIFODetails = [callback: () => (any | Promise<any>), debounce?: (number)];
