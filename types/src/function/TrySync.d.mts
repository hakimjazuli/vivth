export function TrySync<ResultType>(function_: () => ResultType): [ResultType | undefined, Error | undefined];
