/**
 * @description
 * - `vite.rollup/down` plugin abstraction for [NewDynamicsExport](#newdynamicsexport);
 * @param {Parameters<typeof NewDynamicsExport>} args
 * @returns {import('vite').PluginOption}
 */
export function ViteAddDynamics(args_0: {
    rootPath: string;
    debounce?: number | undefined;
    useFetchForAssets?: boolean | undefined;
    chokidarOptions?: Partial<{
        persistent: boolean;
        ignoreInitial: boolean;
        followSymlinks: boolean;
        cwd?: string;
        usePolling: boolean;
        interval: number;
        binaryInterval: number;
        alwaysStat?: boolean;
        depth?: number;
        ignorePermissionErrors: boolean;
        atomic: boolean | number;
    } & {
        ignored: import("chokidar").Matcher | import("chokidar").Matcher[];
        awaitWriteFinish: boolean | Partial<import("chokidar").AWF>;
    }> | undefined;
    eachFilter?: ((normalizedPath: string) => boolean) | undefined;
}): import("vite").PluginOption;
