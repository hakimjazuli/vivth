// @ts-check

import { Paths } from '../class/Paths.mjs';

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
export function TracePath(filterCallback) {
	const err = new Error();
	const stacks = err.stack?.split('\n');
	if (!stacks || !stacks.length) {
		return;
	}
	for (let i = 0; i < stacks.length; i++) {
		const stack = stacks[i];
		if (!stack) {
			return;
		}
		const check = stack.match(/([A-Z]:[^ ]*[0-9]|\/[^ )]+:\d+:\d+)/m);
		const match = Paths.normalize(check?.[1] ?? stack.trim());
		if (!filterCallback(match)) {
			continue;
		}
		return match;
	}
}
