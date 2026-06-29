/**
 * Map of 'typeof' string results to their actual TypeScript types.
 * Using a constant object allows for type-safe extraction without
 * manual conditional mapping.
 */
export declare const TypeMap: {
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
 * @[blank]typedef {import('./IsTypeOf.mts').IsTypeOf<K>} IsTypeOf
 */
export declare function IsTypeOf<K extends keyof typeof TypeMap>(object: unknown, type: K): object is (typeof TypeMap)[K];
