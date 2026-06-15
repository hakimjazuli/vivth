// @ts-check

import { extname, join, relative } from 'node:path';

import { lookup } from 'mime-types';

import { FSDirArchWatcher } from '../class/FSDirArchWatcher.mjs';
import { TryAsync } from './TryAsync.mjs';
import { Console } from '../class/Console.mjs';
import { LastEditedUnix } from '../bundler/adds/LastEditedUnix.mjs';
import { ForEach } from '../class/ForEach.mjs';
import { Paths } from '../class/Paths.mjs';
import { ForOfSync } from './ForOfSync.mjs';
import { FileSafe } from '../class/FileSafe.mjs';
import { Prettivy } from '../class/Prettivy.mjs';

/**
 * @description
 * generate generator watcher to `Dynamics`;
 * 1) `./dynamics`: directory;
 * 2) `./dynamics/**[blank]/*`(except 3)): watched source for 3);
 * 3) `./dynamics/Dynamics.mjs`: collection of `modules`|`css`|`commonFile`(with `mimeTypes`);
 * - this module assumes [Paths](#paths) to be already instantiated;
 * @param {Object} options
 * @param {string} options.rootPath
 * - relative path to pseudo root;
 * @param {number} [options.debounce]
 * @param {boolean} [options.useFetchForAssets]
 * - default: `true`;
 * >- non js file will be `fetch`ed;
 * - `false`;
 * >- will use `import` instead;
 * >- useful for vite Plugin;
 * @param {import('chokidar').ChokidarOptions} [options.chokidarOptions]
 * @param {(normalizedPath:string)=>boolean} [options.eachFilter]
 * @returns {ReturnType<typeof TryAsync<FSDirArchWatcher<{ handler: string; mime: string | false; lastEditedUnixValue: number; }>>>}
 */
export function NewDynamicsExport(
	/** */
	{ rootPath, useFetchForAssets = true, debounce, chokidarOptions, eachFilter },
) {
	const dynamicImports = 'Dynamics';
	const pathDynamic = Paths.diskAbsolute(join(rootPath, 'vivth', dynamicImports.toLowerCase()));
	const pathGeneratedDynamicMapped = Paths.normalize(join(pathDynamic, `${dynamicImports}.mjs`));
	const jsPrettivy = new Prettivy(pathGeneratedDynamicMapped);
	return TryAsync(async () => {
		return new FSDirArchWatcher([pathDynamic], {
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
								let exprectingError = '';
								if (mime === cssMime) {
									if (useFetchForAssets) {
										pseudoImporter = `return getCSS('./${relativePath}?t=${lastEditedUnixValue}');`;
									} else {
										pseudoImporter = `return getCSS('./${relativePath}',\n// @ts-expect-error\n import('./${relativePath}?inline'));`;
									}
									cssList.push(
										`${returnType}get '${relativePath}'() {${exprectingError}${pseudoImporter}},`,
									);
								} else {
									if (useFetchForAssets) {
										pseudoImporter = `fetch_('./${relativePath}?t=${lastEditedUnixValue}');`;
									} else {
										pseudoImporter = `fetch_(import('./${relativePath}?raw'));`;
									}
									exprectingError = '\n// @ts-expect-error\n';
									withMimeNotCSS.push(
										`${returnType}get '${relativePath}'() {${exprectingError}return ${pseudoImporter}},`,
									);
								}
							}
							break;
						case 'importable':
							let version = '';
							if (useFetchForAssets) {
								version = ` /** @version ${lastEditedUnixValue} */`;
							}
							moduleImports.push(
								`get '${relativePath.replace(/\.m/, '-').replace('-js', '')}'(){return import('./${relativePath}' ${version});},`,
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
					if (useFetchForAssets) {
						helpers.push('const metaURL = import.meta.url;');
						helpers.push(
							`/** @param {string} url */\nconst fetch_ = (url) => fetch(new URL(url, metaURL).href).then((r) => r.text());`,
						);
					} else if (withMimeNotCSS.length) {
						helpers.push(
							`/** @param {Promise<string>} imported */\nconst fetch_ = (imported)=> imported.then((r) =>
// @ts-expect-error
r.default);`,
						);
					}
					if (types.has(cssMime)) {
						helpers.push(`const mappedCSS = new Map();`);
						if (useFetchForAssets) {
							helpers.push(`/** @type { (url: string) => Promise<CSSStyleSheet>} */
const getCSS = (url) => {
	if (!mappedCSS.has(url)) {
		const sheetPromise = fetch_(url).then((text) => NewStyleSheetAsync(text));
		mappedCSS.set(url, sheetPromise);
	}
	return mappedCSS.get(url);
};
`);
						} else {
							helpers.push(`/** @type { (url: string, imported:Promise<string>) => Promise<CSSStyleSheet>} */
const getCSS = (url, imported) => {
	if (!mappedCSS.has(url)) {
		const sheetPromise = imported.then((text) =>
			// @ts-expect-error
			NewStyleSheetAsync(text.default));
		mappedCSS.set(url, sheetPromise);
	}
	return mappedCSS.get(url);
};
`);
						}
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
	});
}
