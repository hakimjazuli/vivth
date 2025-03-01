export function tryAsync<ResultType>(asyncFunction_: () => Promise<ResultType>): Promise<[ResultType | undefined, Error | undefined]>;
