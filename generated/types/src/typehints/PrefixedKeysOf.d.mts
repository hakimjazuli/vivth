export type PrefixedKeysOf<T extends unknown, Prefix extends string> = Extract<keyof T, `${Prefix}${string}`>;
