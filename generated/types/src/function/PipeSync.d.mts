/**
 * @description
 * @template {any} VALUE
 * @param {VALUE} intialValue
 * @param {...((currentvalue:VALUE)=>VALUE)} pipeFunctions
 * @returns {VALUE}
 * @example
 * import { PipeSync } from 'vivth';
 *
 * const res = PipeSync(
 *  'intialValue', // res: "intialValue"
 *  (val) => `${val}:1`, // res: "intialValue:1"
 *  (val) => `${val}:2`, // res: "intialValue:1:2"
 *  (val) => `${val}:3` // res: "intialValue:1:2:3"
 * );
 */
export function PipeSync<VALUE extends unknown>(intialValue: VALUE, ...pipeFunctions: ((currentvalue: VALUE) => VALUE)[]): VALUE;
