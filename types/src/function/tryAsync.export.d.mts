export function tryAsync<ResultType>(asyncFunction_: () => Promise<ResultType>): Promise<[Error | null, ResultType | null]>;
