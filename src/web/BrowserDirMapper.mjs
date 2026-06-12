// @ts-check

import { extname, join, relative, dirname, resolve } from 'node:path';
import { readFile } from 'node:fs/promises';

import { lookup } from 'mime-types';
import domino from 'domino';

import { pluginVivthBundle } from '../bundler/adds/pluginVivthBundle.mjs';
import { JSDirMapper } from '../bundler/JSDirMapper.mjs';
import { FSDirArchWatcher } from '../class/FSDirArchWatcher.mjs';
import { Paths } from '../class/Paths.mjs';
import { FileSafe } from '../class/FileSafe.mjs';
import { ForOfSync } from '../function/ForOfSync.mjs';
import { Console } from '../class/Console.mjs';
import { ForEach } from '../class/ForEach.mjs';
import { LastEditedUnix } from '../bundler/adds/LastEditedUnix.mjs';
import { Prettivy } from '../class/Prettivy.mjs';
import { TryAsync } from '../function/TryAsync.mjs';
import { SafeExit } from '../class/SafeExit.mjs';
import { Preferrence } from '../common/Preferrence.mjs';

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
		const jsPrettivy = new Prettivy(pathGeneratedDynamicMapped);
		this.dirWatcher = new FSDirArchWatcher([pathDynamic], {
			debounce,
			chokidarOptions,
			each: async (eventName, path, stats) => {
				if (eachFilter && !eachFilter(path)) {
					throw '';
				}
				if (path === pathGeneratedDynamicMapped) {
					throw '';
				}
				switch (eventName) {
					case 'add':
					case 'change':
						if (!stats?.isFile()) {
							throw '';
						}
						break;
					default:
						throw '';
				}
				const extension = extname(path);
				switch (extension) {
					case '.mts':
					case '.mjs':
						return {
							handler: 'importable',
							mime: lookup(path),
							lastEditedUnixValue: await LastEditedUnix(path),
						};
					case '.ts':
					case '.js':
						Console.warn({
							path,
							extension,
							message: `BrowserDirMapper /dynamics/ doesn't handle '${extension}' file, use '.mts' or '.mjs' instead`,
						});
						throw ``;
					case '.wasm':
						Console.warn({
							path,
							extension,
							message: `BrowserDirMapper /dynamics/ doesn't handle '${extension}' file`,
						});
						throw ``;
					default:
						let mime;
						switch (extension) {
							case '.sass':
							case '.scss':
								throw '';
							default:
								mime = lookup(path);
								break;
						}
						return {
							handler: 'fetchable',
							mime,
							lastEditedUnixValue: await LastEditedUnix(path),
						};
				}
			},
			full: async ({ array }) => {
				/**
				 * @type {string[]}
				 */
				const content = [];
				/**
				 * @type {Map<string, string>}
				 */
				const types = new Map();
				/**
				 * @type {string[]}
				 */
				const cssList = [];
				/**
				 * @type {string[]}
				 */
				const withMimeNotCSS = [];
				/**
				 * @type {string[]}
				 */
				const moduleImports = [];
				const cssMime = 'text/css';
				ForEach.array(array, ([path, { handler, mime, lastEditedUnixValue }]) => {
					if (!handler) {
						return;
					}
					const relativePath = Paths.normalize(relative(pathDynamic, path));
					switch (handler) {
						case 'fetchable':
							if (!mime) {
								Console.error(
									{
										path,
										message: `path is ignored due to, unable to check fetchable mime-type`,
									},
									{ now: true },
								);
							} else {
								const typeName = `${mime.replace(/\//g, '_')}Mime`;
								if (!types.has(mime)) {
									let defintion;
									if (mime !== cssMime) {
										defintion = ` * @typedef { string & { __mime: '${mime}' } } ${typeName}`;
									} else {
										defintion = '';
									}
									types.set(mime, defintion);
								}
								let returnType = '';
								if (mime !== cssMime) {
									returnType = `/** @type { Promise<${typeName}> } */\n`;
								}
								let pseudoImporter;
								let exprectingError;
								if (mime === cssMime) {
									pseudoImporter = `getCSS('./${relativePath}?t=${lastEditedUnixValue}');`;
									exprectingError = '';
									cssList.push(
										`${returnType}get '${relativePath}'() {${exprectingError}return ${pseudoImporter}},`,
									);
								} else {
									pseudoImporter = `fetch_('./${relativePath}?t=${lastEditedUnixValue}');`;
									exprectingError = '\n// @ts-expect-error\n';
									withMimeNotCSS.push(
										`${returnType}get '${relativePath}'() {${exprectingError}return ${pseudoImporter}},`,
									);
								}
							}
							break;
						case 'importable':
							moduleImports.push(
								`get '${relativePath.replace(/\.m/, '-').replace('-js', '')}'(){return import('./${relativePath}' /** @version ${lastEditedUnixValue} */);},`,
							);
							break;
					}
				});
				/**
				 * @type {string[]}
				 */
				const mimeTypeHandlers = [];
				ForOfSync(types, ([, fullTypeVal]) => {
					if (!fullTypeVal) {
						return;
					}
					mimeTypeHandlers.push(fullTypeVal);
				});
				const helpers = ['// @ts-check'];
				if (withMimeNotCSS.length) {
					mimeTypeHandlers.unshift('/**');
					mimeTypeHandlers.push(' */');
				}
				if (cssList.length || withMimeNotCSS.length) {
					if (types.has(cssMime)) {
						helpers.push(`import { NewStyleSheetAsync } from 'vivth/neutral';`);
					}
					helpers.push('const metaURL = import.meta.url;');
					helpers.push(
						`/** @param {string} url */\nconst fetch_ = (url) => fetch(new URL(url, metaURL).href).then((r) => r.text());`,
					);
					if (types.has(cssMime)) {
						helpers.push(`const mappedCSS = new Map();
	/** @type { (url: string) => Promise<CSSStyleSheet>} */
	const getCSS = (url) => { 
	if (!mappedCSS.has(url)) {
	const sheetPromise = fetch_(url).then(text => NewStyleSheetAsync(text));
	mappedCSS.set(url, sheetPromise);
	}
	return mappedCSS.get(url);
	};`);
					}
				}
				content.unshift(
					...helpers,
					mimeTypeHandlers.join('\n'),
					`export const ${dynamicImports} = {`,
				);
				ForOfSync(
					[
						{ arr: moduleImports, name: 'modules' },
						{ arr: cssList, name: 'css' },
						{ arr: withMimeNotCSS, name: 'commons' },
					],
					({ arr, name }) => {
						if (!arr.length) {
							return;
						}
						content.push(`${name}:{`);
						content.push(...arr);
						content.push('},');
					},
				);
				content.push('};');
				const preFormated = `${content.join('\n')}\n`;
				const [contentFormatted, errorFormatting] = await TryAsync(async () => {
					return await jsPrettivy.format(preFormated);
				});
				if (errorFormatting) {
					Console.error(
						{
							BrowserDirMapper: `❌ Error to formatting '${pathGeneratedDynamicMapped}'`,
							errorFormatting,
						},
						{ now: true },
					);
					return;
				}
				const [, errorWritePrettifiedDynamicMapped] = await FileSafe.write(
					pathGeneratedDynamicMapped,
					contentFormatted,
					{ encoding: 'utf-8' },
				);
				if (errorWritePrettifiedDynamicMapped) {
					Console.error(
						{
							BrowserDirMapper: `❌ Error to write '${pathGeneratedDynamicMapped}'`,
							errorWritePrettifiedDynamicMapped,
						},
						{ now: true },
					);
					return;
				}
				Console.info(
					{
						BrowserDirMapper: `✅ Successfully write '${pathGeneratedDynamicMapped}'`,
					},
					{ now: true },
				);
			},
		});
		this.dirWatcher.watcher._addIgnoredPath(pathGeneratedDynamicMapped);
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
	dirWatcher;
	/**
	 * @description
	 * - `JSDirMapper` instance;
	 * @type {JSDirMapper<any>|undefined}
	 */
	dirMapper;
}
