import { TryAsync } from '../function/TryAsync.mjs';
/**
 * @description
 * - function to:
 * >- spawn watcher on `source`;
 * >- run the `source`;
 * >- compile `source` to target on `SafeExit`;
 * - this function assume `Paths` and `SafeExit` to be instantiated;
 * @param {Object} options
 * @param {boolean} options.showLog
 * @param {string} options.source
 * - filepath for source;
 * - `relative`(to `Paths.root`) OR `absolute`, both are accepted;
 * @param {string} options.target
 * - dirpath for compile target;
 * - `relative`(to `Paths.root`) OR `absolute`, both are accepted;
 * @param {string[]} [options.additionalSpawnArgument]
 * @param {Omit<
 * 	Parameters<typeof import('./CompileJS.mjs').CompileJS>[0],
 * 	"entryPoint"|
 * 	"outDir"
 * >} [options.compileJSargs]
 * @returns {ReturnType<typeof TryAsync<import('../typehints/VivthCleanup.mjs').VivthCleanup>>}
 * @example
 * import { RunWatchThenCompileJSOnSafeExit } from "vivth/node";
 *
 * // assume `Paths` and `SafeExit` to be instantiated;
 * await RunWatchThenCompileJSOnSafeExit({
 * 	showLog: false,
 * 	source: '/test/watchrun/hi.mjs',
 * 	target: '/test/watchrun/compile-bun/',
 * 	compileJSargs: {
 * 		minifyFirst: false,
 * 		esbuildOptions: {},
 * 		compilerArguments: {
 * 			target: 'bun-win-x64',
 * 		},
 * 		asar: {},
 * 		encoding: 'utf-8',
 * 	},
 * })
 */
export declare function RunWatchThenCompileJSOnSafeExit({ 
/** */
source, target, additionalSpawnArgument, compileJSargs, showLog, }: {
    showLog: boolean;
    source: string;
    target: string;
    additionalSpawnArgument?: string[];
    compileJSargs?: Omit<Parameters<typeof import('./CompileJS.mjs').CompileJS>[0], "entryPoint" | "outDir">;
}): ReturnType<typeof TryAsync<import('../typehints/VivthCleanup.mjs').VivthCleanup>>;
