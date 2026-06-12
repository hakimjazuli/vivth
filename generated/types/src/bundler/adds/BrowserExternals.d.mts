/**
 * @description
 * - esbuild external `Set` for browser platform;
 * - this Set is automatically applied to [FileSelfMapper](#fileselfmapper) and [EsBundler](#esbundler) if platform is equal to browser;
 * - while `vivth` already exports environtment specific(`node`, `browser`, `neutral`) via `vivth/node.JSAutoDoc`, there are possibility of other library might bleeded out when trying to:
 * >- use esbuild;
 * >- earlier version of `vivth`;
 * >- importing from `vivth`, which is definitely bleeded out, and you need to import from proper `exports`;
 * >- importing from `vivth/all`, which is definitely bleeded out, and you need to import from proper `exports`;
 * @type {Set<string>}
 * @example
 * import { BrowserExternals } from 'vivth/node';
 * import { build } from 'esbuild';
 *
 * await build({
 * 	...esbuildOptions,
 * 	platform: 'browser',
 * 	external: Array.from(BrowserExternals),
 * });
 */
export const BrowserExternals: Set<string>;
