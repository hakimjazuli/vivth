// @ts-check

import { readFile } from 'node:fs/promises';

import { lookup } from 'mime-types';

/**
 * @description
 * - create inline base64 url;
 * - usage:
 * >- can be extremely usefull to display file on desktop app webview, without exposing http server;
 * >- when using `FSInline`, use [Base64URL](#base64url) instead;
 * @param {string} filePath
 * @returns {Promise<string>}
 * @example
 * import { join } from 'node:path'
 *
 * import { Base64URLFromFile, Paths } from 'vivth'
 *
 * await Base64URLFromFile(join(Paths.root, '/path/to/file'));
 */
export async function Base64URLFromFile(filePath) {
	return `data:${lookup(filePath)};base64,${await readFile(filePath, { encoding: 'base64' })}`;
}
