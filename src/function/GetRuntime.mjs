// @ts-check

/**
 * @typedef {import("../types/Runtime.mjs").Runtime} Runtime
 */

/**
 * @type {Runtime|undefined}
 */
let runtime = undefined;

/**
 * @description
 * - detects the current JavaScript runtime;
 * @type {()=>Runtime}
 * @example
 * import { GetRuntime } form 'vivth';
 *
 * const runtime = GetRuntime();
 */
export function GetRuntime() {
	if (!runtime) {
		if (typeof Bun !== 'undefined') {
			runtime = 'bun';
		}
		// @ts-expect-error
		else if (typeof Deno !== 'undefined') {
			runtime = 'deno';
		} else if (typeof process !== 'undefined' && process.versions?.node) {
			runtime = 'node';
		} else if (typeof window !== 'undefined' && typeof document !== 'undefined') {
			runtime = 'browser';
		} else {
			runtime = 'unknown';
		}
	}
	return runtime;
}
