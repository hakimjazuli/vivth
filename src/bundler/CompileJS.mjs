// @ts-check

import { readFile } from 'node:fs/promises';
import { join, extname, basename, dirname } from 'node:path';
import { platform } from 'node:os';

import { exec } from 'pkg';

import { EsBundler } from './EsBundler.mjs';
import { FileSafe } from '../class/FileSafe.mjs';
import { TryAsync } from '../function/TryAsync.mjs';
import { FSInlineAnalyzer } from './FSInlineAnalyzer.mjs';
import { removeVivthDevCodeBlock } from './adds/ToBundledJSPlugin.mjs';

/**
 * @typedef {'win32' | 'linux' | 'darwin' | string} PlatformKey
 * @typedef {import('./CreateESPlugin.mjs')["CreateESPlugin"]} CreateESPlugin
 */

/**
 * @type {string|undefined}
 */
let binaryExtension;

/**
 * @param {Record<string, string[]|string>} compilerOptions
 * @returns {string[]}
 */
const generateFlagsValue = (compilerOptions) => {
	const options = [];
	for (const flag in compilerOptions) {
		const value = compilerOptions[flag];
		options.push(`--${flag}`);
		if (Array.isArray(value) === false) {
			if (value) {
				options.push(value);
			}
			continue;
		}
		options.push(value.filter((val) => !!val).join(','));
	}
	return options;
};
/**
 * Maps Node.js platform to binary file extension.
 *
 * @returns {string} extension including dot (e.g. '.exe', '')
 */
const getBinaryExtension = () => {
	if (binaryExtension === undefined) {
		switch (platform()) {
			case 'win32':
				binaryExtension = '.exe';
				break;
			case 'linux':
				binaryExtension = ''; // Linux binaries typically have no extension
				break;
			case 'darwin':
				binaryExtension = ''; // macOS binaries typically have no extension
				break;
			default:
				binaryExtension = ''; // fallback for unknown platforms
				break;
		}
	}
	return binaryExtension;
};
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
 * import { join } from 'node:path';
 * import { CompileJS, Console, Paths, Setup } from 'vivth';
 *
 * const { paths, safeExit } = Setup;
 * new paths({
 * 	root: process?.env?.INIT_CWD ?? process?.cwd(),
 * });
 * new safeExit({
 * 	eventNames: ['SIGINT', 'SIGTERM'],
 * 	terminator: () => process.exit(0), // OR on deno () => Deno.exit\* (0),
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
export async function CompileJS({
	entryPoint,
	minifyFirst,
	encoding = 'utf-8',
	outDir,
	preprocessEntryPoint = undefined,
	compiler = undefined,
	compilerArguments = {},
	esBundlerPlugins = [],
}) {
	return await TryAsync(async () => {
		/**
		 * @type {'cjs'|'esm'}
		 */
		let format;
		switch (compiler) {
			case 'pkg':
				format = 'cjs';
				break;
			case 'bun':
			case 'deno':
				format = 'esm';
				break;
			default:
				minifyFirst = true;
				format = 'esm';
				break;
		}
		const extOfSource = extname(entryPoint);
		switch (extOfSource) {
			case '.mts':
			case '.ts':
			case '.mjs':
				break;
			default:
				throw new Error(
					`extention mismatch: "${extOfSource}", should be one of:".mjs"|".mts"|".ts"`
				);
		}
		let sourceText = removeVivthDevCodeBlock(await readFile(entryPoint, { encoding }));
		if (preprocessEntryPoint) {
			sourceText = preprocessEntryPoint(sourceText);
		}
		const [bundledPrep, errorPrep] = await EsBundler(
			{
				content: sourceText,
				extension: extOfSource,
				root: dirname(entryPoint),
				withBinHeader: compiler ? true : false,
			},
			{
				minify: minifyFirst,
				format,
				plugins: esBundlerPlugins,
			}
		);
		if (errorPrep) {
			throw errorPrep;
		}
		const [analyzedBundled, errorAnalyze] = await FSInlineAnalyzer.finalContent(
			bundledPrep,
			format
		);
		if (errorAnalyze) {
			throw errorAnalyze;
		}
		const outputBaseNameNoExt = join(outDir, basename(entryPoint).replace(extOfSource, ''));
		const bundledJSFile = `${outputBaseNameNoExt}${format === 'cjs' ? '.cjs' : '.mjs'}`;
		await FileSafe.write(bundledJSFile, analyzedBundled, { encoding });
		const compiledBinFile = `${outputBaseNameNoExt}${getBinaryExtension()}`;
		switch (compiler) {
			case 'pkg': {
				const commandCalled = [
					bundledJSFile,
					...generateFlagsValue(compilerArguments),
					'--output',
					compiledBinFile,
				];
				return {
					compileResult: await exec(commandCalled),
					commandCalled: `pkg ${commandCalled.join(' ')}`,
					compiledBinFile,
					bundledJSFile,
				};
			}
			case 'bun': {
				const commandCalled = [
					'build',
					bundledJSFile,
					'--compile',
					...generateFlagsValue(compilerArguments),
					'--outfile',
					compiledBinFile,
				];
				return {
					compileResult: await Bun.spawn(['bun', ...commandCalled]),
					commandCalled: `bun ${commandCalled.join(' ')}`,
					compiledBinFile,
					bundledJSFile,
				};
			}
			case 'deno': {
				const commandCalled = [
					'compile',
					...generateFlagsValue(compilerArguments),
					'--output',
					compiledBinFile,
					bundledJSFile,
					'--verbose',
				];
				// @ts-expect-error
				const command = new Deno.Command('deno', {
					args: commandCalled,
					stdout: 'piped',
					stderr: 'piped',
				});
				return {
					compileResult: await command.output(),
					commandCalled: `deno ${commandCalled.join(' ')}`,
					compiledBinFile,
					bundledJSFile,
				};
			}
			default: {
				return {
					compileResult: undefined,
					commandCalled: undefined,
					compiledBinFile: undefined,
					bundledJSFile,
				};
			}
		}
	});
}
