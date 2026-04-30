// @ts-check

import { basename, extname, join, relative, resolve } from 'node:path';

import { watch } from 'chokidar';

import { EsWatcher } from '../class/EsWatcher.mjs';
import { Paths } from '../class/Paths.mjs';
import { QChannel } from '../class/QChannel.mjs';
import { SafeExit } from '../class/SafeExit.mjs';
import { Console } from '../class/Console.mjs';
import { TryNew } from '../function/TryNew.mjs';
import { CreateESPlugin } from './CreateESPlugin.mjs';
import { pluginVivthBundle } from './adds/pluginVivthBundle.mjs';
import { lastEditedUnix } from './adds/lastEditedUnix.mjs';
import { BrowserExternals } from './adds/BrowserExternals.mjs';
import { onEndEsBuildErrorLogger } from './adds/onEndEsBuildErrorLogger.mjs';
import { ForOfSync } from '../function/ForOfSync.mjs';
import { FileSafe } from '../class/FileSafe.mjs';
import { TsToMjs } from '../function/TsToMjs.mjs';

/**
 * @description
 * - class helper for one to one Mapping JS files;
 * - only bundles `.mts` AND `.mjs` in the `path.watch` directory, extension restriction to module as to enforce:
 * >- `esm` style input;
 * >- to not confuse IDE and esbuild resolver of extensionless static import;
 * @template {import('esbuild').BuildOptions} O
 */
export class JSDirMapper {
	static #consoleID = `vivth.JSDirMapper`;
	/**
	 * @description
	 * @param {Object} path
	 * - relative from project root;
	 * - only bundles `.mts` AND `.mjs`:
	 * >- `.wasm`: will be copied as is;
	 * >- `.as.ts` will be dealt accordingly based on `options.asTsToMjsHandler`;
	 * @param {string} path.watch
	 * - watch this path for changes;
	 * @param {string} path.mapTo
	 * - bundles to this path
	 * @param {Object} options
	 * @param {Object} options.esbuild
	 * @param {Omit<ConstructorParameters<typeof EsWatcher<O>>[0],
	 * 	"entryPoints"|
	 * 	"outFile"|
	 * 	"write"|
	 * 	"loader"|
	 * 	"format"|
	 * 	"bundle"|
	 * 	"logLevel"|
	 * 	"mainFields"
	 * >} options.esbuild.buildOptions
	 * - `logLimit`: default = `3`;
	 * - `entryPoints`: auto filled with `path.watch` + filepath;
	 * - `outFile`: auto filled with `path.mapTo` + filepath(suffixed with `.mjs`);
	 * - `write`: auto filled by `vivth.JSDirMapper`;
	 * - `loader`: auto filled by `vivth.JSDirMapper` depended on file extname;
	 * - `mainFields`: auto filled by `vivth.JSDirMapper`, ['module', 'main'];
	 * - `format`: auto filled by `vivth.JSDirMapper`, always `esm`;
	 * - `bundle`: auto filled by `vivth.JSDirMapper`, always `true`;
	 * - `logLevel`: auto filled by `vivth.JSDirMapper`;
	 * @param {ConstructorParameters<typeof EsWatcher<O>>[1]} [options.esbuild.watchOption]
	 * @param {Parameters<typeof TsToMjs>[1]} [options.asTsToMjsHandler]
	 * - argument[1] used for `.as.ts` extention(assemblyscript to `.wasm` + `.mjs` loader):
	 * >- handled via `vivth.TsToMjs`;
	 * >- preferably to be isolated on a single folder;
	 * @example
	 * import process from 'node:process';
	 *
	 * import { SafeExit, Paths, JSDirMapper } from '../index.mjs';
	 *
	 * new Paths({
	 * 	root: process.env.INIT_CWD ?? process.cwd(),
	 * });
	 *
	 * new SafeExit({
	 * 	eventNames: ['SIGINT', 'SIGTERM'],
	 * 	terminator: () => process.exit(0),
	 * });
	 *
	 * new JSDirMapper(
	 * 	{
	 * 		mapTo: '/test/jsdirmapped/',
	 * 		watch: '/test/jsdirmapper/',
	 * 	},
	 * 	{
	 * 		esbuild: { buildOptions: { platform: 'browser' } },
	 * 		asTsToMjsHandler: { assemblyScriptOptions: {} },
	 * 		// `assemblyScriptOptions` must be truthy to handle `.as.ts`
	 * 	},
	 * );
	 *
	 */
	constructor({ mapTo, watch }, { esbuild, asTsToMjsHandler }) {
		this.#watchPath = Paths.normalize(join(Paths.root, watch));
		this.#mapToPath = Paths.normalize(join(Paths.root, mapTo));
		this.#q = new QChannel(`JSDirMapper:${this.#watchPath}`);
		this.#esbuildOptions = esbuild;
		this.#asTsToMjsHandler = asTsToMjsHandler;
		this.#start();
	}
	/**
	 * @type { string }
	 */
	#watchPath;
	/**
	 * @type { string }
	 */
	#mapToPath;
	/**
	 * @type {ConstructorParameters<typeof JSDirMapper<O>>[1]["esbuild"]}
	 */
	#esbuildOptions;
	/**
	 * @type {ConstructorParameters<typeof JSDirMapper<O>>[1]["asTsToMjsHandler"]}
	 */
	#asTsToMjsHandler;
	/**
	 * @type {QChannel<string>}
	 */
	#q;
	#start() {
		const watcher = watch(this.#watchPath);
		watcher.addListener('all', this.#allListener);
		SafeExit.instance?.addCallback(async () => {
			watcher.removeAllListeners();
			watcher.close();
		});
	}
	/**
	 * @type { Map<string, ()=>Promise<void>> }
	 */
	#mappedReleaseCallbacks = new Map();
	/**
	 * @param {string} path
	 * @param {()=>Promise<void>} cb
	 * @returns {void}
	 */
	#setReleaseCallback = (path, cb) => {
		this.#mappedReleaseCallbacks.set(path, cb);
	};
	/**
	 * @param {string} path
	 * @returns {boolean}
	 */
	#hasReleaseCallback = (path) => {
		return this.#mappedReleaseCallbacks.has(path);
	};
	/**
	 * @param {string} path
	 * @returns {Promise<void>}
	 */
	#runReleaseCallback = async (path) => {
		await this.#mappedReleaseCallbacks.get(path)?.();
	};
	/**
	 * @param {string} targetPath
	 * @param {string} extension
	 * @param {()=>boolean} isLastOnQ
	 * @param {import('chokidar/handler.js').EventName} eventName
	 * @param {string} path
	 * @param {import('node:fs').Stats} [stats]
	 * @returns {Promise<boolean>}
	 */
	#allListenerChecks = async (targetPath, extension, isLastOnQ, eventName, path, stats) => {
		if (
			/**  */
			!isLastOnQ()
		) {
			return false;
		}
		switch (eventName) {
			case 'add':
			case 'change':
				break;
			case 'unlink':
			case 'error':
				if (
					/**  */
					this.#hasReleaseCallback(path)
				) {
					await this.#runReleaseCallback(path);
				}
				return false;
			default:
				return false;
		}
		const pathBaseName = basename(path);
		if (
			/**  */
			!stats ||
			!stats.isFile() ||
			this.#hasReleaseCallback(path) ||
			pathBaseName.endsWith(`.d${extension}`)
		) {
			return false;
		}
		switch (extension) {
			case '.mjs':
			case '.mts':
				break;
			case '.js':
			case '.ts':
				if (
					/**  */
					path.endsWith('.as.ts') ||
					path.endsWith('.js')
				) {
					await TsToMjs(path, this.#asTsToMjsHandler);
				}
				return false;
			case '.wasm':
				const [, errorCopyWASM] = await FileSafe.copy(path, targetPath);
				if (
					/**  */
					!errorCopyWASM
				) {
					Console.info({
						[JSDirMapper.#consoleID]: `✅ Copied '${path}' 👉 '${targetPath}'`,
					});
				} else {
					Console.info({
						[JSDirMapper.#consoleID]: `❌ Error to copy '${path}'`,
						errorCopyWASM,
					});
				}
				return false;
			default:
				Console.warn({
					now: Date.now(),
					[JSDirMapper.#consoleID]: `'${path}' is ignored`,
				});
				return false;
		}
		return true;
	};

	/**
	 * @param {string} path
	 * @returns {string}
	 */
	static #correctEndpointExt = (path) => {
		if (
			/**  */
			!path.endsWith('.mjs')
		) {
			path = `${path}.mjs`;
		}
		return path;
	};

	/**
	 * @param {import('chokidar/handler.js').EventName} eventName
	 * @param {string} path
	 * @param {import('node:fs').Stats} [stats]
	 */
	#allListener = (eventName, path, stats) => {
		path = Paths.normalize(path);
		this.#q
			.callback(path, async ({ isLastOnQ }) => {
				const extension = extname(path);
				const targetPath = join(this.#mapToPath, relative(this.#watchPath, path));
				if (
					/** is ready to be handled */
					!(await this.#allListenerChecks(targetPath, extension, isLastOnQ, eventName, path, stats))
				) {
					return;
				}
				const buildOptions = this.#esbuildOptions.buildOptions;
				if (
					/**  */
					buildOptions.platform === 'browser'
				) {
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
							'.cjs': 'js',
							'.mts': 'ts',
							'.ts': 'ts',
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
				if (
					/**  */
					errorInstantiatingWatcher
				) {
					Console.error({ now: Date.now(), errorInstantiatingWatcher });
					return;
				}
				this.#rebuilderPaths.set(path, eswatcherInstance.rebuild);
				this.#setReleaseCallback(path, async () => {
					this.#rebuilderPaths.delete(path);
					this.#depMap.delete(path);
					await eswatcherInstance.remove();
				});
			})
			.then(([, errorAllListenerCallback]) => {
				if (
					/**  */
					!errorAllListenerCallback
				) {
					return;
				}
				Console.error({ errorAllListenerCallback });
			});
	};
	/**
	 * @type {Map<string, ()=>Promise<any>>}
	 */
	#rebuilderPaths = new Map();
	/**
	 * @type {Map<string, Set<string>>}
	 * - key: dependecies;
	 * - value: importer;
	 */
	#depMap = new Map();

	/**
	 * @param {string} jspath
	 * @returns {Promise<boolean>}
	 */
	#resolveJSDependencyPath = async (jspath) => {
		const ext = extname(jspath);
		if (
			/**  */
			ext !== '.js'
		) {
			return false;
		}
		const [hasAssemblyScriptCompanion] = await FileSafe.exist(jspath.replace(/.js$/g, '.as.ts'));
		return hasAssemblyScriptCompanion ?? false;
	};

	/**
	 * @param {string} path
	 * @param {string} targetPath
	 * @returns {import('esbuild').Plugin}
	 */
	#autoExternalize = (path, targetPath) => {
		return CreateESPlugin('JSDirMapper:auto-externalize', ({ onResolve, onEnd }) => {
			onResolve({ filter: /^\.{1,2}\// }, async ({ resolveDir, path: depModulePath }) => {
				const fullPath = Paths.normalize(resolve(resolveDir, depModulePath));
				if (
					/**  */
					await this.#resolveJSDependencyPath(fullPath)
				) {
					return null;
				}
				const runtimePath = fullPath.replace(this.#watchPath, this.#mapToPath);
				if (
					/**  */
					!fullPath.endsWith('.mjs') &&
					!(await FileSafe.exist(runtimePath))[0]
				) {
					depModulePath = `${depModulePath}.mjs`;
				}
				const rel = Paths.normalize(relative(this.#watchPath, fullPath));
				if (
					/**  */
					rel.startsWith('../')
				) {
					return null;
				}
				if (
					/**  */
					!this.#depMap.has(fullPath)
				) {
					this.#depMap.set(fullPath, new Set());
				}
				this.#depMap.get(fullPath)?.add(path);
				const resolvedPath = `${depModulePath}?t=${await lastEditedUnix(fullPath)}`;
				return { external: true, path: resolvedPath };
			});
			onEnd(async ({ errors: errorsBuild }) => {
				if (
					/**  */
					errorsBuild.length
				) {
					onEndEsBuildErrorLogger(errorsBuild);
					return;
				}
				Console.info({
					now: Date.now(),
					[JSDirMapper.#consoleID]: `✅ Successfully Bundle'${path}' 👉 '${targetPath}'`,
				});
				const importers = this.#depMap.get(path);
				if (
					/**  */
					!importers
				) {
					return;
				}
				const [promises] = ForOfSync(importers, async (importer) => {
					const rebuilder = this.#rebuilderPaths.get(importer);
					if (
						/**  */
						!rebuilder
					) {
						return;
					}
					return rebuilder();
				});
				await Promise.all(promises);
			});
		});
	};
}
