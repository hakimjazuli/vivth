export function timeout(ms: number): Promise<void>;
export function isAsync(fn: (...any: any) => (any | Promise<any>)): boolean;
