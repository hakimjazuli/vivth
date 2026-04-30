// @ts-check

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
export function PipeSync(intialValue, ...pipeFunctions) {
	for (let i = 0; i < pipeFunctions.length; i++) {
		const function_ = pipeFunctions[i];
		if (
			/**  */
			!function_
		) {
			continue;
		}
		intialValue = function_(intialValue);
	}
	return intialValue;
}
