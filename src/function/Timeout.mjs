// @ts-check

/**
 * @description
 * - function helper to temporarily block the code in async context;
 * @param {number} timeMS
 * - in miliseconds;
 * @returns {Promise<void>}
 * @example
 * import { Timeout } from 'vivth';
 *
 * const test = async () => {
 *   // code0
 *   await Timeout(1000);
 *   // code1
 * }
 * test();
 */
export const Timeout = (timeMS) => {
	return new Promise((resolve) => {
		setTimeout(resolve, timeMS);
	});
};
