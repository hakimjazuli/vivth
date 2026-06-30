// @ts-check

import { dirname, extname, relative } from 'node:path';
import { readFile } from 'node:fs/promises';

import { build } from 'esbuild';
import { watch } from 'chokidar';
import { compileAsync } from 'sass';
import { createDocument } from 'domino';

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
import { Preferrence } from '../common/Preferrence.mjs';
import { LazyFactory } from '../function/LazyFactory.mjs';

/**
 * @typedef {import('../typehints/VivthCleanup.mjs').VivthCleanup} VivthCleanup
 */

/**
 * @description
 * - each file can define it's own `targetPaths` inline by adding comment then fullpath on the begining of the file:
 * >- `mjs`;
 * ```js
 * // D://my/path/something.mjs
 * // D://my/path/something-else.mjs
 *
 * console.log('hello');
 * ```
 * >- `scss`;
 * ```scss
 * /*[blank] D://my/path/something.css *[blank]/
 *
 * $somecolor: black;
 *
 * body {
 * 	background-color: $somecolor;
 * }
 * ```
 * >- `.ignore`;
 * ```.ignore
 * # D:/my/project/root/.gitignore
 * # D:/my/project/root/.npmignore
 *
 * /dev/
 * ```
 * - files extention:
 * >- `js`/`ts` files will be compiled with `vivth/node.EsWathcer`, using `option.esbuild` as argument;
 * >- `sass`/`scss` it will be compiled to `css` first;
 * >- `html` will be checked for `script`;
 * >>- has `[type="module]"`: will be processed as `esm`;
 * >>- has `[minify="true"]`: will be minified;
 * >- other than those files, they will be just copied to `targetPaths`;
 * - for runtime example see file `/dev/auto/` on source code;
 * @implements {VivthCleanup}
 */
export class FileSelfMapper {
	/**
	 * @description
	 * @param {string} watchPath
	 * - `relative`(to `Paths.root`) OR `absolute`, both are accepted;
	 * @param {Object} options
	 * @param {Omit<Parameters<import('esbuild')["context"]>[0], "write"|"minify"|"format"|"mainFields"|"outfile"|"bundle">} [options.esbuild]
	 * - `logLimit`: default = `3`;
	 * - `outFile`: auto determined by comment line on top level of each files;
	 * - `minify`: determined by file `relativePath`(to dirname of `watchpath`) name included `.min.`;
	 * - `format`: determined by file `relativePath`(to dirname of `watchpath`) name included `.esm.` or `.iife.`;
	 * - `mainFields`: `module,main`;
	 * - `bundle`: automatically added by `vivth.FileSelfMapper`;
	 * - `write`: automatically added by `vivth.FileSelfMapper`;
	 * @param {boolean} [options.deleteTempFilesAfterExit]
	 * @param {(path:{mapTo:string, src:string}, content:string)=>(string|false)} [options.postProcessDirectCopy]
	 * - works for:
	 * >- `.js`;
	 * >- anything that are not `sass` and `module js/ts`;
	 * - return `false` to exclude `target` from mapping;
	 * @example
	 * import { FileSelfMapper } from 'vivth/node';
	 *
	 * new FileSelfMapper('../ssg-assets/', {
	 * 	esbuild: {},
	 * 	// deleteTempFilesAfterExit: true,
	 * });
	 */
	constructor(watchPath, options) {
		SafeExit.instance?.addCallback(this.vivthCleanup);
		const watcherFullPath = Paths.diskAbsolute(watchPath);
		this.#watcher = watch(watcherFullPath, { ignoreInitial: false });
		this.#watcher.addListener('all', async (eventName, path, stats) => {
			path = Paths.normalize(path);
			const [, errorWatcherListener] = await this.#q.callback(path, async ({ isLastOnQ }) => {
				await this.#listenerQ(isLastOnQ, eventName, path, watcherFullPath, options, stats);
			});
			if (!errorWatcherListener) {
				return;
			}
			Console.error(
				{
					errorWatcherListener,
				},
				{
					now: true,
				},
			);
		});
	}
	#watcher;
	/**
	 * @type {QChannel<string>}
	 */
	#q = LazyFactory(() => new QChannel('FileSelfMapper'));
	/**
	 * @type { Map<string, ()=>Promise<void>> }
	 */
	#releaseCallbackPerPath = new Map();

	vivthCleanup = async () => {
		SafeExit.instance?.removeCallback(this.vivthCleanup);
		await Promise.all(
			ForOfSync(this.#releaseCallbackPerPath, async ([path]) => {
				await this.#runCleanupOfSpecificPath(path);
			})[0],
		);
		this.#watcher.removeAllListeners();
		this.#watcher.close();
	};

	/**
	 * @param { string } path
	 * @returns { Promise<void> }
	 */
	#runCleanupOfSpecificPath = async (path) => {
		const releaseCallback = this.#releaseCallbackPerPath.get(path);
		if (!releaseCallback) {
			return;
		}
		await releaseCallback();
		this.#releaseCallbackPerPath.delete(path);
	};

	/**
	 *
	 * @param {() => boolean} isLastOnQ
	 * @param {import('chokidar/handler.js').EventName} eventName
	 * @param {string} path
	 * @param {string} watcherFullPath
	 * @param {ConstructorParameters<typeof FileSelfMapper>[1]} options
	 * @param {import('node:fs').Stats} [stats]
	 * @returns
	 */
	#listenerQ = async (isLastOnQ, eventName, path, watcherFullPath, options, stats) => {
		if (!isLastOnQ()) {
			return;
		}
		switch (eventName) {
			case 'add':
			case 'change':
				break;
			case 'unlink':
			case 'error':
				await this.#runCleanupOfSpecificPath(path);
				return;
			default:
				return;
		}

		if (this.#releaseCallbackPerPath.has(path) || !stats || !stats.isFile()) {
			return;
		}
		const extension = extname(path);
		if (extension === '.html') {
			await FileSelfMapper.#writeHTML(path, options.postProcessDirectCopy);
			return;
		}
		if (
			extension !== '.scss' &&
			extension !== '.sass' &&
			extension !== '.mjs' &&
			extension !== '.mts' &&
			extension !== '.ts'
		) {
			await FileSelfMapper.#writeCommon(path, options.postProcessDirectCopy);
			return;
		}
		if (extension === '.scss' || extension === '.sass') {
			await FileSelfMapper.#bundleSCSS(path);
			return;
		}
		await this.#bundleJS(watcherFullPath, path, options);
	};
	/**
	 * @param { string } path
	 * @param { (path:{mapTo:string, src:string}, content:string)=>(string|false) } [postprosess]
	 * @returns { Promise<void> }
	 */
	static #writeHTML = async (path, postprosess) => {
		const { content: originalContent, targetPaths } = await FileSelfMapper.#getTargetPath(path);
		let newContent = originalContent;
		const resDocument = createDocument(originalContent);
		const handledScripts = Array.from(resDocument.querySelectorAll(`script`));
		await Promise.all(
			ForOfSync(handledScripts, async (scriptElement) => {
				const hasMinifyTrue = (scriptElement.getAttribute('minify') ?? '') === 'true';
				const hasTypeModule = (scriptElement.getAttribute('type') ?? '') === 'module';
				if (!hasMinifyTrue && !hasTypeModule) {
					return;
				}
				const inner = scriptElement.innerHTML;
				const res = await build({
					write: false,
					stdin: {
						contents: inner,
						loader: 'js',
						resolveDir: dirname(path),
					},
					bundle: false,
					logLevel: 'silent',
					minify: hasMinifyTrue,
					format: hasTypeModule ? 'esm' : undefined,
				});
				if (res.errors.length) {
					Console.error({
						errorBuildingInlineScript: {
							outer: scriptElement.outerHTML,
							message: 'failed to build using esbuild.build',
						},
					});
					return;
				}
				const minified = res.outputFiles[0]?.text.trim();
				newContent = newContent.replace(
					inner,
					// @ts-expect-error
					minified,
				);
			})[0],
		);
		await Promise.all(
			ForOfSync(targetPaths, async (target) => {
				let processedContent;
				if (postprosess) {
					postprosess({ mapTo: target, src: path }, newContent);
				}
				const [, errorWriteHTML] = await FileSafe.write(
					target,
					(!!processedContent ? processedContent : newContent).replace(
						/\s*minify\="[\s\S]*?"\s*/g,
						'',
					),
					{
						encoding: Preferrence.encoding,
					},
				);
				if (errorWriteHTML) {
					Console.error({ errorWriteHTML }, { now: true });
					return;
				}
				Console.info(`✅ Successfully map:'${path}' to:'${target}'`, { now: true });
			})[0],
		);
	};

	/**
	 * @param { string } path
	 * @param { (path:{mapTo:string, src:string}, content:string)=>(string|false) } [postprosess]
	 * @returns { Promise<void> }
	 */
	static #writeCommon = async (path, postprosess) => {
		const { content, targetPaths } = await FileSelfMapper.#getTargetPath(path);
		const [promiseWrite] = ForOfSync(targetPaths, async (target) => {
			/**
			 * @type {string|false}
			 */
			let trueContent;
			if (postprosess) {
				trueContent = postprosess({ mapTo: target, src: path }, content);
			} else {
				trueContent = content;
			}
			if (trueContent === false) {
				return;
			}
			const [, errorWriteCommonFile] = await FileSafe.write(target, trueContent, {
				encoding: Preferrence.encoding,
			});
			if (errorWriteCommonFile) {
				Console.error(
					{
						errorWriteCommonFile,
					},
					{
						now: true,
					},
				);
				return;
			}
			Console.info(
				{
					[FileSelfMapper.name]: `✅ Succeed write '${path}' 👉 '${Paths.normalize(target)}';`,
				},
				{
					now: true,
				},
			);
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
			const [, errorWriteCSS] = await FileSafe.write(target, result, {
				encoding: Preferrence.encoding,
			});
			if (errorWriteCSS) {
				Console.error(
					{
						errorWriteCSS,
					},
					{
						now: true,
					},
				);
				return;
			}
			Console.info(
				{
					[FileSelfMapper.name]: `✅ Succeed convert '${path}' 👉 '${target}';`,
				},
				{
					now: true,
				},
			);
		});
		await Promise.all(promisedWrite);
	};

	/**
	 * @param { string } watcherFullPath
	 * @param { string } path
	 * @param { ConstructorParameters<typeof FileSelfMapper>[1]} options
	 * @returns { Promise<void> }
	 */
	#bundleJS = async (watcherFullPath, path, { esbuild = {}, deleteTempFilesAfterExit = false }) => {
		if (esbuild.platform === 'browser') {
			esbuild.external = Array.from(FileSelfMapper.#createBrowserExternals(esbuild.external ?? []));
		}
		Object.assign(esbuild, {
			mainFields: ['module', 'main'],
		});
		const relativePath = FileSelfMapper.#getRelative(watcherFullPath, path);
		Object.assign(esbuild, { minify: relativePath.includes('.min.') });
		if (relativePath.includes('.iife.')) {
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
					CreateESPlugin('FileSafeMapperWatch', ({ onEnd }) => {
						onEnd(({ errors }) => {
							if (errors.length) {
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
		if (errorEsbuildContext) {
			Console.error(
				{ errorEsbuildContext },
				{
					now: true,
				},
			);
			return;
		}

		this.#releaseCallbackPerPath.set(path, async () => {
			await Promise.all([
				TryAsync(eswatcherInstance.vivthCleanup),
				TryAsync(async () => {
					if (!deleteTempFilesAfterExit) {
						return;
					}
					await FileSafe.rm(tempPath);
				}),
			]);
		});
	};

	/**
	 * @param {string[]} esbuildExternal
	 * @returns {Set<string>}
	 */
	static #createBrowserExternals = (esbuildExternal) => {
		return BrowserExternals.union(new Set(esbuildExternal));
	};

	/**
	 * @param {()=>boolean} isLastOnQ
	 * @param {string} path
	 * @param {string} tempPath
	 * @param {string} target
	 * @returns {Promise<void>}
	 */
	static #onJSDependencyChanges1 = async (isLastOnQ, path, tempPath, target) => {
		if (!isLastOnQ()) {
			return;
		}
		const [content, errorGetTempPath] = await TryAsync(async () => {
			return await readFile(tempPath, { encoding: Preferrence.encoding });
		});
		if (errorGetTempPath) {
			Console.error(
				{
					errorGetTempPath,
				},
				{
					now: true,
				},
			);
			return;
		}
		const [, errorWriteJS] = await FileSafe.write(target, content, {
			encoding: Preferrence.encoding,
		});
		if (errorWriteJS) {
			Console.error(
				{
					errorWriteJS,
				},
				{
					now: true,
				},
			);
			return;
		}
		Console.info(
			{
				[FileSelfMapper.name]: `✅ Build succeed: '${path}' 👉 '${target}'`,
			},
			{
				now: true,
			},
		);
	};
	/**
	 * @param {()=>boolean} isLastOnQ
	 * @param {string} path
	 * @param {string} tempPath
	 * @param {QChannel<string>} q
	 * @returns {Promise<void>}
	 */
	static #onJSDependencyChanges0 = async (isLastOnQ, path, tempPath, q) => {
		if (!isLastOnQ()) {
			return;
		}
		const { targetPaths } = await FileSelfMapper.#getTargetPath(path);
		await Promise.all(
			ForOfSync(targetPaths, async (target) => {
				q.callback(target, async ({ isLastOnQ }) => {
					await FileSelfMapper.#onJSDependencyChanges1(isLastOnQ, path, tempPath, target);
				});
			})[0],
		);
	};

	/**
	 * @param {string} tempPath
	 * @param {string} path
	 * @param {QChannel<string>} q
	 * @returns {Promise<void>}
	 */
	static #onJSDependencyChanges = async (tempPath, path, q) => {
		q.callback(path, async ({ isLastOnQ }) => {
			await FileSelfMapper.#onJSDependencyChanges0(isLastOnQ, path, tempPath, q);
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
		let raw = await readFile(path, 'utf8');
		const perLines = raw.split(/\r?\n/);
		const perLinesCode = structuredClone(perLines);
		/**
		 * @type {Set<string>}
		 */
		const targetPaths = new Set();
		for (let i = 0; i < perLines.length; i++) {
			const lineData = perLines[i];
			if (!lineData) {
				continue;
			}
			const commentRegexForPath =
				/<!--\s*(.*?)\s*-->|\/\/\/?\s*(.*?)\s*$|\/\*{1,2}!\s*([\s\S]*?)\s*\*\/|\/\*{1,2}\s*([\s\S]*?)\s*\*\/|#\s*(.*?)\s*$|--\s*(.*?)\s*$|;\s*(.*?)\s*$/g;
			const m = commentRegexForPath.exec(lineData);
			if (m === null) {
				break;
			}
			const [group] = m.slice(1).filter(Boolean);
			if (!group) {
				break;
			}
			const candidate = group.trim();
			if (!/^(?:[A-Za-z]:[\\/]|[\\/]|\.{1,2}[\\/])?[A-Za-z0-9._\\/-]+$/g.test(candidate)) {
				break;
			}
			if (!candidate) {
				break;
			}
			perLinesCode[i] = '';
			targetPaths.add(Paths.normalize(candidate));
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
