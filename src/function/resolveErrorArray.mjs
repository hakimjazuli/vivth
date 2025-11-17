// @ts-check

/**
 * @param {unknown} unknown
 * @returns {[undefined, Error]}
 */
export const resolveErrorArray = (unknown) => {
	return [undefined, unknown instanceof Error ? unknown : new Error(String(unknown))];
};
