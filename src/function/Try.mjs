// @ts-check

import { Console } from '../class/Console.mjs';
import { TryAsync } from './TryAsync.mjs';

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
 * 	| [[undefined, undefined], Error]
 * >}
 * @example
 * import { Try } from 'vivth';
 *
 * const [[key, result], error] = await Try({
 * 	someRuntime: async ( prevError ) => {
 * 		// asuming on this one doesn't naturally throw error,
 * 		// yet you need to continue to next key,
 * 		// instead of returning,
 * 		// you should throw new Error(something);
 * 	},
 * 	browser: async ( prevError ) => {
 * 		return location?.origin;
 * 		// if no error, stop other key function from running;
 * 		// key = 'browser'
 * 		// result = location?.origin;
 * 		// error = undefined;
 * 		// if error;
 * 		// run nodeOrBun;
 * 	},
 * 	nodeOrBun: async ( prevError ) => {
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
export async function Try(tryRecord) {
	let prevError = undefined;
	for (const key in tryRecord) {
		const callback = tryRecord[key];
		const [result, error] = await TryAsync(async () => {
			return await callback({ prevError });
		});
		if (error) {
			prevError = error;
			continue;
		}
		return [[key, result], undefined];
	}
	return [[undefined, undefined], prevError];
}
