export type ChainableProxyType<T extends object> = { [K in keyof T]: T[K] extends (...args: any[]) => any ? (...args: Parameters<T[K]>) => ChainableProxyType<T> : T[K]; };
