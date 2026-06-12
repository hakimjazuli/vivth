/**
 * @description
 * - key symbol to imediately generate object wrapped by `LazyFactory`;
 * - usefull for Object that has different accessor behaviour when being get via Proxy, like:
 * >- `Set<any>`;
 * >- `Map<any, any>`;
 * @type {symbol}
 */
export const FactoryKey: symbol;
