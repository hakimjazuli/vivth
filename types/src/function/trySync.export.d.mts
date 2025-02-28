export function trySync<ResultType>(function_: () => ResultType): [Error | null, ResultType | null];
