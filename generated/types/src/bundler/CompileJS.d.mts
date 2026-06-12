/**
 * @description
 * - function to compile `.ts`|`.mts`|`.mjs` file, into a single executable;
 * - also generate js representation of the `bundled` version of the target;
 * - uses [bun](https://bun.com/docs/bundler/executables) compiler under the hood;
 * >- it is used only as packaging/compiler agent, and doesn't necessarily supports their advanced feature, such as, assets bundling(use [`FSasar`](#fsasar) instead);
 * >- `WorkerThread` will be converted to inline using `FSasar` too;
 *
 * ---
 * ---
 * ---
 *
 * - This function does not obfuscate and will not prevent decompilation. Do not embed environment variables or sensitive information inside `options.entryPoint`;
 * - It is designed for quick binarization, allowing execution on machines without `Bun` installed;
 * - The resulting binary will contain `FSasar` and `WorkerMainThread` target paths Buffers, which are loaded into memory at runtime. If your logic depends on the file system, use `node:fs` or `node:fs/promises` APIs and ship external files alongside the `binary` and `.asar` file (not compiled);
 *
 * ---
 * ---
 * ---
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
 * @param {boolean} [options.minifyFirst]
 * - minify the bundle before compilation;
 * @param {Object} [options.asar]
 * @param {Parameters<typeof import('@electron/asar')["createPackageFromFiles"]>[3]} [options.asar.InputMetadata]
 * @param {Parameters<typeof import('@electron/asar')["createPackageFromFiles"]>[4]} [options.asar.options]
 * @param {string} options.outDir
 * - need manual prefix;
 * @param {Record<string, string[]|string>} [options.bunCompilerArguments]
 * - `key` are to used as `--keyName`;
 * - value are the `value` of the `key`;
 * >- `string`: will be inputed as is;
 * >- `string[]`: will be joined with `,`;
 * - no need to add the output/outdir, as it use the `options.outDir`;
 * @param {ReturnType<CreateESPlugin>[]} [options.esBundlerPlugins]
 * - plugins for `EsBundler`;
 * @param {Parameters<typeof EsBundler>[1]} [options.esbuildOptions]
 * - options for `EsBundler`;
 * @param {string[]} [options.additionalCommandArgument]
 * - argument to be passed process generator;
 * @return {ReturnType<typeof TryAsync<{compileResult: any,
 * commandCalled: string|undefined;
 * compiledBinFile: string|undefined;
 * bundledJSFile: string|undefined
 * }>>}
 * @example
 * import process from 'node:process';
 * import { join } from 'node:path';
 *
 * import { CompileJS, SafeExit } from 'vivth/node';
 * import { Console, Paths } from 'vivth/neutral';
 *
 * new Paths({
 * 	root: process.env.INIT_CWD ?? process.cwd(),
 * });
 *
 * new SafeExit('SIGINT', 'SIGTERM');
 *
 * const pathRoot = Paths.root;
 *
 * const [,errorbun] = await CompileJS({
 * 	entryPoint: join(pathRoot, '/dev/myEntryPoint.mjs'),
 * 	minifyFirst: true,
 * 	outDir: join(pathRoot, '/dev-bun/'),
 * 	compiler: 'bun',
 * 	compilerArguments: {
 * 		target: 'bun-win-x64',
 * 	},
 * 	asar: {},
 * 	encoding: 'utf-8',
 * });
 *
 * if (errorbun) {
 * 	Console.error({ errorbun });
 * }
 */
export function CompileJS({ entryPoint, minifyFirst, encoding, outDir, asar, preprocessEntryPoint, bunCompilerArguments, esBundlerPlugins, esbuildOptions, additionalCommandArgument, }: {
    entryPoint: string;
    encoding?: BufferEncoding | undefined;
    preprocessEntryPoint?: ((entryPointContent: string) => string) | undefined;
    minifyFirst?: boolean | undefined;
    asar?: {
        InputMetadata?: Parameters<typeof import("@electron/asar")["createPackageFromFiles"]>[3];
        options?: Parameters<typeof import("@electron/asar")["createPackageFromFiles"]>[4];
    } | undefined;
    outDir: string;
    bunCompilerArguments?: Record<string, string | string[]> | undefined;
    esBundlerPlugins?: import("esbuild").Plugin[] | undefined;
    esbuildOptions?: Parameters<typeof EsBundler>[1];
    additionalCommandArgument?: string[] | undefined;
}): ReturnType<typeof TryAsync<{
    compileResult: any;
    commandCalled: string | undefined;
    compiledBinFile: string | undefined;
    bundledJSFile: string | undefined;
}>>;
export type PlatformKey = "win32" | "linux" | "darwin" | string;
export type CreateESPlugin = typeof import("./CreateESPlugin.mjs")["CreateESPlugin"];
import { EsBundler } from './EsBundler.mjs';
import { TryAsync } from '../function/TryAsync.mjs';
