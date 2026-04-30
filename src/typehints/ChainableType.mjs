// @ts-check

/**
 * @template {object} T
 * @typedef {{
 *   [K in keyof T]:
 *     T[K] extends (...args: any[]) => any
 *       ? (...args: Parameters<T[K]>) => ChainableType<T>
 *       : T[K]
 * }} ChainableType
 */
