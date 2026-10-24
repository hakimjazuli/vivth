// @ts-check

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
export function SplitWithEscapedSeparator(rawString, separator) {
	if (!separator) return [rawString];

	// Escape special regex characters in the separator (e.g., '.', '|', '?', etc.)
	const escapedSep = separator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

	// Matches non-escaped separator using negative lookbehind
	const splitRegex = new RegExp(`(?<!\\\\)${escapedSep}`);

	// Unescape regex to replace backslash-escaped separator back to literal separator
	const unescapeRegex = new RegExp(`\\\\${escapedSep}`, 'g');

	return rawString.split(splitRegex).map((part) => part.replace(unescapeRegex, separator));
}
