// @ts-check

import process from 'node:process';
import { join } from 'node:path';
/**
 * - on working library you should import from `vivth/${platformName}`
 * - `/dev/auto-doc.mjs` imports directly to the file, because `vivth` modify it's own exports and might throw error when some of the file `modified`/`deleted`;
 */
// import {
//
// 	SafeExit,
// 	JSautoDOC,
// 	FileSelfMapper,
// 	GetModuleEsbuildPlatform,
// CompileJS,
// RunWatchThenCompileJSOnSafeExit,
// } from 'vivth/node';
// import {
//
// 	Paths,
// 	Console,
// 	ForOfSync,
// 	TryAsync,
// 	TracePath,
// } from 'vivth/neutral';

import { SafeExit } from '../src/class/SafeExit.mjs';
import { JSautoDOC } from '../src/doc/JSautoDOC.mjs';
import { FileSelfMapper } from '../src/bundler/FileSelfMapper.mjs';
import { Paths } from '../src/class/Paths.mjs';
import { Console } from '../src/class/Console.mjs';
import stripJsonComments from 'strip-json-comments';
// import { RunWatchThenCompileJSOnSafeExit } from '../src/bundler/RunWatchThenCompileJSOnSafeExit.mjs';
// import { TryAsync } from '../src/function/TryAsync.mjs';
// import { GetModuleEsbuildPlatform } from '../src/function/GetModuleEsbuildPlatform.mjs';
// import { ForOfSync } from '../src/function/ForOfSync.mjs';
// import { Console } from '../src/class/Console.mjs';
// import { LazyFactory } from '../src/function/LazyFactory.mjs';
// import { FactoryKey } from '../src/common/FactoryKey.mjs';
// import { GetModuleEsbuildPlatform } from '../src/function/GetModuleEsbuildPlatform.mjs';

new Paths({
	root: process.env?.INIT_CWD ?? process.cwd(),
});

new SafeExit(
	/**  */
	'SIGINT',
	'SIGTERM',
);

// const a = LazyFactory(() => {
// 	Console.log('preparation, should only run once');
// 	/**
// 	 * @param {string} m
// 	 */
// 	return (m) => {
// 		Console.log(m);
// 	};
// });
// a('hello world');

new JSautoDOC({
	src: 'src',
	copyright: 'this library is made and distributed under MIT license;',
	tableOfContentTitle: 'list of exported API and typehelpers',
	assemblyScriptOptions: {
		ASArgv: [],
		generateFSasarImporter: true,
	},
	maxDebounceForGeneratingDocAndExport: 1_000,
});

new FileSelfMapper('/dev/auto/', {
	deleteTempFilesAfterExit: false,
});

// await RunWatchThenCompileJSOnSafeExit({
// 	showLog: true,
// 	source: '/test/watchrun/hi.mjs',
// 	target: '/test/watchrun/compile-bun/',
// 	compileJSargs: {
// 		minifyFirst: true,
// 		esbuildOptions: {},
// 		compilerArguments: {
// 			target: 'bun-win-x64',
// 		},
// 		encoding: 'utf-8',
// 	},
// });

// SafeExit.instance?.addCallback(async () => {
// 	await Promise.all(
// 		ForOfSync(
// 			[
// 				'/src/bundler/FSasar.mjs',
// 				'/src/function/TryAsync.mjs',
// 				'/src/bundler/CompileAS.mjs',
// 				'/src/class/Effect.mjs',
// 				'/src/class/EventSignal.mjs',
// 				'/src/class/ListSignal.mjs',
// 				'/src/class/ObjectSignal.mjs',
// 				'/src/class/LitExp.mjs',
// 				'/src/common/Base64URL.mjs',
// 				'/check/something/this/must/be/not/supported',
// 			],
// 			async (path) => {
// 				Console.log({ path, platform: await GetModuleEsbuildPlatform(join(Paths.root, path)) });
// 			},
// 		)[0],
// 	);
// });

// await TryAsync(async () => {
// 	const result = await Promise.all(
// 		ForOfSync(
// 			[
// 				'/src/bundler/FSasar.mjs',
// 				'/src/function/TryAsync.mjs',
// 				'/src/bundler/CompileAS.mjs',
// 				'/src/class/Effect.mjs',
// 				'/src/class/EventSignal.mjs',
// 				'/src/class/ListSignal.mjs',
// 				'/src/class/ObjectSignal.mjs',
// 				'/src/class/LitExp.mjs',
// 				'/src/common/Base64URL.mjs',
// 				'/check/something/this/must/be/not/supported',
// 			],
// 			async (path) => {
// 				return { path, platform: await GetModuleEsbuildPlatform(join(Paths.root, path)) };
// 			},
// 		)[0],
// 	);
// 	Console.log(result);
// });

// await SafeExit.overrideLongRunningProccess.toBeAwaitedTopLevel;
