// @ts-check

/**
 * Checks for a @preserve JSDoc block containing literal '@'+'[blank]'+'typedef'.
 * Returns the modified string, or false if no such block exists.
 * @param {string} sourceCode - The full source string/file content.
 * @returns {string | false} The modified full string, or false if no target block matches.
 */
export const cleanPreserveTypedef = (sourceCode) => {
	// A strict regex that ensures a block has both @preserve AND [blank] inside it
	const validationRegex = /\/\*\*([\s\S]*?@preserve[\s\S]*?@\[blank\]typedef[\s\S]*?)\*\//i;

	// 1. If the file doesn't have the target block combination, bail out immediately
	if (!validationRegex.test(sourceCode)) {
		return false;
	}

	// 2. We have a guaranteed match, now safely perform the replacement loop
	const jsDocRegex = /\/\*\*([\s\S]*?)\*\//g;

	return sourceCode.replace(jsDocRegex, (fullMatch, commentContent) => {
		if (commentContent.includes('@preserve')) {
			return fullMatch.replace(/@\[blank\]typedef/gi, '@typedef');
		}
		return fullMatch;
	});
};
