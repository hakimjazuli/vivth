/**
 * @description
 * - wrapper for `watcher` via `esbuild.context`;
 * - watcher cleanup is automatically registered to `SafeExit`;
 * @template {import('esbuild').BuildOptions} O
 */
export class EsWatcher<O extends import("esbuild").BuildOptions> {
    /**
     * @description
     * @param {Partial<O>} buildOptions
     * @param {import('esbuild').WatchOptions} [watchOptions]
     * @example
     * import { EsWatcher } from 'vivth';
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
     * @description
     * - manually and safely call `cancel` and `dispose` on `BuildContext`;
     * @type {()=>Promise<void>}
     */
    remove: () => Promise<void>;
    rebuild: () => Promise<import("esbuild").BuildResult<O>>;
    #private;
}
