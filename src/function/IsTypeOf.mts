/**
 * Map of 'typeof' string results to their actual TypeScript types.
 * Using a constant object allows for type-safe extraction without
 * manual conditional mapping.
 */
export const TypeMap = {
	string: '',
	number: 0,
	boolean: true,
	object: {},
	function: () => {},
	undefined: undefined,
	symbol: Symbol(),
	bigint: 0n,
};

/**
 * @preserve
 * @description
 * A type-safe `typeof` helper.
 * @template {keyof typeof TypeMap} K
 * @param {unknown} object - The value to check.
 * @param {K} type - The type string to compare against.
 * @returns {object is typeof TypeMap[K]} - Returns true if the type matches, narrowing the type.
 */
export function IsTypeOf<K extends keyof typeof TypeMap>(
	object: unknown,
	type: K,
): object is (typeof TypeMap)[K] {
	return typeof object === type;
}
