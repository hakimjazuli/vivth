/**
 * @description
 * Splits a string by a given separator, ignoring escaped separators.
 * Handles backslash escapes (e.g., `\\` for a literal backslash, `\;` for an escaped separator).
 *
 * @param {string} rawString
 * @param {string} separator
 * @returns {string[]}
 * @example
 * import SplitWithEscapedSeparator from 'vivth/neutral';
 * SplitWithEscapedSeparator('myString;my\;String', ';'); // ['myString',]
 */
export declare function SplitWithEscapedSeparator(rawString: string, separator: string): string[];
