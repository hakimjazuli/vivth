// @ts-check

import { extname, dirname } from 'node:path';

import { build } from 'esbuild';
import { watch } from 'chokidar';

import { SafeExit } from '../class/SafeExit.mjs';
import { Paths } from '../class/Paths.mjs';
import { EsWatcher } from '../class/EsWatcher.mjs';
import { TryAsync } from '../function/TryAsync.mjs';
import { readFile } from 'node:fs/promises';
import { Console } from '../class/Console.mjs';
import { TryNew } from '../function/TryNew.mjs';
import { pluginVivthBundle } from './adds/pluginVivthBundle.mjs';
import { autoExternalize } from './adds/autoExternalize.mjs';
import { FileSafe } from '../class/FileSafe.mjs';
import { Preferrence } from '../common/Preferrence.mjs';
import { createDocument } from 'domino';
import { ForOfSync } from '../function/ForOfSync.mjs';
import { compileAsync } from 'sass';
import { Timeout } from '../function/Timeout.mjs';
import { BrowserExternals } from './adds/BrowserExternals.mjs';

/**
 * @import {Stats} from 'node:fs'
 * @import {VivthCleanup} from '../typehints/VivthCleanup.mjs'
 */

/**
 * @description
 * - class helper to map files into SSG software that:
 * >- have its own dev server;
 * >- have `Open file with` to be edited via external application;
 * - `js` extensions supports:
 * >- `.mjs`;
 * >- `.cjs`;
 * >- `.js`;
 * - `.html` parse `script` elements to be:
 * >- `minifed` if has `[minify="true"]`;
 * >- use `esm` if has `[type="module"]`;
 * - `.scss`|`.sass` write compiled `.css`;
 * - every other extension will be copied to `targetpath` as is(without `targetpath` as string);
 * - look for [FileSelfMapper](#fileselfmapper) on how to add `targetpath`;
 * @implements {VivthCleanup}
 */
export class SSGDevMapper {
	/**
	 * @description
	 * @param {Object} options
	 * @param {string} options.sourcePath
	 * @param {(normalizedAbsolutePath:string)=>boolean} [options.pathFilter]
	 * - filterOut paths;
	 * @param {import('esbuild').WatchOptions} [options.esbuildWatchOptions]
	 * @param {Omit<Parameters<typeof import('esbuild')["context"]>[0], "write"|"minify"|"format"|"platform"|"mainFields"|"outfile"|"bundle"|"entryPoints">} [options.esbuild]
	 * - `logLimit`: default = `3`;
	 * - `outFile`: auto determined by comment line on top level of each files;
	 * - `minify`: determined by file `relativePath`(to dirname of `watchpath`) name included `.min.`;
	 * - `format`: determined by file `relativePath`(to dirname of `watchpath`) name included `.esm.` or `.iife.`;
	 * - `mainFields`: `module,main`;
	 * - `bundle`: automatically added by `vivth.SSGDevMapper`;
	 * - `write`: automatically added by `vivth.SSGDevMapper`;
	 * @param {(path:{mapTo:string, src:string}, content:string)=>(string|false)} [options.postProcessDirectCopy]
	 * - works for:
	 * >- `.js`;
	 * >- anything that are not `sass` and `module js/ts`;
	 * - return `false` to exclude `target` from mapping;
	 * @param {number} [options.delay]
	 * - `EsWatcher` delay argument;
	 * >- on `SSG` software, there are possiblity that their sync mechanism have debounce/throttle,
	 * >- therefore timeout might necessary;
	 * - default `100`;
	 * @example
	 * import { Paths } from 'vivth/neutral';
	 * import { SafeExit, SSGDevMapper } from 'vivth/node';
	 *
	 * new Paths({
	 * 	root: process.env.INIT_CWD ?? process.cwd(),
	 * });
	 *
	 * new SafeExit('SIGINT', 'SIGTERM');
	 *
	 * new SSGDevMapper({
	 * 	sourcePath: '/test/ssgDevMapper/dev/',
	 * 	timeout: 372,
	 * });
	 */
	constructor({
		pathFilter,
		sourcePath,
		esbuild,
		esbuildWatchOptions,
		postProcessDirectCopy,
		delay = 100,
	}) {
		SafeExit.instance?.addCallback(this.vivthCleanup);
		this.#delay = delay;
		this.#pathFilter = pathFilter;
		/**
		 * @type {string[]}
		 */
		let external = esbuild?.external ?? [];
		if (!Array.isArray(external)) {
			external = [external];
		}
		if (Array.isArray(external)) {
			// @ts-expect-error
			esbuild.external = Array.from(new Set(external).union(BrowserExternals));
		}
		this.#esbuildOptions = esbuild;
		this.#esbuildWatchOptions = esbuildWatchOptions;
		this.#postProcessDirectCopy = postProcessDirectCopy;
		const watcherFullPath = (this.#watcherFullPath = Paths.diskAbsolute(sourcePath));
		const chokidarWatcher = (this.#chokidarWatcher = watch(watcherFullPath, {
			awaitWriteFinish: true,
		}));
		chokidarWatcher.addListener('all', this.#chokidarListener);
	}
	#pathFilter;
	#delay;
	vivthCleanup = async () => {
		this.#chokidarWatcher.removeAllListeners();
		this.#chokidarWatcher.close();
		await Promise.all(
			ForOfSync(this.#esWatcherMap, async ([path, eswatcher]) => {
				eswatcher.vivthCleanup();
				this.#esWatcherMap.delete(path);
			})[0],
		);
	};
	/**
	 * @type {undefined|((path:{mapTo:string, src:string}, content:string)=>(string|false))}
	 */
	#postProcessDirectCopy;
	/**
	 * @type {import('chokidar').FSWatcher}
	 */
	#chokidarWatcher;
	/**
	 * @type {string}
	 */
	#watcherFullPath;
	/**
	 * @type {Map<string, EsWatcher<any>>}
	 */
	#esWatcherMap = new Map();
	/**
	 * @param {import('chokidar/handler.js').EventName} eventName
	 * @param {string} path
	 * @param {Stats} [stats]
	 */
	#chokidarListener = (eventName, path, stats) => {
		path = Paths.normalize(path);
		const pathFilter = this.#pathFilter;
		if (pathFilter && !pathFilter(path)) {
			return;
		}
		EsWatcher.q.callback(EsWatcher.q, async () => {
			await Timeout(this.#delay);
			await this.#qCallbackMainIsHandled(eventName, path, stats);
		});
	};
	/**
	 * @param {import('chokidar/handler.js').EventName} eventName
	 * @param {string} path
	 * @param {Stats} [stats]
	 * @returns {Promise<void>}
	 */
	#qCallbackMainIsHandled = async (eventName, path, stats) => {
		switch (eventName) {
			case 'add':
				break;
			default:
				await this.#esWatcherMap.get(path)?.vivthCleanup();
				this.#esWatcherMap.delete(path);
				this.#esbuildPathRebuild.delete(path);
				if (eventName !== 'change') {
					return;
				}
				break;
		}
		if (!stats || !stats.isFile()) {
			this.#esWatcherMap.get(path)?.vivthCleanup();
			return;
		}
		if (this.#esWatcherMap.has(path)) {
			return;
		}
		switch (extname(path)) {
			case '.mts':
			case '.mjs':
				await this.#jsHandler(eventName, path, stats);
				return;
			case '.html':
				await SSGDevMapper.#writeHTML(path, this.#postProcessDirectCopy);
				return;
			case '.scss':
			case '.sass':
				await SSGDevMapper.#bundleSCSS(path);
				return;
			default:
				await SSGDevMapper.#writeCommon(path, this.#postProcessDirectCopy);
				return;
		}
	};
	/**
	 * @param { string } path
	 * @returns { Promise<void> }
	 */
	static #bundleSCSS = async (path) => {
		const [targetPath__, errorGetTargetPath] = await SSGDevMapper.#getTargetPath(path);
		if (errorGetTargetPath) {
			Console.warn({ errorGetTargetPath, path });
			return;
		}
		const targetPath = targetPath__.targetPath;
		if (!targetPath) {
			return;
		}
		const result = (await compileAsync(path, { style: 'compressed' })).css;
		const [, errorWriteCSS] = await FileSafe.write(targetPath, result, {
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
				SSGDevMapper: `✅ Succeed convert '${path}' 👉 '${targetPath}';`,
			},
			{
				now: true,
			},
		);
	};
	/**
	 * @param { string } path
	 * @returns { ReturnType<typeof TryAsync<{
	 * 	targetPath: string|undefined;
	 * 	content: string;
	 * }>> }
	 */
	static #getTargetPath = (path) => {
		return TryAsync(async () => {
			let raw = await readFile(path, 'utf8');
			const perLines = raw.split(/\r?\n/);
			const perLinesCode = structuredClone(perLines);
			let targetPath;
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
				const pathCandidate = group.trim();
				if (
					!pathCandidate ||
					!/^(?:[A-Za-z]:[\\/]|[\\/]|\.{1,2}[\\/])?[A-Za-z0-9._\\/-]+$/g.test(pathCandidate)
				) {
					throw {
						pathCandidate,
						message: 'pathCandidate invalid for testRegex',
						testRegex: /^(?:[A-Za-z]:[\\/]|[\\/]|\.{1,2}[\\/])?[A-Za-z0-9._\\/-]+$/g,
					};
				}
				perLinesCode[i] = '';
				targetPath = Paths.normalize(pathCandidate);
				break;
			}
			return {
				get content() {
					let content = perLinesCode.join('\n').trim();
					// Remove leading whitespace-only lines until first non-whitespace
					return (content = content.replace(/^\s*\n+/, '').replace(/\n+/g, '\n'));
				},
				targetPath,
			};
		});
	};
	/**
	 * @type {undefined|Omit<Parameters<typeof import('esbuild')["context"]>[0], "write"|"minify"|"format"|"platform"|"mainFields"|"outfile"|"bundle"|"entryPoints">}
	 */
	#esbuildOptions;
	/**
	 * @type {undefined|import('esbuild').WatchOptions}
	 */
	#esbuildWatchOptions;
	/**
	 * @param {import('chokidar/handler.js').EventName} _eventName
	 * @param {string} path
	 * @param {Stats} _stats
	 */
	#jsHandler = async (_eventName, path, _stats) => {
		const [targetPath__, errorGetTargetPath] = await SSGDevMapper.#getTargetPath(path);
		if (errorGetTargetPath) {
			Console.warn({ errorGetTargetPath, path });
			return;
		}
		const targetPath = targetPath__.targetPath;
		if (!targetPath) {
			return;
		}
		const [esWatcherInstance, errorEsWatcherInstance] = TryNew(
			EsWatcher,
			{
				...this.#esbuildOptions,
				loader: {
					'.mjs': 'js',
					'.js': 'js',
					'.cjs': 'js',
				},
				write: true,
				logLevel: 'silent',
				banner: {
					js: targetPath.includes('.bin.') ? '#!/usr/bin/env node' : '',
					...this.#esbuildOptions?.banner,
				},
				entryPoints: [path],
				minify: true,
				platform: 'browser',
				format: 'esm',
				mainFields: ['module'],
				outfile: targetPath,
				bundle: true,
				plugins: [
					this.#autoExternalize(path, targetPath),
					...(this.#esbuildOptions?.plugins ?? []),
					pluginVivthBundle,
				],
			},
			this.#esbuildWatchOptions,
			this.#delay,
		);
		if (errorEsWatcherInstance) {
			Console.error({ errorEsWatcherInstance, path });
			return;
		}
		this.#esbuildPathRebuild.set(path, esWatcherInstance.rebuild);
		this.#esWatcherMap.set(path, esWatcherInstance);
	};
	/**
	 * @param { string } path
	 * @param { (path:{mapTo:string, src:string}, content:string)=>(string|false) } [postprosess]
	 * @returns { Promise<void> }
	 */
	static #writeCommon = async (path, postprosess) => {
		const [res, errorGetTargetPath] = await SSGDevMapper.#getTargetPath(path);
		if (errorGetTargetPath) {
			return;
		}
		const { content, targetPath } = res;
		if (!targetPath) {
			return;
		}
		/**
		 * @type {string|false}
		 */
		let trueContent;
		if (postprosess) {
			trueContent = postprosess({ mapTo: targetPath, src: path }, content);
		} else {
			trueContent = content;
		}
		if (trueContent === false) {
			return;
		}
		const [, errorWriteCommonFile] = await FileSafe.write(targetPath, trueContent, {
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
				SSGDevMapper: `✅ Succeed write '${path}' 👉 '${Paths.normalize(targetPath)}';`,
			},
			{
				now: true,
			},
		);
	};
	/**
	 * @param { string } path
	 * @param { (path:{mapTo:string, src:string}, content:string)=>(string|false) } [postprosess]
	 * @returns { Promise<void> }
	 */
	static #writeHTML = async (path, postprosess) => {
		const [res, errorGetTargetPath] = await SSGDevMapper.#getTargetPath(path);
		if (errorGetTargetPath) {
			return;
		}
		const { content: originalContent, targetPath } = res;
		if (!targetPath) {
			return;
		}
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

		let processedContent;
		if (postprosess) {
			postprosess({ mapTo: targetPath, src: path }, newContent);
		}
		const [, errorWriteHTML] = await FileSafe.write(
			targetPath,
			(!!processedContent ? processedContent : newContent).replace(/\s*minify\="[\s\S]*?"\s*/g, ''),
			{
				encoding: Preferrence.encoding,
			},
		);
		if (errorWriteHTML) {
			Console.error({ errorWriteHTML }, { now: true });
			return;
		}
		Console.info(`✅ Successfully map:'${path}' 👉:'${targetPath}'`, { now: true });
	};
	/**
	 * @type {Map<string, () => Promise<any>>}
	 */
	#esbuildPathRebuild = new Map();
	/**
	 * @type {Map<string, Set<string>>}
	 */
	#depMap = new Map();
	/**
	 * @param {string} path
	 * @param {string} targetPath
	 * @returns {import('esbuild').Plugin}
	 */
	#autoExternalize = (path, targetPath) => {
		return autoExternalize(
			path,
			targetPath,
			this.#watcherFullPath,
			'/',
			this.#depMap,
			this.#esbuildPathRebuild,
			this.#delay,
		);
	};
}
