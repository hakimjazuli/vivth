// @ts-check

import { IsTypeOf } from './IsTypeOf.mjs';

/**
 * @typedef {import("../typehints/Runtime.mjs").Runtime} Runtime
 */

/**
 * @type {Runtime|undefined}
 */
let runtime;

/**
 * @description
 * - detects the current JavaScript runtime;
 * @type {()=>Runtime}
 * @example
 * import { GetRuntime } from 'vivth/neutral';
 *
 * const runtime = GetRuntime();
 */
export function GetRuntime() {
	if (runtime === undefined) {
		if (
			// @ts-expect-error
			!IsTypeOf(Bun, 'undefined')
		) {
			runtime = 'bun';
		} else if (!IsTypeOf(process, 'undefined') && process.versions?.node) {
			runtime = 'node';
		} else if (!IsTypeOf(window, 'undefined') && !IsTypeOf(document, 'undefined')) {
			runtime = 'browser';
		} else {
			runtime = 'unknown';
		}
	}
	return runtime;
}
