// @ts-check

import { pathToFileURL } from 'node:url';

import { GetRuntime } from './GetRuntime.mjs';
import { ClearRequireCache } from './ClearRequireCache.mjs';
import { Paths } from '../class/Paths.mjs';
import { init } from 'import-without-cache';
import { LazyFactory } from './LazyFactory.mjs';
import { QChannel } from '../class/QChannel.mjs';
import { PipeSync } from './PipeSync.mjs';

let isInited = false;

const q = LazyFactory(() => new QChannel('SafeImport'));

/**
 * @param {string} path
 * @returns {string}
 */
const ifNodeThenCorrectPath = (path) => {
	if (GetRuntime() !== 'node') {
		return path;
	}
	return (path = pathToFileURL(path).href);
};

/**
 * @param {string} path
 * @returns {Promise<any>}
 */
const queuedCallback = async (path) => {
	if (GetRuntime() === 'node' && !isInited) {
		isInited = true;
		init({ skipNodeModules: true });
	}
	ClearRequireCache(path);
	const result = await import(
		/** */
		path,
		{ with: { cache: 'no' } }
	);
	ClearRequireCache(path);
	return result;
};

/**
 * @description
 * - import while imediately call clearing require caches;
 * - `usecases`:
 * >- long running process that need to prevent memory leak from uncleanable `cached import`;
 * >- to simply import fresh everytime;
 * - the imported module can then just be treated like any other variable, to only lived and tracked by variable reference only;
 * - due to how `vivth/node.ClearRequireCache` works, parallel await (like using Promise.all, or not awaited until later) will be done squentially(if targetting the same path);
 * @template { any } T
 * - put the type
 * @param {string} path
 * - either absolute `diskAbsolutepath` or from `Paths.root`;
 * @returns {ReturnType<typeof import('./TryAsync.mjs').TryAsync<T>>}
 * @example
 * // Paths.root/myscript.mjs
 * import { SafeImport } from 'vivth/node';
 *
 * // add type with: import('vivth/neutral').SafeImportReturnType<import('./something.mjs')>
 * const [importedModule, errorSafeImport] = await SafeImport('/absolute/path/from/Paths.root/something.mjs');
 */
export async function SafeImport(path) {
	path = PipeSync(
		/** */
		Paths.diskAbsolute(path),
		Paths.nativeSep,
		ifNodeThenCorrectPath,
	);
	return await q.callback(path, async () => {
		return await queuedCallback(path);
	});
}
