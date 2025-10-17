/**
 * @description
 * - function for error as value for synchronous operation;
 * - usefull to flatten indentation for error handlings;
 * @template RESULT
 * @param {()=>RESULT} function_
 * @returns {[RESULT,undefined]|
 * [undefined,Error]}
 * @example
 * import { readFileSync } from 'fs';
 * import { TrySync } from './yourModule.js';
 *
 * const [data, error] = TrySync(() => {
 * 	return readFileSync('./some/file.txt', 'utf-8');
 * });
 */
export function TrySync<RESULT>(function_: () => RESULT): [RESULT, undefined] | [undefined, Error];
