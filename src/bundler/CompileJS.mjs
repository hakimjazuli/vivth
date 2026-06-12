// @ts-check

import { spawnSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { join, extname, basename, dirname } from 'node:path';
import { platform } from 'node:os';

import { EsBundler } from './EsBundler.mjs';
import { FileSafe } from '../class/FileSafe.mjs';
import { TryAsync } from '../function/TryAsync.mjs';
import { commonContentFixesBundled } from './adds/ToBundledJSPlugin.mjs';
import { Preferrence } from '../common/Preferrence.mjs';
import { ForInSync } from '../function/ForInSync.mjs';
import { FSAnalyzer } from './FSAnalyzer.mjs';

/**
 * @typedef {'win32' | 'linux' | 'darwin' | string} PlatformKey
 * @typedef {typeof import('./CreateESPlugin.mjs')["CreateESPlugin"]} CreateESPlugin
 */

/**
 * @type {string|undefined}
 */
let binaryExtension;

/**
 * @param {Record<string, string[]|string>} bunCompilerArguments
 * @returns {string[]}
 */
const generateFlagsValue = (bunCompilerArguments = {}) => {
	/**
	 * @type {Array<string>}
	 */
	const options = [];
	ForInSync(bunCompilerArguments, (flag, value) => {
		options.push(`--${flag}`);
		if (!Array.isArray(value)) {
			value = value.trim();
			if (value) {
				options.push(value);
			}
			return;
		}
		options.push(value.filter((val) => !!val).join(','));
	});
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
			case 'darwin':
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
export async function CompileJS({
	entryPoint,
	minifyFirst = true,
	encoding = Preferrence.encoding,
	outDir,
	asar = {},
	preprocessEntryPoint = undefined,
	bunCompilerArguments = undefined,
	esBundlerPlugins = [],
	esbuildOptions = {},
	additionalCommandArgument = [],
}) {
	return await TryAsync(async () => {
		const extOfSource = extname(entryPoint);
		switch (extOfSource) {
			case '.mts':
			case '.ts':
			case '.mjs':
				break;
			default:
				throw `extention mismatch: "${extOfSource}", should be one of:".mjs"|".mts"|".ts"`;
		}
		let sourceText = commonContentFixesBundled(
			entryPoint,
			await readFile(entryPoint, { encoding }),
		);
		if (preprocessEntryPoint) {
			sourceText = preprocessEntryPoint(sourceText);
		}
		const [bundledPrep, errorPrep] = await EsBundler(
			{
				content: sourceText,
				extension: extOfSource,
				root: dirname(entryPoint),
				withBinHeader: !!bunCompilerArguments,
			},
			{
				minify: minifyFirst,
				plugins: esBundlerPlugins,
				...esbuildOptions,
			},
		);
		if (errorPrep) {
			throw errorPrep;
		}
		const outputBaseNameNoExt = join(outDir, basename(entryPoint).replace(extOfSource, ''));
		const bundledJSFile = `${outputBaseNameNoExt}.mjs`;
		const [analyzedBundled, errorAnalyze] = await FSAnalyzer.finalContent(
			entryPoint,
			bundledPrep,
			asar,
			bundledJSFile,
		);
		if (errorAnalyze) {
			throw errorAnalyze;
		}
		await FileSafe.write(bundledJSFile, analyzedBundled, { encoding });
		const compiledBinFile = `${outputBaseNameNoExt}${getBinaryExtension()}`;
		const commandCalled = [
			'build',
			bundledJSFile,
			'--compile',
			...generateFlagsValue(bunCompilerArguments ?? {}),
			'--outfile',
			compiledBinFile,
			...additionalCommandArgument,
		];
		return {
			compileResult: spawnSync('bun', commandCalled),
			commandCalled: `bun ${commandCalled.join(' ')}`,
			compiledBinFile,
			bundledJSFile,
		};
	});
}
