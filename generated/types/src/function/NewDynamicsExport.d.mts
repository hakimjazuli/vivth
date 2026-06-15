/**
 * @description
 * generate generator watcher to `Dynamics`;
 * 1) `./dynamics`: directory;
 * 2) `./dynamics/**[blank]/*`(except 3)): watched source for 3);
 * 3) `./dynamics/Dynamics.mjs`: collection of `modules`|`css`|`commonFile`(with `mimeTypes`);
 * - this module assumes [Paths](#paths) to be already instantiated;
 * @param {Object} options
 * @param {string} options.rootPath
 * - relative path to pseudo root;
 * @param {number} [options.debounce]
 * @param {boolean} [options.useFetchForAssets]
 * - default: `true`;
 * >- non js file will be `fetch`ed;
 * - `false`;
 * >- will use `import` instead;
 * >- useful for vite Plugin;
 * @param {import('chokidar').ChokidarOptions} [options.chokidarOptions]
 * @param {(normalizedPath:string)=>boolean} [options.eachFilter]
 * @returns {ReturnType<typeof TryAsync<FSDirArchWatcher<{ handler: string; mime: string | false; lastEditedUnixValue: number; }>>>}
 */
export function NewDynamicsExport({ rootPath, useFetchForAssets, debounce, chokidarOptions, eachFilter }: {
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
}): ReturnType<typeof TryAsync<FSDirArchWatcher<{
    handler: string;
    mime: string | false;
    lastEditedUnixValue: number;
}>>>;
import { TryAsync } from './TryAsync.mjs';
import { FSDirArchWatcher } from '../class/FSDirArchWatcher.mjs';
