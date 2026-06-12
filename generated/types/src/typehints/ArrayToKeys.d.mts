/**
 * @description
 * - Internal utility to deduplicate a tuple
 */
export type Deduplicate<T extends readonly unknown[], ACC extends readonly unknown[] = []> = T extends readonly [infer Head, ...infer Tail] ? Head extends ACC[number] ? Deduplicate<Tail, ACC> : Deduplicate<Tail, readonly [...ACC, Head]> : ACC;
/**
 * @preserve
 * @description
 * - extract unique string from ArrayString[];
 * - Takes an array/tuple type and returns a unique UNION of its elements.
 * ```ts
 * const a = ['hi', 'there'] as const;
 * const check = (aa:ArrayToKeys<typeof a>) => {};
 * ```
 * ```js
 * const a = /** [at]type {const} *[blank]/ (['hi', 'there']);
 * /** [at]param {ArrayToKeys<typeof a>} aa *[blank]/
 * const check = (aa) => {};
 * ```
 * @template {readonly unknown[]} T
 * @[blank]typedef {import('./ArrayToKeys.mts').ArrayToKeys<T>} ArrayToKeys
 */
export type ArrayToKeys<T extends readonly unknown[]> = Deduplicate<T>[number];
