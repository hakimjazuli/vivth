// @ts-check

import { ForInAsync } from './ForInAsync.mjs';

/**
 * @description
 * - function for error as value for chained operations;
 * - utility function to brute force which key is able to run;
 * - usefull to flatten indentation for error handlings;
 * - caveat:
 * >- run in sequence, awaiting each key bofore running next key;
 * @template {string} KEY
 * @template RETURNTYPE
 * @template {Record<
 * 	KEY,
 * 	(err:{prevError:undefined|Error}) => Promise<RETURNTYPE>
 * >} RecordTryType
 * @param {RecordTryType} tryRecord
 * @returns {Promise<
 * 	[[keyof RecordTryType, RETURNTYPE], undefined]
 * 	| [[undefined, undefined], Set<Error>]
 * >}
 * @example
 * import { Tries } from 'vivth';
 *
 * const [[key, result], setOfError] = await Tries({
 * 	someRuntime: async ({ prevError }) => {
 * 		// asuming on this one doesn't naturally throw error,
 * 		// yet you need to continue to next key,
 * 		// instead of returning,
 * 		// you should throw new Error(something);
 * 	},
 * 	browser: async ({ prevError }) => {
 * 		return location?.origin;
 * 		// if no error, stop other key function from running;
 * 		// key = 'browser'
 * 		// result = location?.origin;
 * 		// error = undefined;
 * 		// if error;
 * 		// run nodeOrBun;
 * 	},
 * 	nodeOrBun: async ({ prevError }) => {
 * 		return process?.env?.INIT_CWD ?? process?.cwd();
 * 		// if no error;
 * 		// key = 'nodeOrBun'
 * 		// result =  process?.env?.INIT_CWD ?? process?.cwd();
 * 		// if error;
 * 		// key = undefined;
 * 		// result = undefined;
 * 		// error = new Error('unable to run any key');
 * 	},
 * });
 */
export async function Tries(tryRecord) {
	/**
	 * @type {undefined|keyof RecordTryType}
	 */
	let key;
	/**
	 * @type {undefined|RETURNTYPE}
	 */
	let result;
	const [, setOfError] = await ForInAsync(
		tryRecord,
		async (key_, callback, { prevError, breakEarly }) => {
			const result_ = await callback({ prevError });
			breakEarly(); // when not error, it will break after return;
			key = key_;
			result = result_;
		},
	);
	if (
		/**  */
		key
	) {
		// @ts-expect-error
		return [[key, result], undefined];
	}
	return [[undefined, undefined], setOfError];
}
