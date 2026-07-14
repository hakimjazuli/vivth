import { TryAsync } from '../function/TryAsync.mjs';
/**
 * @description
 * - function helper to generate absolute unique ID;
 * - the asynchrounous nature is to prevent race condition that might resulting same Id being generated;
 * >- queued using QChannel;
 * @param {string} [prefix]
 * @param {string} [suffix]
 * @returns {ReturnType<typeof TryAsync<string>>}
 * @example
 * import { CreateStringID } from 'vivth/neutral';
 *
 * (async () => {
 * 	const [myUniqueID, errorCreatingUniqueID] = await CreateStringID('myPrefix', 'mySuffix');
 * 	if(errorCreatingUniqueID) {
 * 		return;
 * 	}
 * 	Console.log(myUniqueID); // `myPrefix${Date.now()}mySuffix`
 * })()
 */
export declare function CreateStringID(prefix?: string, suffix?: string): ReturnType<typeof TryAsync<string>>;
