// @ts-check

import { stat } from 'node:fs/promises';

/**
 * @param {any} fullPath
 * @returns {Promise<number>}
 */
export async function LastEditedUnix(fullPath) {
	const stats = await stat(fullPath);
	return Math.floor(stats.mtimeMs / 1000);
}
