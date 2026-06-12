// @ts-check

import { readFile } from 'node:fs/promises';

import { lookup } from 'mime-types';

import { TryAsync } from '../function/TryAsync.mjs';
import { Console } from '../class/Console.mjs';

/**
 * @description
 * - create inline base64 url;
 * - usage:
 * >- can be extremely usefull to display file on desktop app webview, without exposing http server;
 * >- when using `FSasar`, use [Base64URL](#base64url) instead;
 * @param {string} filePath
 * @returns {Promise<{data:string, mime:string|false}|undefined>}
 * @example
 * import { join } from 'node:path'
 *
 * import { Base64URLFromFile } from 'vivth/node';
 * import { Paths } from 'vivth/neutral';
 *
 * await Base64URLFromFile(join(Paths.root, '/path/to/file'));
 */
export async function Base64URLFromFile(filePath) {
	const [res, errorBase64URLFromFile] = await TryAsync(async () => {
		const mime = lookup(filePath);
		const data = `data:${lookup(filePath)};base64,${await readFile(filePath, { encoding: 'base64' })}`;
		return { data, mime };
	});
	if (errorBase64URLFromFile) {
		Console.error({ errorBase64URLFromFile });
		return;
	}
	return res;
}
