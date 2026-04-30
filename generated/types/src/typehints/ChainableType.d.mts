export type ChainableType<T extends object> = { [K in keyof T]: T[K] extends (...args: any[]) => any ? (...args: Parameters<T[K]>) => ChainableType<T> : T[K]; };
