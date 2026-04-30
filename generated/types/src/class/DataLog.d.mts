/**
 * @description
 * - class helper for signal performant logging, more or less just for type hinting;
 * - internally used as Signal value logging instance;
 * @template {any} VALUE
 */
export class DataLog<VALUE extends unknown> {
    /**
     * @description
     * @param {VALUE} value
     */
    constructor(value: VALUE);
    /**
     * @description
     * - data value;
     * @type {VALUE}
     */
    value: VALUE;
    /**
     * @description
     * - occurence unix timestamp;
     * @type {number}
     */
    timeStamp: number;
}
