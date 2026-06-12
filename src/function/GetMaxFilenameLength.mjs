// @ts-check

import process from 'node:process';
import { constants } from 'node:fs';

/**
 * @type { undefined|number }
 */
let length;
const fallbacklenght = 255;

/**
 * @description
 * - Get OS-specific max filename length;
 * - On POSIX: fs.constants.NAME_MAX;
 * - On Windows: 255 (per component, unless long paths enabled);
 * - used internally to validate name length for [`UniqueFSTempName`](#uniquefstempname);
 * @returns {number}
 */
export function GetMaxFilenameLength() {
	if (length === undefined) {
		if (process.platform === 'win32') {
			length = fallbacklenght; // fallback if undefined
		} else {
			length =
				// @ts-expect-error
				constants.NAME_MAX || fallbacklenght; // fallback if undefined
		}
	}
	// @ts-expect-error
	return length;
}
