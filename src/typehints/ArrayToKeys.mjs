/**
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
 * @typedef {import('./ArrayToKeys.mts').ArrayToKeys<T>} ArrayToKeys
 */
