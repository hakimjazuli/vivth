// @ts-check

import { dirname, extname, join, relative } from 'node:path';
import { readFile } from 'node:fs/promises';

import { watch } from 'chokidar';
import { compileAsync } from 'sass';

import { Paths } from '../class/Paths.mjs';
import { QChannel } from '../class/QChannel.mjs';
import { FileSafe } from '../class/FileSafe.mjs';
import { ForOfSync } from '../function/ForOfSync.mjs';
import { Console } from '../class/Console.mjs';
import { SafeExit } from '../class/SafeExit.mjs';
import { BrowserExternals } from './adds/BrowserExternals.mjs';
import { TryAsync } from '../function/TryAsync.mjs';
import { pluginVivthBundle } from './adds/pluginVivthBundle.mjs';
import { CreateESPlugin } from './CreateESPlugin.mjs';
import { UniqueFSTempName } from '../function/UniqueFSTempName.mjs';
import { EsWatcher } from '../class/EsWatcher.mjs';
import { TrySync } from '../function/TrySync.mjs';
import { onEndEsBuildErrorLogger } from './adds/onEndEsBuildErrorLogger.mjs';

/**
 * @description
 * - this Class require `esbuild` to be installed, example using npm:
 * ```shell
 * npm install esbuild
 * ```
 * - each file can define it's own `targetPaths` inline by adding comment then fullpath on the begining of the file:
 * ```js
 * // D://my/path/something.mjs
 * // D://my/path/something-else.mjs
 *
 * console.log('hello');
 * ```
 * ```scss
 * /*[blank] D://my/path/something.css *[blank]/
 *
 * $somecolor: black;
 *
 * body {
 * 	background-color: $somecolor;
 * }
 * ```
 * -files extention:
 * >- `js`/`ts` files will compiled with esbuild cli, using `option.esbuild` as argument;
 * >- `sass`/`scss` it will be compiled to css first;
 * >- other than those files, they will just copied to `targetPaths`;
 */
export class FileSelfMapper {
	/**
	 * @type {QChannel<string>}
	 */
	#q;

	/**
	 * @type { string }
	 */
	static #consoleID = 'vivth.FileSelfMapper';
	/**
	 * @type { Map<string, ()=>Promise<void>> }
	 */
	static #releaseCallbackPerPath = new Map();
	/**
	 * @param { string } path
	 * @returns { boolean }
	 */
	static #hasReleaseCallback = (path) => {
		return FileSelfMapper.#releaseCallbackPerPath.has(path);
	};
	/**
	 * @param { string } path
	 * @param { ()=>Promise<void> } callback
	 * @param { boolean } registerToSafeExit
	 * @returns { void }
	 */
	static #registerReleaseCallback = (path, callback, registerToSafeExit = true) => {
		FileSelfMapper.#releaseCallbackPerPath.set(path, callback);
		if (
			/**  */
			!registerToSafeExit
		) {
			return;
		}
		SafeExit.instance?.addCallback(callback);
	};
	/**
	 * @param { string } path
	 * @returns { Promise<void> }
	 */
	static #runReleaseCallback = async (path) => {
		const releaseCallback = FileSelfMapper.#releaseCallbackPerPath.get(path);
		if (
			/** conditionalDescription */
			!releaseCallback
		) {
			return;
		}
		await releaseCallback();
		FileSelfMapper.#releaseCallbackPerPath.delete(path);
		SafeExit.instance?.removeCallback(releaseCallback);
	};
	/**
	 * @type { Set<string> }
	 */
	static #tempPaths = new Set();

	/**
	 * @type { ()=>Promise<void> }
	 */
	static #clearUpTempPath = async () => {
		const [promisedRM] = ForOfSync(FileSelfMapper.#tempPaths, async (tempPath) => {
			const [, errorRM] = await FileSafe.rm(tempPath);
			if (
				/** conditionalDescription */
				!errorRM
			) {
				return;
			}
			Console.error({ errorRM });
		});
		await Promise.all(promisedRM);
	};

	/**
	 * @description
	 * @param {string} relativeWatchPathToRoot
	 * @param {Object} options
	 * @param {Omit<Parameters<import('esbuild')["context"]>[0], "write"|"minify"|"format"|"mainFields"|"outfile"|"bundle">} [options.esbuild]
	 * - `logLimit`: default = `3`;
	 * - `outFile`: auto determined by comment line on top level of each files;
	 * - `minify`: determined by file `relativePath`(to dirname of `watchpath`) name included `.min.`;
	 * - `format`: determined by file `relativePath`(to dirname of `watchpath`) name included `.esm.` or `.iife.`;
	 * - `mainFields`: determined by file externtion if `.cjs` -> `main,module` else `module,main`;
	 * - `bundle`: automatically added by `vivth.FileSelfMapper`;
	 * - `write`: automatically added by `vivth.FileSelfMapper`;
	 * @param {boolean} [options.deleteTempFilesAfterExit]
	 * @example
	 * import { FileSelfMapper } from 'vivth';
	 *
	 * new FileSelfMapper('../ssg-assets/', {
	 * 	esbuild: {},
	 * 	// deleteTempFilesAfterExit: true,
	 * });
	 */
	constructor(relativeWatchPathToRoot, options) {
		SafeExit.instance?.addCallback(FileSelfMapper.#clearUpTempPath);
		const watcherFullPath = Paths.normalize(join(Paths.root, relativeWatchPathToRoot));
		const watcher = watch(watcherFullPath, { ignoreInitial: false });
		/**
		 * @type { QChannel<string> }
		 */
		const q = (this.#q = new QChannel('FileSelfMapper'));
		watcher.addListener('all', (eventName, path, stats) => {
			path = Paths.normalize(path);
			q.callback(path, async ({ isLastOnQ }) => {
				if (
					/** conditionalDescription */
					!isLastOnQ()
				) {
					return;
				}
				switch (eventName) {
					case 'add':
					case 'change':
						break;
					case 'unlink':
					case 'error':
						await FileSelfMapper.#runReleaseCallback(path);
						return;
					default:
						return;
				}

				if (
					/**  */
					FileSelfMapper.#hasReleaseCallback(path) ||
					!stats ||
					!stats.isFile()
				) {
					return;
				}
				const extension = extname(path);
				if (
					/**  */
					extension !== '.scss' &&
					extension !== '.sass' &&
					extension !== '.mjs' &&
					extension !== '.mts' &&
					extension !== '.ts' &&
					extension !== '.cjs'
				) {
					await FileSelfMapper.#writeCommon(path);
					return;
				}
				if (
					/**  */
					extension === '.scss' ||
					extension === '.sass'
				) {
					await FileSelfMapper.#bundleSCSS(path);
					return;
				}
				await this.#bundleJS(extension, watcherFullPath, path, options);
			}).then(([, errorWatcherListener]) => {
				if (
					/**  */
					!errorWatcherListener
				) {
					return;
				}
				Console.error({
					now: Date.now(),
					errorWatcherListener,
				});
			});
		});
	}

	/**
	 * @param { string } path
	 * @returns { Promise<void> }
	 */
	static #writeCommon = async (path) => {
		const { content, targetPaths } = await FileSelfMapper.#getTargetPath(path);
		const [promiseWrite] = ForOfSync(targetPaths, async (target) => {
			const [, errorWriteCommonFile] = await FileSafe.write(target, content);
			if (
				/**  */
				errorWriteCommonFile
			) {
				Console.error({
					now: Date.now(),
					errorWriteCommonFile,
				});
				return;
			}
			Console.info({
				now: Date.now(),
				[FileSelfMapper.#consoleID]: `✅ Succeed write '${path}' 👉 '${Paths.normalize(target)}';`,
			});
		});
		await Promise.all(promiseWrite);
	};

	/**
	 * @param { string } path
	 * @returns { Promise<void> }
	 */
	static #bundleSCSS = async (path) => {
		const { targetPaths } = await FileSelfMapper.#getTargetPath(path);
		const result = (await compileAsync(path, { style: 'compressed' })).css;
		const promisedWrite = ForOfSync(targetPaths, async (target) => {
			const [, errorWriteCSS] = await FileSafe.write(target, result);
			if (
				/**  */
				errorWriteCSS
			) {
				Console.error({
					now: Date.now(),
					errorWriteCSS,
				});
				return;
			}
			Console.info({
				now: Date.now(),
				[FileSelfMapper.#consoleID]: `✅ Succeed convert '${path}' 👉 '${target}';`,
			});
		});
		await Promise.all(promisedWrite);
	};

	/**
	 * @param { ".mjs" | ".mts" | ".ts" | ".cjs" } extension
	 * @param { string } watcherFullPath
	 * @param { string } path
	 * @param { ConstructorParameters<typeof FileSelfMapper>[1]} options
	 * @returns { Promise<void> }
	 */
	#bundleJS = async (
		extension,
		watcherFullPath,
		path,
		{ esbuild = {}, deleteTempFilesAfterExit = false },
	) => {
		if (
			/**  */
			esbuild.platform === 'browser'
		) {
			esbuild.external = Array.from(FileSelfMapper.#createBrowserExternals(esbuild.external ?? []));
		}
		Object.assign(esbuild, {
			mainFields: [
				extension === '.cjs' ? 'main' : 'module',
				extension === '.cjs' ? 'module' : 'main',
			],
		});
		const relativePath = FileSelfMapper.#getRelative(watcherFullPath, path);
		Object.assign(esbuild, { minify: relativePath.includes('.min.') });
		if (
			/**  */
			relativePath.includes('.iife.')
		) {
			Object.assign(esbuild, { format: 'iife' });
		} else {
			Object.assign(esbuild, { format: 'esm' });
		}
		const tempPath = UniqueFSTempName(path);
		const [eswatcherInstance, errorEsbuildContext] = TrySync(() => {
			return new EsWatcher({
				logLimit: 3,
				...esbuild,
				bundle: true,
				entryPoints: [path],
				outfile: tempPath,
				write: true,
				logLevel: 'silent',
				banner: {
					js: relativePath.includes('.bin.') ? '#!/usr/bin/env node' : '',
					...esbuild.banner,
				},
				plugins: [
					CreateESPlugin('FileSafeMapperWatch', (build) => {
						build.onEnd(({ errors }) => {
							if (
								/**  */
								errors.length
							) {
								onEndEsBuildErrorLogger(errors);
								return;
							}
							FileSelfMapper.#onJSDependencyChanges(tempPath, path, this.#q);
						});
					}),
					...(esbuild.plugins ?? []),
					pluginVivthBundle,
				],
			});
		});
		if (
			/**  */
			errorEsbuildContext
		) {
			Console.error({ errorEsbuildContext });
			return;
		}

		FileSelfMapper.#registerReleaseCallback(path, async () => {
			if (
				/**  */
				!deleteTempFilesAfterExit
			) {
				return;
			}
			await FileSafe.rm(tempPath);
		});

		FileSelfMapper.#registerReleaseCallback(path, eswatcherInstance.remove, false);
	};

	/**
	 * @param {string[]} esbuildExternal
	 * @returns {Set<string>}
	 */
	static #createBrowserExternals = (esbuildExternal) => {
		return BrowserExternals.union(new Set(esbuildExternal));
	};

	/**
	 * @param {string} tempPath
	 * @param {string} path
	 * @param {QChannel<string>} q
	 * @returns {Promise<void>}
	 */
	static #onJSDependencyChanges = async (tempPath, path, q) => {
		q.callback(path, async ({ isLastOnQ }) => {
			if (
				/**  */
				!isLastOnQ()
			) {
				return;
			}
			const { targetPaths } = await FileSelfMapper.#getTargetPath(path);
			ForOfSync(targetPaths, async (target) => {
				q.callback(target, async ({ isLastOnQ }) => {
					if (
						/**  */
						!isLastOnQ()
					) {
						return;
					}
					const [content, errorGetTempPath] = await TryAsync(async () => {
						return await readFile(tempPath, { encoding: 'utf-8' });
					});
					if (
						/**  */
						errorGetTempPath
					) {
						Console.error({
							now: Date.now(),
							errorGetTempPath,
						});
						return;
					}
					const [, errorWriteJS] = await FileSafe.write(target, content);
					if (
						/**  */
						errorWriteJS
					) {
						Console.error({
							now: Date.now(),
							errorWriteJS,
						});
						return;
					}
					Console.info({
						now: Date.now(),
						[FileSelfMapper.#consoleID]: `✅ Build succeed: '${path}' 👉 '${target}'`,
					});
				});
			});
		});
	};

	/**
	 * @param { string } path
	 * @returns { Promise<{
	 * 	targetPaths: Set<string>,
	 * 	content: string,
	 * }> }
	 */
	static #getTargetPath = async (path) => {
		const raw = await readFile(path, 'utf8');
		const perLines = raw.split(/\r?\n/);
		const perLinesCode = structuredClone(perLines);
		/**
		 * @type {Set<string>}
		 */
		const targetPaths = new Set();
		for (let i = 0; i < perLines.length; i++) {
			const lineData = perLines[i];
			if (
				/**  */
				!lineData
			) {
				continue;
			}
			const commentRegexForPath =
				/<!--\s*(.*?)\s*-->|\/\/\/?\s*(.*?)\s*$|\/\*{1,2}!\s*([\s\S]*?)\s*\*\/|\/\*{1,2}\s*([\s\S]*?)\s*\*\/|#\s*(.*?)\s*$|--\s*(.*?)\s*$|;\s*(.*?)\s*$/g;
			const m = commentRegexForPath.exec(lineData);
			if (
				/**  */
				m === null
			) {
				break;
			}
			const [group] = m.slice(1).filter(Boolean);
			if (
				/**  */
				!group
			) {
				break;
			}
			const candidate = group.trim();
			if (
				/**  */
				!/^(?:[A-Za-z]:[\\/]|[\\/]|\.{1,2}[\\/])?[A-Za-z0-9._\\/-]+$/g.test(candidate)
			) {
				break;
			}
			if (
				/**  */
				!candidate
			) {
				break;
			}
			perLinesCode[i] = '';
			targetPaths.add(candidate);
		}

		return {
			get content() {
				let content = perLinesCode.join('\n').trim();
				// Remove leading whitespace-only lines until first non-whitespace
				return (content = content.replace(/^\s*\n+/, '').replace(/\n+/g, '\n'));
			},
			targetPaths,
		};
	};

	/**
	 * @param {string} watcherFullPath
	 * @param {string} path
	 * @returns { string }
	 */
	static #getRelative = (watcherFullPath, path) => {
		return Paths.normalize(relative(dirname(watcherFullPath), path));
	};
}
