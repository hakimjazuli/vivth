// @ts-check

/**
 * @description
 * - create an async pipeline starting from an initial value;
 * - every step must return the same type (VALUE), but may be sync or async.
 * @template {any} VALUE
 * @param {VALUE} intialValue
 * @param {...((currentvalue:VALUE)=>VALUE|Promise<VALUE>)} pipeFunctions
 * @returns {Promise<VALUE>}
 * @example
 * import { PipeAsync } from 'vivth/neutral';
 *
 * const res = await PipeAsync(
 *  'intialValue', // res: Promise<"intialValue">
 *  (val) => `${val}:1`, // res: Promise<"intialValue:1">
 *  async (val) => `${val}:2`, // res: Promise<"intialValue:1:2">
 *  (val) => `${val}:3` // res: Promise<"intialValue:1:2:3">
 * );
 */
export async function PipeAsync(intialValue, ...pipeFunctions) {
	for (let i = 0; i < pipeFunctions.length; i++) {
		const function_ = pipeFunctions[i];
		if (!function_) {
			continue;
		}
		intialValue = await function_(intialValue);
	}
	return intialValue;
}
