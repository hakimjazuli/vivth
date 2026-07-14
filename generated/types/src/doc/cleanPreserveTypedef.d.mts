/**
 * Checks for a @preserve JSDoc block containing literal '@'+'[blank]'+'typedef'.
 * Returns the modified string, or false if no such block exists.
 * @param {string} sourceCode - The full source string/file content.
 * @returns {string | false} The modified full string, or false if no target block matches.
 */
export declare const cleanPreserveTypedef: (sourceCode: string) => string | false;
