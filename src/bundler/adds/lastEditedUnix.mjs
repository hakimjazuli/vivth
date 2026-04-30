// @ts-check

import { stat } from 'node:fs/promises';

/**
 * @param {any} fullPath
 * @returns {Promise<number>}
 */
export const lastEditedUnix = async (fullPath) => {
	const stats = await stat(fullPath);
	return Math.floor(stats.mtimeMs / 1000);
};
