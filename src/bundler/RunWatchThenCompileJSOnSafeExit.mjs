// @ts-check

import process from 'node:process';
import { spawn } from 'node:child_process';

import { Paths } from '../class/Paths.mjs';
import { GetRuntime } from '../function/GetRuntime.mjs';
import { TryAsync } from '../function/TryAsync.mjs';
import { CompileJS } from './CompileJS.mjs';
import { Console } from '../class/Console.mjs';
import { SafeExit } from '../class/SafeExit.mjs';

/**
 * @param {import('node:child_process').ChildProcess} proc
 * @param {Parameters<RunWatchThenCompileJSOnSafeExit>[0]["compileJSargs"]} compileJSargs
 * @param {string} entryPoint
 * @param {string} outDir
 * @param {boolean} showLog
 * @returns
 */
const createCleaner = (proc, compileJSargs, entryPoint, outDir, showLog) => {
	const cleaner = async () => {
		SafeExit.instance?.removeCallback(cleaner);
		proc.kill('SIGTERM');
		const [successInfo, errorCompile] = await CompileJS({
			...compileJSargs,
			entryPoint,
			outDir,
		});
		if (errorCompile) {
			Console.error(errorCompile, { now: true });
			return;
		}
		if (showLog) {
			Console.info(successInfo, { now: true });
		}
	};
	return cleaner;
};

/**
 * @param {'bun'|'node'} runtime
 * @param {string[]} command
 * @returns {Promise<import('node:child_process').ChildProcess>}
 */
const handleNodeBun = async (runtime, command) => {
	const proc = spawn(runtime, command, {
		cwd: Paths.root,
		stdio: 'inherit',
		env: process.env,
	});
	return proc;
};

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
export async function RunWatchThenCompileJSOnSafeExit({
	/** */
	source,
	target,
	additionalSpawnArgument = [],
	compileJSargs = {},
	showLog,
}) {
	return await TryAsync(async () => {
		const entryPoint = Paths.diskAbsolute(source);
		const outDir = Paths.diskAbsolute(target);
		const runtime = GetRuntime();
		const command = ['--watch', entryPoint, ...additionalSpawnArgument];
		/**
		 * should be cleanup callback
		 * @type {import('node:child_process').ChildProcess}
		 */
		let proc;
		switch (runtime) {
			case 'bun':
			case 'node':
				{
					proc = await handleNodeBun(runtime, command);
				}
				break;
			default: {
				throw `'vivth/node.RunWatchThenCompileJSOnSafeExit' cannot run in ${runtime}`;
			}
		}
		const cleaner = createCleaner(proc, compileJSargs, entryPoint, outDir, showLog);
		SafeExit.instance?.addCallback(cleaner);
		return { vivthCleanup: cleaner };
	});
}
