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
 * @[blank]typedef {import('./IsTypeOf.mts').IsTypeOf<K>} IsTypeOf
 */
export function IsTypeOf<K extends keyof typeof TypeMap>(
	object: unknown,
	type: K,
): object is (typeof TypeMap)[K] {
	return typeof object === type;
}
