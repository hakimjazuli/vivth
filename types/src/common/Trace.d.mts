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
export function Trace(traceIndex: number): string;
