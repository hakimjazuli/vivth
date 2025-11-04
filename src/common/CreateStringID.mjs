// @ts-check

import { QChannel } from '../class/QChannel.mjs';
import { LazyFactory } from '../function/LazyFactory.mjs';
import { Timeout } from '../function/Timeout.mjs';
import { TryAsync } from '../function/TryAsync.mjs';

const qchannel = LazyFactory(() => new QChannel('CreateStringID'));

/**
 * @description
 * - function helper to generate absolute unique ID;
 * - the asynchrounous nature is to prevent race condition that might resulting same Id being generated;
 * >- queued using QChannel;
 * @param {string} [prefix]
 * @returns {ReturnType<typeof TryAsync<string>>}
 * @example
 * import { CreateStringID } from 'vivth';
 *
 * (async () => {
 * 	const [myUniqueID, errorCreatingUniqueID] = await CreateStringID('myPrefix');
 * 	if(errorCreatingUniqueID) {
 * 		return;
 * 	}
 * 	Console.log(myUniqueID); // `myPrefix${Date.now()}`
 * })()
 */
export async function CreateStringID(prefix = '') {
	return await qchannel.callback('newStringID', async () => {
		await Timeout(1);
		return `${prefix}${Date.now()}`;
	});
}
