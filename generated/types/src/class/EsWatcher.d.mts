import { QChannel } from './QChannel.mjs';
export type VivthCleanup = import('../typehints/VivthCleanup.mjs').VivthCleanup;
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
export declare class EsWatcher<O extends import('esbuild').BuildOptions> implements VivthCleanup {
    #private;
    static q: QChannel<import("../typehints/AnyButUndefined.mjs").AnyButUndefined> & {
        [x: symbol]: QChannel<import("../typehints/AnyButUndefined.mjs").AnyButUndefined>;
    };
    /**
     * @description
     * @param {Partial<O>} buildOptions
     * @param {import('esbuild').WatchOptions} [watchOptions]
     * @param {number} [delay]
     * @example
     * import { EsWatcher } from 'vivth/node';
     *
     * const { context, remove } = new EsWatcher({
     *  ...esbuildOptions,
     * });
     */
    constructor(buildOptions: Partial<O>, watchOptions?: import('esbuild').WatchOptions, delay?: number);
    /**
     * @type {()=>Promise<void>}
     */
    vivthCleanup: () => Promise<void>;
    /**
     * @description
     * - Promise of `BuildContext`;
     * @type {Promise<import('esbuild').BuildContext<O>>}
     */
    ctx: Promise<import('esbuild').BuildContext<O>>;
    /**
     * @description
     * - rebuild callback;
     */
    rebuild: () => Promise<import("esbuild").BuildResult<O>>;
}
