// @ts-check

import { builtinModules } from 'node:module';
import { ForOfSync } from '../../function/ForOfSync.mjs';

/**
 * @type {Set<string>}
 */
const list = new Set();

/**
 * @description
 * - generate Set of `node` built in modules;
 * @returns {Set<string>}
 * @example
 * import { build } from "esbuild";
 * import { NodeModuleList } from "vivth/node";
 *
 * await build({
 * 	...buildOptions,
 * 	platform: "browser",
 * 	external: Array.from(NodeModuleList()),
 * });
 */
export function NodeModuleList() {
	if (!list.size) {
		ForOfSync(builtinModules, (module) => {
			list.add(module);
			list.add(`node:${module}`);
		});
	}
	return list;
}
