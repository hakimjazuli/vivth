/**
 * Map of 'typeof' string results to their actual TypeScript types.
 * Using a constant object allows for type-safe extraction without
 * manual conditional mapping.
 */
declare const TypeMap: {
    string: string;
    number: number;
    boolean: boolean;
    object: {};
    function: () => void;
    undefined: undefined;
    symbol: symbol;
    bigint: bigint;
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
export declare function IsTypeOf<K extends keyof typeof TypeMap>(object: unknown, type: K): object is (typeof TypeMap)[K];
export {};
