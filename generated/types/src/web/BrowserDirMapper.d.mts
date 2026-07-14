import { JSDirMapper } from '../bundler/JSDirMapper.mjs';
import { FSDirArchWatcher } from '../class/FSDirArchWatcher.mjs';
export type VivthCleanup = import('../typehints/VivthCleanup.mjs').VivthCleanup;
/**
 * @typedef {import('../typehints/VivthCleanup.mjs').VivthCleanup} VivthCleanup
 */
/**
 * @description
 * - class helper to map dynamic mjs files;
 * >- includes `mts` file too;
 * @implements {VivthCleanup}
 */
export declare class BrowserDirMapper implements VivthCleanup {
    #private;
    vivthCleanup: () => Promise<void>;
    /**
     * @description
     * - instantiate the mapper;
     * @param {Object} path
     * @param {string} path.watch
     * @param {string} path.mapTo
     * @param {(normalizedPath:string)=>boolean} [path.eachFilter]
     * @param {ConstructorParameters<typeof JSDirMapper>[1] &
     * 	{
     * 		debounce?:number,
     * 		chokidarOptions?:import('chokidar').ChokidarOptions
     * 	}
     * } options
     * @example
     * import { BrowserDirMapper } from 'vivth/node'
     * import { Paths, SafeExit, BrowserDirMapper } from 'vivth/neutral';
     *
     * new Paths({
     * 	root: process.env.INIT_CWD ?? process.cwd(),
     * });
     *
     * new SafeExit();
     *
     * new BrowserDirMapper(
     * 	{ mapTo: '/dist/', watch: '/src/' },
     * 	{
     * 		esbuild: {
     * 			buildOptions: {
     * 				minify: true,
     * 			},
     * 		},
     * 	},
     * );
     */
    constructor({ watch, mapTo, eachFilter }: {
        watch: string;
        mapTo: string;
        eachFilter?: (normalizedPath: string) => boolean;
    }, options: ConstructorParameters<typeof JSDirMapper>[1] & {
        debounce?: number;
        chokidarOptions?: import('chokidar').ChokidarOptions;
    });
    /**
     * @description
     * - `FSDirArchWatcher` instance;
     * @type {FSDirArchWatcher<any>|undefined}
     */
    dynamicDirWatcher: FSDirArchWatcher<any> | undefined;
    /**
     * @description
     * - `JSDirMapper` instance;
     * @type {JSDirMapper<any>|undefined}
     */
    dirMapper: JSDirMapper<any> | undefined;
}
