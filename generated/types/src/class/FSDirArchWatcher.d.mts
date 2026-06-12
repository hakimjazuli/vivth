/**
 * @typedef {import('../typehints/VivthCleanup.mjs').VivthCleanup} VivthCleanup
 */
/**
 * @description
 * - class helper for chokidar abstraction to watch and iterate paths;
 * - this class assume `Paths` and `SafeExit` to be instantiated;
 * @template {any} PASSEDVALUE
 * @implements {VivthCleanup}
 */
export class FSDirArchWatcher<PASSEDVALUE extends unknown> implements VivthCleanup {
    /**
     * @description
     * @param {string[]} watchPaths
     * @param {Object} options
     * @param {FSDirArchWatcher<PASSEDVALUE>["eachHandler"]} options.each
     * - throw to `ignore` OR `delete` path from the result passed to `.full`;
     * @param {FSDirArchWatcher<PASSEDVALUE>["fullHandler"]} options.full
     * @param {number} [options.debounce]
     * - debounce on calling `fullHandler`;
     * @param {import('chokidar').ChokidarOptions} [options.chokidarOptions]
     * - `ChokidarOptions`;
     * @example
     * import { FSDirArchWatcher, IsSameFile } from "vivth/node";
     *
     * const settingFile = '/fsrouter.setting.mjs';
     *
     * new FSDirArchWatcher(['/routers/', '/fsrouter.setting.mjs'], {
     * 	// debounce: 100,
     * 	each: async (eventName, path, stats) => {
     * 		// this callback is queued already;
     * 		// path are already `Paths.normalized`;
     * 		if(IsSameFile(path, settingFile)){
     * 			// code;
     * 		}
     * 		switch (eventName) {
     * 			case 'add':
     * 			case 'change':
     * 				// structure route here and return;
     * 				// a throwed call, will delete from sharedMap;
     * 				return {};
     * 			default:
     * 				// only for imperative handler when needed;
     * 				// or you can just throw here;
     * 				return {};
     * 		}
     * 		// only non throwed call of path is registered to sharedMap;
     * 		// throwed call of path is unregistered from sharedMap;
     * 	},
     * 	full:async (sharedMap) => {
     * 		// this callback is queued already;
     * 		// loop through returned from loop then write to a file;
     * 	},
     * })
     */
    constructor(watchPaths: string[], { chokidarOptions, each: eachHandler, full: fullHandler, debounce }: {
        each: FSDirArchWatcher<PASSEDVALUE>["eachHandler"];
        full: FSDirArchWatcher<PASSEDVALUE>["fullHandler"];
        debounce?: number | undefined;
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
    });
    /**
     * @description
     * - callback to handle each path;
     * @type {(
     *  eventName: import('chokidar/handler.js').EventName,
     *  path: import('chokidar/handler.js').Path,
     *  stats?: import('node:fs').Stats,
     *  ) => Promise<PASSEDVALUE>
     * }
     */
    eachHandler: (eventName: import("chokidar/handler.js").EventName, path: import("chokidar/handler.js").Path, stats?: import("node:fs").Stats) => Promise<PASSEDVALUE>;
    /**
     * @description
     * - callback to handle all registered path;
     * - debounced to only handle last changes on full registry with:
     * >- `options.debounce`;
     * >- `QChannel` `isLastOnQ`;
     * @type {(
     * 		alphabeticallySortedSharedValue: {
     * 			map: Map<string, PASSEDVALUE>,
     * 			array: Array<[path: string, PASSEDVALUE]>,
     * 		}
     * 	) => Promise<void>
     * }
     */
    fullHandler: (alphabeticallySortedSharedValue: {
        map: Map<string, PASSEDVALUE>;
        array: Array<[path: string, PASSEDVALUE]>;
    }) => Promise<void>;
    watcher: import("chokidar").FSWatcher;
    vivthCleanup: () => Promise<void>;
    #private;
}
export type VivthCleanup = import("../typehints/VivthCleanup.mjs").VivthCleanup;
