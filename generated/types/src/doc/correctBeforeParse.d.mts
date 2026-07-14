export type RetType = 'shouldProceedNextCheck' | 'waitForRewrite' | 'doNotProcess';
/**
 * @param {string} path
 * @param {BufferEncoding} [encoding]
 * @returns {Promise<RetType>}
 */
export declare const correctBeforeParse: (path: string, encoding?: BufferEncoding) => Promise<RetType>;
