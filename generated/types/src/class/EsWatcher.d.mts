/**
 * @typedef {import('../typehints/VivthCleanup.mjs').VivthCleanup} VivthCleanup
 */
/**
 * @description
 * - wrapper for `watcher` via `esbuild.context`;
 * - watcher cleanup is automatically registered to `SafeExit`;
 * @template {import('esbuild').BuildOptions} O
 * @implements {VivthCleanup}
 */
export class EsWatcher<O extends import("esbuild").BuildOptions> implements VivthCleanup {
    /**
     * @description
     * @param {Partial<O>} buildOptions
     * @param {import('esbuild').WatchOptions} [watchOptions]
     * @example
     * import { EsWatcher } from 'vivth/node';
     *
     * const { context, remove } = new EsWatcher({
     *  ...esbuildOptions,
     * });
     */
    constructor(buildOptions: Partial<O>, watchOptions?: import("esbuild").WatchOptions);
    /**
     * @description
     * - Promise of `BuildContext`;
     * @type {Promise<import('esbuild').BuildContext<O>>}
     */
    ctx: Promise<import("esbuild").BuildContext<O>>;
    /**
     * @type {()=>Promise<void>}
     */
    vivthCleanup: () => Promise<void>;
    rebuild: () => Promise<import("esbuild").BuildResult<O>>;
}
export type VivthCleanup = import("../typehints/VivthCleanup.mjs").VivthCleanup;
