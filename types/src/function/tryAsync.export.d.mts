export function tryAsync<ResultType>(asyncFunction_: () => Promise<ResultType>): Promise<[ResultType | null, Error | null]>;
