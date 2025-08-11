export function TryAsync<ResultType>(asyncFunction_: () => Promise<ResultType>): Promise<[ResultType | undefined, Error | undefined]>;
