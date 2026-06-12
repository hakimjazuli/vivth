/**
 * Utility: build a tuple of length N filled with type T (default = any).
 */
export type TupleOfLength<N extends number, T = any, R extends any[] = []> = R['length'] extends N
	? R
	: TupleOfLength<N, T, [...R, T]>;

/**
 * @preserve
 * @description
 * - Drop the first N parameters from METHOD and return the rest;
 * @template {(...args: any[]) => any} METHOD
 * @template {number} N
 * @[blank]typedef {import('./ParametersFollowingN.mts').ParametersFollowingN<N, METHOD>} ParametersFollowingN
 */
export type ParametersFollowingN<METHOD extends (...args: any[]) => any, N extends number> =
	Parameters<METHOD> extends [...TupleOfLength<N>, ...infer Rest] ? Rest : [];
