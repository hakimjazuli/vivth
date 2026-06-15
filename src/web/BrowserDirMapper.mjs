// @ts-check

import { join, relative, dirname, resolve } from 'node:path';
import { readFile } from 'node:fs/promises';

import domino from 'domino';

import { pluginVivthBundle } from '../bundler/adds/pluginVivthBundle.mjs';
import { JSDirMapper } from '../bundler/JSDirMapper.mjs';
import { FSDirArchWatcher } from '../class/FSDirArchWatcher.mjs';
import { Paths } from '../class/Paths.mjs';
import { FileSafe } from '../class/FileSafe.mjs';
import { ForOfSync } from '../function/ForOfSync.mjs';
import { Console } from '../class/Console.mjs';
import { LastEditedUnix } from '../bundler/adds/LastEditedUnix.mjs';
import { Prettivy } from '../class/Prettivy.mjs';
import { SafeExit } from '../class/SafeExit.mjs';
import { Preferrence } from '../common/Preferrence.mjs';
import { NewDynamicsExport } from '../function/NewDynamicsExport.mjs';

/**
 * @typedef {import('../typehints/VivthCleanup.mjs').VivthCleanup} VivthCleanup
 */

/**
 * @description
 * - class helper to map dynamic mjs files;
 * >- includes `mts` file too;
 * @implements {VivthCleanup}
 */
export class BrowserDirMapper {
	vivthCleanup = async () => {
		SafeExit.instance?.removeCallback(this.#safeExitCallback);
	};
	/**
	 * @type {Set<string>}
	 */
	#setOfHtmlPaths = new Set();
	/**
	 * @type {Map<string, number>}
	 * - `fullpath`;
	 * - `fullpath?t=${lastEditedUnixValue}`;
	 */
	#mapOfAssets = new Map();
	/**
	 * @description
	 * - instantiate the mapper;
	 * @param {Object} path
	 * @param {string} path.watch
	 * @param {string} path.mapTo
	 * @param {(normalizedPath:string)=>boolean} [path.eachFilter]
	 * @param {ConstructorParameters<typeof JSDirMapper>[1] &
	 * 	{
	 * 		debounce?:number,
	 * 		chokidarOptions?:import('chokidar').ChokidarOptions
	 * 	}
	 * } options
	 * @example
	 * import { BrowserDirMapper } from 'vivth/node'
	 * import { Paths, SafeExit, BrowserDirMapper } from 'vivth/neutral';
	 *
	 * new Paths({
	 * 	root: process.env.INIT_CWD ?? process.cwd(),
	 * });
	 *
	 * new SafeExit();
	 *
	 * new BrowserDirMapper(
	 * 	{ mapTo: '/dist/', watch: '/src/' },
	 * 	{
	 * 		esbuild: {
	 * 			buildOptions: {
	 * 				minify: true,
	 * 			},
	 * 		},
	 * 	},
	 * );
	 */
	constructor({ watch, mapTo, eachFilter }, options) {
		this.#start({ watch, mapTo, eachFilter }, options);
		SafeExit.instance?.addCallback(this.#safeExitCallback);
	}
	#safeExitCallback = async () => {
		await Promise.all(
			ForOfSync(this.#setOfHtmlPaths, async (htmlTargetPath) => {
				const prettivy = new Prettivy(htmlTargetPath);
				const document = domino.createDocument(
					(await readFile(htmlTargetPath, { encoding: Preferrence.encoding })) ?? '',
				);
				const assetSelector = '[src], link[href], [srcset], object[data]';
				const elements = document.querySelectorAll(assetSelector);
				const htmlDirname = dirname(htmlTargetPath);
				await Promise.all(
					ForOfSync(elements, async (element) => {
						if (element.hasAttribute('src')) {
							const currentValue = element.getAttribute('src') ?? '';
							const assetPath = Paths.normalize(resolve(htmlDirname, currentValue));
							if (this.#mapOfAssets.has(assetPath)) {
								const timedAsset = `./${Paths.normalize(relative(htmlDirname, assetPath))}?t=${this.#mapOfAssets.get(assetPath)}`;
								element.setAttribute('src', timedAsset);
							}
							return;
						}
						if (element.hasAttribute('srcset')) {
							const currentValue = element.getAttribute('srcset') ?? '';
							const assetPath = Paths.normalize(resolve(htmlDirname, currentValue));
							if (this.#mapOfAssets.has(assetPath)) {
								const timedAsset = `./${Paths.normalize(relative(htmlDirname, assetPath))}?t=${this.#mapOfAssets.get(assetPath)}`;
								element.setAttribute('srcset', timedAsset);
							}
							return;
						}
						if (element.tagName.toLowerCase() === 'link' && element.hasAttribute('href')) {
							const currentValue = element.getAttribute('href') ?? '';
							const assetPath = Paths.normalize(resolve(htmlDirname, currentValue));
							if (this.#mapOfAssets.has(assetPath)) {
								const timedAsset = `./${Paths.normalize(relative(htmlDirname, assetPath))}?t=${this.#mapOfAssets.get(assetPath)}`;
								element.setAttribute('href', timedAsset);
							}
							return;
						}
						if (element.tagName.toLowerCase() === 'object' && element.hasAttribute('data')) {
							const currentValue = element.getAttribute('data') ?? '';
							const assetPath = Paths.normalize(resolve(htmlDirname, currentValue));
							if (this.#mapOfAssets.has(assetPath)) {
								const timedAsset = `./${Paths.normalize(relative(htmlDirname, assetPath))}?t=${this.#mapOfAssets.get(assetPath)}`;
								element.setAttribute('object', timedAsset);
							}
							return;
						}
					})[0],
				);
				const updatedHtml = document.documentElement.outerHTML;
				const finalFileString = await prettivy.format(`<!DOCTYPE html>\n${updatedHtml}`);
				await FileSafe.write(htmlTargetPath, finalFileString, { encoding: Preferrence.encoding });
				Console.info(`✅ Successfully patch '${htmlTargetPath}' assets path`);
			})[0],
		);
	};
	/**
	 * @param  {ConstructorParameters<typeof BrowserDirMapper>} args
	 */
	#start = async (...args) => {
		const [
			{ watch, mapTo, eachFilter },
			{
				esbuild: { buildOptions, watchOption },
				asTsToMjsHandler,
				chokidarOptions,
				debounce,
			},
		] = args;
		const watchPath = Paths.diskAbsolute(watch);
		const mapToPath = Paths.diskAbsolute(mapTo);
		const pathDynamic = Paths.normalize(join(watchPath, 'dynamics'));
		const dynamicImports = 'Dynamics';
		const pathGeneratedDynamicMapped = Paths.normalize(join(pathDynamic, `${dynamicImports}.mjs`));
		await Promise.all(
			ForOfSync([pathDynamic], async (path) => {
				FileSafe.exist(path).then(async (isExist) => {
					if (isExist) {
						return;
					}
					await FileSafe.mkdir(path);
				});
			})[0],
		);
		const isExist = await FileSafe.exist(pathGeneratedDynamicMapped);
		if (!isExist) {
			const [, errorWriteInitialDynamicMapped] = await FileSafe.write(
				pathGeneratedDynamicMapped,
				'',
				{
					encoding: 'utf-8',
				},
			);
			if (errorWriteInitialDynamicMapped) {
				Console.error(
					{
						BrowserDirMapper: `❌ Error to write '${pathGeneratedDynamicMapped}'`,
						errorWriteInitialDynamicMapped,
					},
					{ now: true },
				);
				return;
			}
		}
		const [dynamicDirWatcher, errorCreatingDynamicsWatcher] = await NewDynamicsExport({
			rootPath: watchPath,
			debounce,
			chokidarOptions,
			eachFilter,
		});
		if (errorCreatingDynamicsWatcher) {
			Console.error({ errorCreatingDynamicsWatcher });
			return;
		}
		this.dynamicDirWatcher = dynamicDirWatcher;
		dynamicDirWatcher.watcher._addIgnoredPath(pathGeneratedDynamicMapped);
		this.dirMapper = new JSDirMapper(
			{
				mapTo: mapToPath,
				watch: watchPath,
				filter: async ({ source, eventName, target }) => {
					switch (eventName) {
						case 'add':
							if (target.endsWith('.html')) {
								this.#setOfHtmlPaths.add(target);
							} else {
								this.#mapOfAssets.set(target, await LastEditedUnix(source));
							}
							break;
						case 'error':
						case 'unlink':
							if (target.endsWith('.html')) {
								this.#setOfHtmlPaths.delete(target);
							} else {
								this.#mapOfAssets.delete(target);
							}
							break;
					}
					return { shouldProcessDefault: true };
				},
			},
			{
				esbuild: {
					/** */
					buildOptions: {
						...buildOptions,
						platform: 'browser',
						plugins: [
							/** */
							pluginVivthBundle,
							...(buildOptions.plugins ?? []),
						],
					},
					watchOption,
				},
				asTsToMjsHandler,
			},
		);
	};
	/**
	 * @description
	 * - `FSDirArchWatcher` instance;
	 * @type {FSDirArchWatcher<any>|undefined}
	 */
	dynamicDirWatcher;
	/**
	 * @description
	 * - `JSDirMapper` instance;
	 * @type {JSDirMapper<any>|undefined}
	 */
	dirMapper;
}
