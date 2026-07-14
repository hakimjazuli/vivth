export type Runtime = import("../typehints/Runtime.mjs").Runtime;
/**
 * @description
 * - detects the current JavaScript runtime;
 * @type {()=>Runtime}
 * @example
 * import { GetRuntime } from 'vivth/neutral';
 *
 * const runtime = GetRuntime();
 */
export declare function GetRuntime(): import("../typehints/Runtime.mjs").Runtime;
