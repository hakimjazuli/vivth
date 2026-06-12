// @ts-check

import { createRequire } from 'node:module';

import { ForOfSync } from './ForOfSync.mjs';
import { fileURLToPath } from 'node:url';
import { Paths } from '../class/Paths.mjs';

const require = /* @__PURE__ */ createRequire(import.meta.url);

/**
 * @param {string} string
 * @returns {string}
 */
const fileURLToPathWithDenormalized = (string) => {
	return Paths.nativeSep(fileURLToPath(string).toString());
};

/**
 * @description
 * - safely clear `import`/`require` `caches`;
 * @type {(path:string)=>void}
 * @example
 * import { ClearRequireCache } from 'vivth/node';
 *
 * ClearRequireCache('D://path/to.mjs');
 */
export function ClearRequireCache(keysOfCache) {
	ForOfSync([Paths.nativeSep, fileURLToPathWithDenormalized], (handler) => {
		const keysOfCache_ = handler(keysOfCache).toString();
		delete require.cache[keysOfCache_];
	});
}
