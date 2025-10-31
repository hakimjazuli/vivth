// @ts-check

import { Paths } from '../class/Paths.mjs';

/**
 * @description
 * - returns position of stack trace as string, formatted as `fileName:lineNumber:columnNumber`;
 * - extremely usefull for:
 * >- jumping positions to code line;
 * >- creating dynamic string id;
 * @param {number} traceIndex
 * @returns {string}
 * @example
 * import { Trace, Console } from 'vivth';
 *
 * Console.log(Trace(3)); // "D://test.mjs:3:13"
 */
export function Trace(traceIndex) {
	const err = new Error();
	const stack = err.stack?.split('\n');
	const callerLine = stack?.[Math.round(traceIndex)] ?? 'unknown';
	const match = callerLine.match(/([A-Z]:[^ ]*[0-9]|\/[^ )]+:\d+:\d+)/m);
	return Paths.normalize(match?.[1] ?? callerLine.trim());
}
