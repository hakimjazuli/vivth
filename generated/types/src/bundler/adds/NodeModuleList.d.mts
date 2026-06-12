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
export function NodeModuleList(): Set<string>;
