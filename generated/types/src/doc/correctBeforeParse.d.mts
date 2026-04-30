export function correctBeforeParse(path: string, encoding?: BufferEncoding): Promise<RetType>;
export type RetType = "shouldProceedNextCheck" | "waitForRewrite" | "doNotProcess";
