export function trySync<ResultType>(function_: () => ResultType): [ResultType | null, Error | null];
