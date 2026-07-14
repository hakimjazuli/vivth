export type PrefixedKeysOf<T extends any, Prefix extends string> = Extract<keyof T, `${Prefix}${string}`>;
/**
 * @description
 * Define a type helper that extracts keys starting with a specific prefix
 * @template {any} T
 * @template {string} Prefix
 * @typedef {Extract<keyof T, `${Prefix}${string}`>} PrefixedKeysOf
 */
