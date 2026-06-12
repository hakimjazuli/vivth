// @ts-check

import { basename, extname, join, relative } from 'node:path';
import { readFile } from 'node:fs/promises';

import { FSWatcher, watch } from 'chokidar';

import { EsWatcher } from '../class/EsWatcher.mjs';
import { Paths } from '../class/Paths.mjs';
import { QChannel } from '../class/QChannel.mjs';
import { SafeExit } from '../class/SafeExit.mjs';
import { Console } from '../class/Console.mjs';
import { TryNew } from '../function/TryNew.mjs';
import { pluginVivthBundle } from './adds/pluginVivthBundle.mjs';
import { BrowserExternals } from './adds/BrowserExternals.mjs';
import { ForOfSync } from '../function/ForOfSync.mjs';
import { FileSafe } from '../class/FileSafe.mjs';
import { TsToMjs } from '../function/TsToMjs.mjs';
import { LazyFactory } from '../function/LazyFactory.mjs';
import { compileAsync } from 'sass';
import { Preferrence } from '../common/Preferrence.mjs';
import { TryAsync } from '../function/TryAsync.mjs';
import { autoExternalize } from './adds/autoExternalize.mjs';

/**
 * @typedef {import('../typehints/VivthCleanup.mjs').VivthCleanup} VivthCleanup
 */

/**
 * @import {Stats} from 'node:fs'
 * @import {EventName} from 'chokidar/handler.js'
 * @import {Plugin,BuildOptions} from 'esbuild'
 */

/**
 * @description
 * - class helper for one to one Mapping JS files;
 * - only bundles `.mts` AND `.mjs` in the `path.watch` directory, extension restriction to module as to enforce:
 * >- `esm` style input;
 * >- to not confuse IDE and esbuild resolver of extensionless static import;
 * @template {BuildOptions} OPT
 * @implements {VivthCleanup}
 */
export class JSDirMapper {
	/**
	 * @type {QChannel<string>}
	 */
	#q = LazyFactory(() => new QChannel('JSDirMapper'));
	/**
	 * @param {string} path
	 * @returns {string}
	 */
	static #correctEndpointExt = (path) => {
		if (!path.endsWith('.mjs')) {
			path = `${path}.mjs`;
		}
		return Paths.normalize(path);
	};

	/**
	 * @description
	 * @param {Object} path
	 * - `relative`(to `Paths.root`) OR `absolute`, both are accepted;
	 * - handles:
	 * >- `.mts`,`.mjs`: bundled;
	 * >- `.css`: minified;
	 * >-`.scss`, `sass`: two step bundling;
	 * >>- bundle to `.s.css` at source path;
	 * >>- write to `.s.css` on target path;
	 * >- `.as.ts` and it's companion `js` will be dealt accordingly based on `options.asTsToMjsHandler`;
	 * >>- `.ts` and `.js` that are not `.wasm` related are ignored;
	 * >- everything else will be copied as is;
	 * @param {string} path.watch
	 * - watch this path for changes;
	 * @param {string} path.mapTo
	 * - bundles to this path
	 * @param {(
	 * 		arg0:
	 * 			{
	 * 				source:string;
	 * 				target:string;
	 * 				eventName:EventName;
	 * 			}
	 * 	)=>Promise<{
	 * 		shouldProcessDefault:
	 * 			boolean|{selfCleanup:()=>Promise<void>};
	 * 	}>
	 * } [path.filter]
	 * - handler trap before sending it to
	 * @param {Object} options
	 * @param {Object} options.esbuild
	 * @param {Omit<ConstructorParameters<typeof EsWatcher<OPT>>[0],
	 * 	"entryPoints"|
	 * 	"outFile"|
	 * 	"write"|
	 * 	"format"|
	 * 	"bundle"|
	 * 	"logLevel"|
	 * 	"mainFields"
	 * >} options.esbuild.buildOptions
	 * - `logLimit`: default = `3`;
	 * - `entryPoints`: auto filled with `path.watch` + filepath;
	 * - `outFile`: auto filled with `path.mapTo` + filepath(suffixed with `.mjs`);
	 * - `write`: auto filled by `vivth.JSDirMapper`;
	 * - `mainFields`: auto filled by `vivth.JSDirMapper`, ['module', 'main'];
	 * - `format`: auto filled by `vivth.JSDirMapper`, always `esm`;
	 * - `bundle`: auto filled by `vivth.JSDirMapper`, always `true`;
	 * - `logLevel`: auto filled by `vivth.JSDirMapper`;
	 * @param {ConstructorParameters<typeof EsWatcher<OPT>>[1]} [options.esbuild.watchOption]
	 * @param {Parameters<typeof TsToMjs>[1]} [options.asTsToMjsHandler]
	 * - argument[1] used for `.as.ts` extention(assemblyscript to `.wasm` + `.mjs` loader):
	 * >- handled via `vivth.TsToMjs`;
	 * >- preferably to be isolated on a single folder;
	 * - when falsy -> ignore `.as.ts`;
	 * @example
	 * import process from 'node:process';
	 *
	 * import { SafeExit, Paths, JSDirMapper } from 'vivth/node';
	 *
	 * new Paths({
	 * 	root: process.env.INIT_CWD ?? process.cwd(),
	 * });
	 *
	 * new SafeExit('SIGINT', 'SIGTERM');
	 *
	 * new JSDirMapper(
	 * 	{
	 * 		mapTo: '/test/jsdirmapped/',
	 * 		watch: '/test/jsdirmapper/',
	 * 	},
	 * 	{
	 * 		esbuild: { buildOptions: { platform: 'browser' } },
	 * 		asTsToMjsHandler: { assemblyScriptOptions: {} },
	 * 	},
	 * );
	 *
	 */
	constructor({ mapTo, watch, filter }, { esbuild, asTsToMjsHandler }) {
		this.#watchPath = Paths.diskAbsolute(watch);
		this.#mapToPath = Paths.diskAbsolute(mapTo);
		this.#esbuildOptions = esbuild;
		this.#asTsToMjsHandler = asTsToMjsHandler;
		this.#filter = filter;
		this.#start();
	}
	/**
	 * @type {undefined|((
	 * 		arg0:
	 * 			{
	 * 				source:string;
	 * 				target:string;
	 * 				eventName:EventName;
	 * 			}
	 * 	)=>Promise<{
	 * 		shouldProcessDefault:
	 * 			boolean|{selfCleanup:()=>Promise<void>};
	 * 	}>)
	 * }
	 */
	#filter;
	/**
	 * @type { string }
	 */
	#watchPath;
	/**
	 * @type { string }
	 */
	#mapToPath;
	/**
	 * @type {ConstructorParameters<typeof JSDirMapper<OPT>>[1]["esbuild"]}
	 */
	#esbuildOptions;
	/**
	 * @type {ConstructorParameters<typeof JSDirMapper<OPT>>[1]["asTsToMjsHandler"]}
	 */
	#asTsToMjsHandler;
	/**
	 * @type {FSWatcher|undefined}
	 */
	#watcher;

	/**
	 * @type { Map<string, ()=>Promise<void>> }
	 */
	#mappedPathCleanupCallbacks = new Map();

	/**
	 * @type {Map<string, ()=>Promise<any>>}
	 */
	#esbuildPathRebuild = new Map();

	/**
	 * @type {Map<string, Set<string>>}
	 * - key: dependecies;
	 * - value: importer;
	 */
	#depMap = new Map();

	#start = () => {
		this.#watcher = watch(this.#watchPath);
		this.#watcher.addListener('all', this.#allListener);
		SafeExit.instance?.addCallback(this.vivthCleanup);
	};

	vivthCleanup = async () => {
		SafeExit.instance?.removeCallback(this.vivthCleanup);
		this.#watcher?.removeAllListeners();
		await Promise.all([
			this.#watcher?.close(),
			...ForOfSync(this.#mappedPathCleanupCallbacks, async ([, cb]) => {
				await cb();
			})[0],
		]);
	};

	/**
	 * @param {string} extension
	 * @param {()=>boolean} isLastOnQ
	 * @param {EventName} eventName
	 * @param {string} path
	 * @param {string} targetPath
	 * @param {Stats} [stats]
	 * @returns {Promise<false|'js'|'css'|'as.ts'|'common'>}
	 */
	#allListenerChecks = async (extension, isLastOnQ, eventName, path, targetPath, stats) => {
		if (!isLastOnQ()) {
			return false;
		}
		switch (eventName) {
			case 'add':
			case 'change':
				break;
			case 'unlink':
			case 'error':
				await Promise.all([
					this.#mappedPathCleanupCallbacks.get(path)?.(),
					FileSafe.rm(targetPath),
				]);
				return false;
			default:
				return false;
		}
		const pathBaseName = basename(path);
		if (
			!stats ||
			!stats.isFile() ||
			this.#mappedPathCleanupCallbacks.has(path) ||
			pathBaseName.endsWith(`.d${extension}`)
		) {
			return false;
		}
		switch (extension) {
			case '.scss':
			case '.sass':
				await this.#allListenerQCSS(path, path.replace(/\.\w+$/, '.s.css'));
				return false;
			case '.css':
				return 'css';
			case '.mjs':
			case '.mts':
				return 'js';
			case '.js':
			case '.ts':
				if (path.endsWith('.as.ts') || path.endsWith('.js')) {
					return 'as.ts';
				}
				return false;
			default:
				return 'common';
		}
	};

	/**
	 * @param {string} path
	 * @param {()=>boolean} isLastOnQ
	 * @param {EventName} eventName
	 * @param {Stats} [stats]
	 * @returns
	 */
	#allListenerQ = async (path, isLastOnQ, eventName, stats) => {
		const extension = extname(path);
		const targetPath = Paths.normalize(join(this.#mapToPath, relative(this.#watchPath, path)));
		if (this.#filter) {
			const { shouldProcessDefault } = await this.#filter({
				source: path,
				target: targetPath,
				eventName,
			});
			if (typeof shouldProcessDefault === 'boolean') {
				if (!shouldProcessDefault) {
					return;
				}
			} else {
				const { selfCleanup } = shouldProcessDefault;
				this.#mappedPathCleanupCallbacks.set(path, selfCleanup);
				return;
			}
		}
		const handler = await this.#allListenerChecks(
			extension,
			isLastOnQ,
			eventName,
			path,
			targetPath,
			stats,
		);
		if (!handler) {
			return;
		}
		switch (handler) {
			case 'js':
				{
					await this.#allListenerQJS(path, targetPath);
				}
				break;
			case 'as.ts':
				{
					await TsToMjs(path, this.#asTsToMjsHandler);
				}
				break;
			case 'css':
				{
					await this.#allListenerQCSS(path, targetPath);
				}
				break;
			case 'common':
				{
					await this.#allListenerQCommon(path, targetPath);
				}
				break;
		}
	};
	/**
	 * @param {string} path
	 * @param {string} targetPath
	 * @returns {Promise<void>}
	 */
	#allListenerQJS = async (path, targetPath) => {
		const buildOptions = this.#esbuildOptions.buildOptions;
		if (buildOptions.platform === 'browser') {
			buildOptions.external = Array.from(
				BrowserExternals.union(new Set(buildOptions.external ?? [])),
			);
		}
		const correctedTargetPath = JSDirMapper.#correctEndpointExt(targetPath);
		const [eswatcherInstance, errorInstantiatingWatcher] = TryNew(
			EsWatcher,
			{
				logLimit: 3,
				...buildOptions,
				entryPoints: [path],
				outfile: correctedTargetPath,
				write: true,
				format: 'esm',
				bundle: true,
				mainFields: ['module', 'main'],
				loader: {
					'.mjs': 'js',
					'.js': 'js',
					'.mts': 'ts',
					'.ts': 'ts',
					...buildOptions.loader,
				},
				logLevel: 'silent',
				plugins: [
					this.#autoExternalize(path, correctedTargetPath),
					...(buildOptions?.plugins ?? []),
					pluginVivthBundle,
				],
			},
			this.#esbuildOptions.watchOption,
		);
		if (errorInstantiatingWatcher) {
			Console.error(
				{ errorInstantiatingWatcher },
				{
					now: true,
				},
			);
			return;
		}
		this.#esbuildPathRebuild.set(path, eswatcherInstance.rebuild);
		this.#mappedPathCleanupCallbacks.set(path, async () => {
			this.#esbuildPathRebuild.delete(path);
			this.#depMap.delete(path);
			await eswatcherInstance.vivthCleanup();
		});
	};

	/**
	 * @param {string} path
	 * @param {string} targetPath
	 * @returns {Promise<void>}
	 */
	#allListenerQCSSPrebundled = async (path, targetPath) => {
		const encoding = Preferrence.encoding;
		const [content, errorReadingPrebundledSCSS] = await TryAsync(async () => {
			return await readFile(path, { encoding });
		});
		if (errorReadingPrebundledSCSS) {
			Console.error(
				{
					JSDirMapper: `❌ Error to Copy prebundled .s.css '${path}'`,
					errorReadingPrebundledSCSS,
				},
				{ now: true },
			);
			return;
		}
		const [, errorCopyResultSCSS] = await FileSafe.write(targetPath, content, { encoding });
		if (errorCopyResultSCSS) {
			Console.error(
				{
					JSDirMapper: `❌ Error to Copy prebundled .s.css '${path}'`,
					errorCopyResultSCSS,
				},
				{ now: true },
			);
			return;
		}
		Console.info(
			{
				JSDirMapper: `✅ Copied prebundled .s.css '${path}' 👉 '${targetPath}'`,
			},
			{
				now: true,
			},
		);
	};
	/**
	 * @param {string} path
	 * @param {string} targetPath
	 * @returns {Promise<void>}
	 */
	#allListenerQCSS = async (path, targetPath) => {
		if (path.endsWith('.s.css')) {
			this.#allListenerQCSSPrebundled(path, targetPath);
			return;
		}
		const result = await compileAsync(path, { style: 'compressed' });
		const css = result.css;
		const [, errorWritingCSS] = await FileSafe.write(targetPath, css, {
			encoding: Preferrence.encoding,
		});
		if (errorWritingCSS) {
			Console.error(
				{
					JSDirMapper: `❌ Error to Generate '${path}'`,
					errorWritingCSS,
				},
				{
					now: true,
				},
			);
			return;
		}
		Console.info(
			{
				JSDirMapper: `✅ Generate '${path}' 👉 '${targetPath}'`,
			},
			{
				now: true,
			},
		);
	};
	/**
	 * @param {string} path
	 * @param {string} targetPath
	 * @returns {Promise<void>}
	 */
	#allListenerQCommon = async (path, targetPath) => {
		const [, errorCopyCommonFile] = await FileSafe.copy(path, targetPath);
		if (errorCopyCommonFile) {
			Console.error(
				{
					JSDirMapper: `❌ Error to copy '${path}'`,
					errorCopyCommonFile,
				},
				{
					now: true,
				},
			);
			return;
		}
		Console.info(
			{
				JSDirMapper: `✅ Copied '${path}' 👉 '${targetPath}'`,
			},
			{
				now: true,
			},
		);
	};
	/**
	 * @param {EventName} eventName
	 * @param {string} path
	 * @param {Stats} [stats]
	 */
	#allListener = (eventName, path, stats) => {
		path = Paths.normalize(path);
		this.#q
			.callback(path, async ({ isLastOnQ }) => {
				await this.#allListenerQ(path, isLastOnQ, eventName, stats);
			})
			.then(([, errorAllListenerCallback]) => {
				if (!errorAllListenerCallback) {
					return;
				}
				Console.error({ errorAllListenerCallback }, { now: true });
			});
	};

	/**
	 * @param {string} path
	 * @param {string} targetPath
	 * @returns {Plugin}
	 */
	#autoExternalize = (path, targetPath) => {
		return autoExternalize(
			path,
			targetPath,
			this.#watchPath,
			this.#mapToPath,
			this.#depMap,
			this.#esbuildPathRebuild,
		);
	};
}
