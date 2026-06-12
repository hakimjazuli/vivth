// @ts-check

import { Paths } from '../class/Paths.mjs';
import { GetRuntime } from '../function/GetRuntime.mjs';
import { IsSameFile } from '../function/IsSameFile.mjs';

/**
 * - for browser
 * @param {string} url
 * @returns {string}
 */
function fileURLToPath(url) {
	if (GetRuntime() === 'browser') {
		return url;
	}
	const u = new URL(url);
	if (u.protocol !== 'file:') {
		throw new Error('Only file:// URLs can be converted to paths');
	}
	// decode %20 etc.
	let pathname = decodeURIComponent(u.pathname);

	// On Windows, strip leading slash and convert / to \
	if (/^\/[A-Za-z]:/.test(pathname)) {
		pathname = pathname.slice(1);
	}
	return pathname.replace(/\//g, '\\');
}
const thisPath = Paths.normalize(fileURLToPath(import.meta.url));

/**
 * @param {string} match
 * @param {string} importMetaURL
 */
const tracePathSameFileFilter = (match, importMetaURL) => {
	const [letter, path_] = match.split(':');
	const newPath = [letter, path_].join(':');
	return IsSameFile(newPath, importMetaURL);
};

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
 * import { TracePath, Console } from 'vivth/neutral';
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
	/**
	 * @type {Parameters<typeof TracePath>[0]}
	 */
	const trueFilterCallback = (match) => {
		return filterCallback(match) && !tracePathSameFileFilter(match, thisPath);
	};
	for (let i = 0; i < stacks.length; i++) {
		const stack = stacks[i];
		if (!stack) {
			return;
		}
		const check = stack.match(/([A-Z]:[^ ]*[0-9]|\/[^ )]+:\d+:\d+)/m);
		if (!check || !check[1]) {
			continue;
		}
		const match = Paths.normalize(check[1]);
		if (!trueFilterCallback(match)) {
			continue;
		}
		return match;
	}
}
