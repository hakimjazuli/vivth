/**
 * @description
 * - function to compile `.ts`|`.mts`|`.mjs` file, into a single executable;
 * - also generate js representation of the `bundled` version of the target;
 * - uses [pkg](https://www.npmjs.com/package/pkg), [bun](https://bun.com/docs/bundler/executables), and [deno](https://docs.deno.com/runtime/reference/cli/compile/) compiler under the hood;
 * >- they are used only as packaging/compiler agent, and doesn't necessarily supports their advanced feature, such as, assets bundling(use [`FSInline`](#fsinline) instead);
 * >- `WorkerThread` will be converted to inline using `FSInline` too;
 *
 * !!!WARNING!!!
 * !!!WARNING!!!
 * !!!WARNING!!!
 *
 * - This function does not obfuscate and will not prevent decompilation. Do not embed environment variables or sensitive information inside `options.entryPoint`;
 * - It is designed for quick binarization, allowing execution on machines without `Node.js`, `Bun`, or `Deno` installed;
 * - The resulting binary will contain `FSInline` and `WorkerMainThread` target paths Buffers, which are loaded into memory at runtime. If your logic depends on the file system, use `node:fs` or `node:fs/promises` APIs and ship external files alongside the binary (not compiled);
 *
 * !!!WARNING!!!
 * !!!WARNING!!!
 * !!!WARNING!!!
 *
 * @param {Object} options
 * @param {string} options.entryPoint
 * - need to be manually prefixed;
 * @param {BufferEncoding} [options.encoding]
 * - read and write encoding for the sources;
 * - default: `utf-8`;
 * @param {(entryPointContent:string)=>string} [options.preprocessEntryPoint]
 * - to modify entry point before bundling;
 * - `entryPointContent` is the original string of the entry point;
 * - returned value then passed to `ESBundler`;
 * @param {boolean} options.minifyFirst
 * - minify the bundle before compilation;
 * @param {string} options.outDir
 * - need manual prefix;
 * @param {'pkg'|'bun'|'deno'} [options.compiler]
 * - default: no comilation, just bundling;
 * - `bun` and `pkg` is checked, if there's bug on `deno`, please report on github for issues;
 * @param {Record<string, string>} [options.compilerArguments]
 * - `key` are to used as `--keyName`;
 * - value are the following value of the key;
 * - no need to add the output/outdir, as it use the `options.outDir`;
 * @param {ReturnType<CreateESPlugin>[]} [options.esBundlerPlugins]
 * - plugins for `EsBundler`;
 * @return {ReturnType<typeof TryAsync<{compileResult:Promise<any>|undefined,
 * commandCalled: string|undefined;
 * compiledBinFile: string|undefined;
 * bundledJSFile:string|undefined
 * }>>}
 * @example
 * import process from 'node:process';
 * import { join } from 'node:path';
 *
 * import { CompileJS, Console, Paths, Setup } from 'vivth';
 *
 * const { paths, safeExit } = Setup;
 * new paths({
 * 	root: process.env.INIT_CWD ?? process.cwd(),
 * });
 * new safeExit({
 * 	eventNames: ['SIGINT', 'SIGTERM'],
 * 	terminator: () => process.exit(0),
 * 	listener: (eventName) => {
 * 		process.once(eventName, function () {
 * 			if (!safeExit.instance) {
 * 				return;
 * 			}
 * 			safeExit.instance.exiting.correction(true);
 * 			Console.log(`safe exit via "${eventName}"`);
 * 		});
 * 	},
 * });
 * const pathRoot = Paths.root;
 * if (pathRoot) {
 * 	const [[, error], [, errorbun]] = await Promise.all([
 * 		CompileJS({
 * 			entryPoint: join(pathRoot, '/dev/myEntryPoint.mjs'),
 * 			minifyFirst: true,
 * 			outDir: join(pathRoot, '/dev-pkg/'),
 * 			compiler: 'pkg',
 * 			compilerArguments: {
 * 				target: 'node18-win-x64',
 * 			},
 * 			encoding: 'utf-8',
 * 		}),
 * 		await CompileJS({
 * 			entryPoint: join(pathRoot, '/dev/myEntryPoint.mjs'),
 * 			minifyFirst: true,
 * 			outDir: join(pathRoot, '/dev-bun/'),
 * 			compiler: 'bun',
 * 			compilerArguments: {
 * 				target: 'bun-win-x64',
 * 			},
 * 			encoding: 'utf-8',
 * 		}),
 * 	]);
 * 	if (error || errorbun) {
 * 		Console.error({ error, errorbun });
 * 	}
 * }
 *
 */
export function CompileJS({ entryPoint, minifyFirst, encoding, outDir, preprocessEntryPoint, compiler, compilerArguments, esBundlerPlugins, }: {
    entryPoint: string;
    encoding?: BufferEncoding | undefined;
    preprocessEntryPoint?: ((entryPointContent: string) => string) | undefined;
    minifyFirst: boolean;
    outDir: string;
    compiler?: "pkg" | "bun" | "deno" | undefined;
    compilerArguments?: Record<string, string> | undefined;
    esBundlerPlugins?: import("esbuild").Plugin[] | undefined;
}): ReturnType<typeof TryAsync<{
    compileResult: Promise<any> | undefined;
    commandCalled: string | undefined;
    compiledBinFile: string | undefined;
    bundledJSFile: string | undefined;
}>>;
export type PlatformKey = "win32" | "linux" | "darwin" | string;
export type CreateESPlugin = typeof import("./CreateESPlugin.mjs")["CreateESPlugin"];
import { TryAsync } from '../function/TryAsync.mjs';
