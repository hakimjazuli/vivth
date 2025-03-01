export function trySync<ResultType>(function_: () => ResultType): [ResultType | undefined, Error | undefined];
