/**
 * @description
 * - function to compile `.ts`|`.mts`|`.mjs` file, into a single executable;
 * - also generate js representation;
 * - uses [pkg](https://www.npmjs.com/package/pkg), [bun](https://bun.com/docs/bundler/executables), and [deno](https://docs.deno.com/runtime/reference/cli/compile/) compiler under the hood;
 * >- they are used only as packaging agent, and doesn't necessarily supports their advanced feature, such as, assets bundling(use [FSInline](#fsinline) instead);
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
 * - write and read encoding for the sources;
 * - default: `utf-8`;
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
 * import { join } from 'node:path';
 *
 * import { CompileJS, Paths } from 'vivth';
 *
 * const [[resultPkg, errorPkg], [resultBun, errorBun]] = await Promise.all([
 * 	CompileJS({
 * 		entryPoint: join(Paths.root, '/dev'),
 * 		minifyFirst: true,
 * 		outDir: join(Paths.root, '/dev-pkg'),
 * 		compiler: 'pkg',
 * 		compilerArguments: {
 * 			target: ['node18-win-x64'],
 * 		},
 * 		esBundlerPlugins: [],
 * 	}),
 * 	CompileJS({
 * 		entryPoint: join(Paths.root, '/dev'),
 * 		minifyFirst: true,
 * 		outDir: join(Paths.root, '/dev-pkg'),
 * 		compiler: 'bun',
 * 		compilerArguments: {
 * 			target: ['bun-win-x64'],
 * 		},
 * 		esBundlerPlugins: [],
 * 	}),
 * ])
 */
export function CompileJS({ entryPoint, minifyFirst, encoding, outDir, compiler, compilerArguments, esBundlerPlugins, }: {
    entryPoint: string;
    encoding?: BufferEncoding | undefined;
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
