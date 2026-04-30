/**
 * Wraps a target object in a chainable proxy.
 *
 * @template {object} T
 * @param {T} ctx
 * @returns {import("../typehints/ChainableType.mjs").ChainableType<T>}
 */
export function Chainable<T extends object>(ctx: T): import("../typehints/ChainableType.mjs").ChainableType<T>;
