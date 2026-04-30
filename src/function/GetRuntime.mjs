// @ts-check

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
 * import { GetRuntime } form 'vivth';
 *
 * const runtime = GetRuntime();
 */
export function GetRuntime() {
	if (
		/**  */
		runtime === undefined
	) {
		if (
			/**  */
			typeof Bun !== 'undefined'
		) {
			runtime = 'bun';
		} else if (
			/**  */
			// @ts-expect-error
			typeof Deno !== 'undefined'
		) {
			runtime = 'deno';
		} else if (
			/**  */
			typeof process !== 'undefined' &&
			process.versions?.node
		) {
			runtime = 'node';
		} else if (
			/**  */
			typeof window !== 'undefined' &&
			typeof document !== 'undefined'
		) {
			runtime = 'browser';
		} else {
			runtime = 'unknown';
		}
	}
	return runtime;
}
