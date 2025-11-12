/**
 * @description
 * - get stack trace path that matched with truthy filterCallback;
 * - returns position of stack trace as string, formatted like `fileName:lineNumber:columnNumber`;
 * - extremely usefull for:
 * >- jumping positions to code line;
 * >- creating dynamic string id;
 * @param {(stackString:string)=>boolean} filterCallback
 * - stackString path are normalized to use forward slash;
 * - if return true, `TracePath` will return the current stackString;
 * - if return false, continue to check the stacks;
 * @returns {string|undefined}
 * @example
 * import { TracePath, Console } from 'vivth';
 *
 * Console.log(
 * 	TracePath((stackString) => {
 * 		return stackString.includes('test.mjs');
 * 	})
 * ); // "D://test.mjs:4:2"
 */
export function TracePath(filterCallback: (stackString: string) => boolean): string | undefined;
