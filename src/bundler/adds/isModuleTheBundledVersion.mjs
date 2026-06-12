// @ts-check

/**
 * @param { string } path
 * @param { string } ext
 * @returns { boolean }
 */
export const isModuleTheBundledVersion = (path, ext) => {
	return path.endsWith(`.bundled${ext}`);
};
