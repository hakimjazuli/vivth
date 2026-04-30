// @ts-check

import { execPath } from 'node:process';
import { extname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { TrySync } from '../../function/TrySync.mjs';
import { Paths } from '../../class/Paths.mjs';

/**
 * @type {undefined|string}
 */
let archievePath_ = undefined;

export const asarPath = () => {
	if (
		/**  */
		!archievePath_
	) {
		const metaURL = import.meta.url;
		let [thisPath, error] = TrySync(() => {
			return fileURLToPath(metaURL);
		});
		if (
			/**  */
			error
		) {
			thisPath = metaURL;
		}
		if (
			/**  */
			!thisPath ||
			!thisPath.endsWith('js') ||
			Paths.normalize(thisPath).includes('/snapshot/') // mitigate pkg
		) {
			thisPath = execPath;
		}
		archievePath_ = thisPath.replace(new RegExp(`${extname(thisPath)}\$`, ''), '.asar/');
	}
	return Paths.normalize(archievePath_);
};
