/**
 * @description
 * - a class for Queue;
 * - for minimal total bundle size use `function` [NewPingUnique](#newpingunique) instead;
 * - this class provides `QUnique.makeQClass`;
 * >- this method will setup `QUnique` to use the inputed `queueMap`(as arg0) as centralized lookup for queue managed by `QUnique`;
 * >- usefull to modify this class for browser runtime, since `vivth` cannot just refer to window, you can just add `window["someobject"]`: `Map<any, [()=>Promise<any>,number]>` as lookups;
 */
export class QUnique {
    /**
     * @param {Map<any, [()=>Promise<any>,number]>} queueMap
     * @returns {typeof QUnique}
     */
    static makeQClass: (queueMap: Map<any, [() => Promise<any>, number]>) => typeof QUnique;
    /**
     * @typedef {Object} queueUniqueObject
     * @property {any} i
     * @property {()=>(any|Promise<any>)} c
     * @property {number} [d]
     */
    /**
     * @type {Map<any, [()=>Promise<any>,number]>}
     */
    static "__#6@#queue": Map<any, [() => Promise<any>, number]>;
    /**
     * @type {boolean}
     */
    static "__#6@#isRunning": boolean;
    /**
     * @type {(queueUniqueObject:queueUniqueObject)=>void}
     */
    static assign: (queueUniqueObject: {
        i: any;
        c: () => (any | Promise<any>);
        d?: number;
    }) => void;
    /**
     * @param {queueUniqueObject} _queue
     */
    static "__#6@#push": (_queue: {
        i: any;
        c: () => (any | Promise<any>);
        d?: number;
    }) => void;
    static "__#6@#run": () => Promise<void>;
}
