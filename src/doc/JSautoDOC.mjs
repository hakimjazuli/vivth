// @ts-check

import { extname } from 'node:path';
import { readFile } from 'node:fs/promises';

import prettier from 'prettier';

import { FileSafe } from '../class/FileSafe.mjs';
import { ForEach } from '../class/ForEach.mjs';
import { FSDirArchWatcher } from '../class/FSDirArchWatcher.mjs';
import { JSONFileHandler } from '../class/JSONFileHandler.mjs';
import { Paths } from '../class/Paths.mjs';
import { IsSameFile } from '../function/IsSameFile.mjs';
import { LazyFactory } from '../function/LazyFactory.mjs';
import { TryAsync } from '../function/TryAsync.mjs';
import { parsedFileForDOC } from './parsedFileForDOC.mjs';
import { Preferrence } from '../common/Preferrence.mjs';
import { basename, join } from 'node:path';
import { TsToMjs } from '../function/TsToMjs.mjs';
import { Console } from '../class/Console.mjs';
import { correctBeforeParse } from './correctBeforeParse.mjs';
import { GetterSetter } from '../class/GetterSetter.mjs';
import { ForOfSync } from '../function/ForOfSync.mjs';
import { TryNew } from '../function/TryNew.mjs';
import { cleanPreserveTypedef } from './cleanPreserveTypedef.mjs';

export const multiExportEntryPointsPath = './generated/vivth/exports/';

/**
 * @typedef {import('../typehints/VivthCleanup.mjs').VivthCleanup} VivthCleanup
 */

/**
 * @description
 * - class for auto documenting mjs package/project, using jsdoc;
 * - this autodocumenter uses [chokidar](https://npmjs.com/package/chokidar) under the hood;
 * - this class also is used to generate this `README.md`;
 * - behaviours:
 * >- auto export must follows the following rules;
 * >1) add `"at"noautodoc` on self closing jsdoc comment to opt out from generating documentation on said file;
 * >2) will (generate) export all named exported 'const'|'function'|'async function'|'class', alphanumeric name, started with Capital letter, same name with fileName on `options.paths.file`;
 * >3) will (generate) declare typedef of existing typedef with alphanumeric name, started with Capital letter, same name with fileName, and have no valid export like on point <sup>1</sup> on `options.paths.file`;
 * >4) will (generate) create `README.md` based on, `options.paths.dir` and `README.src.md`;
 * >5) extract `"at"description` jsdoc:
 * >>- on static/prop that have depths, all of children should have `"at"static`/`"at"instance` `nameOfImmediateParent`, same block but before `"at"description` comment line;
 * >>- `"at"description` are treated as plain `markdown`;
 * >>- first `"at"${string}` after `"at"description` until `"at"example` will be treated as `javascript` comment block on the `markdown`;
 * >>- `"at"example` are treated as `javascript` block on the `markdown` file, and should be placed last on the same comment block;
 * >>- you can always look at `vivth/src` files to check how the source, and the `README.md` and `index.mjs` documentation/generation results;
 * >6) this types of arrow functions will be converted to regullar function, for concise type emition, includes:
 * >>- validly exported function;
 * >>- static/instance method with generic template;
 * >7) transpile `.ts` and `.mts` to `.mjs` with same name and directory;
 * >>- use `"at"preserve` to preserve tsdoc comment section;
 * >8) integrated with assembly script to wasm compiler on the doc;
 * >>- see [AssemblyScript](#assemblyscript);
 * >9) modify following root json files:
 * >>- `package.json`: assign `exports`, `main`, `module`;
 * >>- `tsconfig.json`: assign `includes`, anything passed on `options.jstsconfigs`;
 * >>- `jsconfig.json`: assign `includes`, anything passed on `options.jstsconfigs`;
 * >10) generates files to `/generated/vivth/exports/`:
 * >>- `./browser.mjs`: able to be called on `browser` platform;
 * >>- `./node.mjs`:  able to be called on `node` platform;
 * >>- `./neutral.mjs`: able to be called on `node` and `browser` platform;
 * >>- `./unsupported.mjs`: most likely will throw error when called, it is more of a logged error to be managed;
 * >>- `./all.mjs`: collections of all platform;
 * >11) doesn't support accessor;
 * >>- due to how TLS way accessor type not casting its getter and setter working around accessor requires ignoring this specific error, and it might become ugly real quick;
 * >>- we recomend to stick with getter and setter;
 * - for runtime example see file `/dev/auto-doc.mjs` on source code;
 * @implements {VivthCleanup}
 */
export class JSautoDOC {
	vivthCleanup = async () => {
		await this.watcher?.vivthCleanup();
	};
	/**
	 * @typedef {'readme' |
	 *  'handledJS'
	 * } returnTypeStringType
	 */
	/**
	 * @typedef {FSDirArchWatcher<{
	 *     path: string;
	 *     parsed: undefined;
	 *     ext: `.${string}`;
	 *     type: returnTypeStringType;
	 *     readme?:string;
	 * } | {
	 *     path: string;
	 *     parsed: parsedFileForDOC;
	 *     ext: string;
	 *     type: returnTypeStringType;
	 *     readme?:string;
	 * }>} FSDirArchWatcher__
	 */
	/**
	 * @type {JSautoDOC|undefined}
	 */
	static #instance;
	/**
	 * @description
	 * @param {Object} options
	 * @param {string} options.src
	 * - source directory;
	 * @param {string} [options.copyright]
	 * @param {string} [options.tableOfContentTitle]
	 * @param {number} [options.maxDebounceForGeneratingDocAndExport]
	 * - default `1_000`;
	 * @param {import('chokidar').ChokidarOptions} [options.chokidarOptions]
	 * - ChokidarOptions;
	 * @param {import('../typehints/AutoDocASOptions.mjs').AutoDocASOptions} [options.assemblyScriptOptions]
	 * - abstracted details to handle `.as.ts` file;
	 * @param {(arg0:{map:Map<string, {
	 *     path: string;
	 *     parsed: undefined;
	 *     ext: `.${string}`;
	 *     type: returnTypeStringType;
	 *     readme?:string;
	 * } | {
	 *     path: string;
	 *     parsed: parsedFileForDOC;
	 *     ext: string;
	 *     type: returnTypeStringType;
	 *     readme?:string;
	 * }>})=>Promise<void>} [options.onLastGeneratedCallback]
	 * - callback to be run on finishing generating document AND exports;
	 * - only handle that marked as `isLastCalled`;
	 * @param {import('typescript/unstable/sync').CompilerOptions} [options.jstsconfigs]
	 * - type of `ts/jsconfig` to be assigned to existing respective `.json` file;
	 * @example
	 * import { JSautoDOC } from 'vivth/node';
	 *
	 * new JSautoDOC({
	 * 	src: '/src',
	 * 	copyright: 'this library is made and distributed under MIT license;',
	 * 	tableOfContentTitle: 'list of exported API and typehelpers',
	 * 	// assemblyScriptOptions: {},
	 * 	// onLastGeneratedCallback: async (options) => {
	 * 	// 	Console.log(options);
	 * 	// },
	 * });
	 */
	constructor({
		src = './src',
		onLastGeneratedCallback = undefined,
		tableOfContentTitle = 'exported-api-and-type-list',
		copyright = '',
		maxDebounceForGeneratingDocAndExport = 1_000,
		assemblyScriptOptions = undefined,
		chokidarOptions = undefined,
		jstsconfigs = undefined,
	}) {
		if (JSautoDOC.#instance instanceof JSautoDOC) {
			return JSautoDOC.#instance;
		}
		JSautoDOC.#instance = this;
		this.#onLastGeneratedCallback = onLastGeneratedCallback;
		this.#tableOfContentTitle = tableOfContentTitle;
		this.#source = src;
		this.#copyright = copyright;
		this.#assemblyScriptOptions = assemblyScriptOptions;
		this.#readmePath = Paths.diskAbsolute('/README.src.md');
		Promise.all([
			this.#jstsConfigAddInclude('/tsconfig.json', jstsconfigs),
			this.#jstsConfigAddInclude('/jsconfig.json', jstsconfigs),
		]);
		FileSafe.exist(this.#readmePath).then(async (isExist) => {
			if (isExist) {
				return;
			}
			await this.#writeREADMEDefaultSRC();
		});
		const [fsDirArchWatcher, errorfsDirArchWatcherInstance] = TryNew(
			FSDirArchWatcher,
			[src, this.#readmePath],
			{
				debounce: maxDebounceForGeneratingDocAndExport,
				chokidarOptions,
				/**
				 * @type {FSDirArchWatcher__["eachHandler"]}
				 */
				each: async (eventName, path, stats) => {
					/**
					 * @type {`.${string}`}
					 */
					// @ts-expect-error
					const ext = extname(path);
					const readMeHandled = await this.checkReadmeFile(path);
					if (readMeHandled.isBeingHandled) {
						return { path, parsed: undefined, readme: readMeHandled.content, ext, type: 'readme' };
					}
					if (!this.#acceptableExt.has(ext)) {
						throw '';
					}
					if (basename(path).endsWith(`.d${ext}`)) {
						const renamedPath = path.replace(new RegExp(`.d${ext}$`), ext);
						await FileSafe.rename(path, renamedPath);
						throw '';
					}
					switch (eventName) {
						case 'add':
						case 'change':
							if (ext !== '.mjs') {
								await TsToMjs(path, {
									encoding: Preferrence.encoding,
									assemblyScriptOptions: this.#assemblyScriptOptions,
								});
								throw '';
							}
							if (!stats?.isFile()) {
								throw '';
							}
							if (await FileSafe.exist(path.replace(/.mjs$/, '.mts'))) {
								const newString = cleanPreserveTypedef(
									await readFile(path, { encoding: Preferrence.encoding }),
								);
								if (newString) {
									await FileSafe.write(path, newString, { encoding: Preferrence.encoding });
								}
							}
							return await this.#addAndChangesHandler(ext, path, stats);
						default:
							/**
							 * - auto deleted from the map so need to call `.delete`
							 */
							throw '';
					}
				},
				// @ts-expect-error
				full: this.#fullHandler,
			},
		);
		if (errorfsDirArchWatcherInstance) {
			Console.error({ errorfsDirArchWatcherInstance });
			return;
		}
		this.watcher = fsDirArchWatcher;
	}
	/**
	 * @type { FSDirArchWatcher<any>|undefined }
	 */
	watcher;
	/**
	 * @type {string}
	 */
	#source = './src';
	#packageJSONHandler = LazyFactory(() => new JSONFileHandler('/package.json'));
	/**
	 * @type {Set<import('../typehints/ExtnameType.mjs').ExtnameType>}
	 */
	#acceptableExt = new Set(['.js', '.mjs', '.mts', '.ts']);
	/**
	 * @param {string} configPath
	 * @param {ConstructorParameters<typeof JSautoDOC>[0]["jstsconfigs"]} jstsconfigs
	 */
	#jstsConfigAddInclude = async (configPath, jstsconfigs) => {
		return await TryAsync(async () => {
			if (!(await FileSafe.exist(Paths.diskAbsolute(configPath)))) {
				return;
			}
			const handler = new JSONFileHandler(configPath);
			const [object, error] = await handler.read();
			if (error) {
				return;
			}
			const include =
				// @ts-expect-error
				new Set(object.include ?? []);
			include.add(`.${Paths.normalizeForRoot(this.#source)}`);
			include.add('./generated/vivth/exports');
			const obj = { include: Array.from(include) };
			if (!jstsconfigs) {
				Object.assign(obj, jstsconfigs);
			}
			await handler.assign(obj);
		});
	};
	/**
	 * @type {ConstructorParameters<typeof JSautoDOC>[0]["onLastGeneratedCallback"]}
	 */
	#onLastGeneratedCallback;
	/**
	 * @type {string|undefined}
	 */
	#tableOfContentTitle;
	/**
	 * @type {string|undefined}
	 */
	#copyright;
	/**
	 * @type {string}
	 */
	// @ts-expect-error
	#readmePath;
	/**
	 * @type { string }
	 */
	#readme = Paths.diskAbsolute('./README.md');
	/**
	 * @type { import('../typehints/AutoDocASOptions.mjs').AutoDocASOptions|undefined }
	 */
	#assemblyScriptOptions;
	/**
	 * @param {string} path
	 * @returns {Promise<{isBeingHandled:boolean, content?: string}>}
	 * - is being handled;
	 */
	checkReadmeFile = async (path) => {
		const isREADMEPATH = IsSameFile(this.#readmePath, path);
		if (!isREADMEPATH) {
			return { isBeingHandled: false };
		}
		let content = '';
		if (!(await FileSafe.exist(this.#readmePath))) {
			await FileSafe.write(this.#readmePath, `README HEADER PLACEHOLDER`, {
				encoding: Preferrence.encoding,
			});
		}
		const [res] = await TryAsync(async () => {
			return await readFile(path, { encoding: Preferrence.encoding });
		});
		if (!!res) {
			content = res;
		}
		return { isBeingHandled: true, content };
	};
	/**
	 * @param {`.${string}`} extentionName
	 * @param {string} path
	 * @param {import('fs').Stats} [stats]
	 * @returns {Promise<{
	 *     path: string;
	 *     parsed: undefined;
	 *     ext: `.${string}`;
	 *     type: returnTypeStringType;
	 * } | {
	 *     path: string;
	 *     parsed: parsedFileForDOC;
	 *     ext: string;
	 *     type: returnTypeStringType;
	 * }>}
	 */
	#addAndChangesHandler = async (extentionName, path, stats) => {
		const [checkCorrectBeforeParse, errorCorrectBeforeParse] = await TryAsync(async () => {
			return await correctBeforeParse(path, Preferrence.encoding);
		});
		if (errorCorrectBeforeParse) {
			Console.error({ errorCorrectBeforeParse }, { now: true });
			throw '';
		}
		switch (checkCorrectBeforeParse) {
			case 'shouldProceedNextCheck':
				const parsed = new parsedFileForDOC(path, stats);
				await parsed.parse();
				return { ext: extentionName, parsed, path, type: 'handledJS' };
			default:
				throw '';
		}
	};
	/**
	 * @returns {Promise<void>}
	 */
	#writeREADMEDefaultSRC = async () => {
		await this.#readmeSourceGetterSetter.set?.(`---\n---\n---\nREADME SRC PLACEHOLDER\n---\n---\n`);
	};
	#readmeSourceGetterSetter = new GetterSetter({
		get: async () => {
			return await readFile(this.#readmePath, { encoding: Preferrence.encoding });
		},
		/**
		 * @param {string} content
		 */
		set: async (content) => {
			await FileSafe.write(this.#readmePath, content, { encoding: Preferrence.encoding });
		},
	});

	/**
	 * @param { string } [exporter]
	 * @param { string } [typedefString]
	 * @returns { string }
	 */
	#generateSingularMJSExportAndType = (exporter, typedefString) => {
		let content = '';
		if (exporter) {
			content += exporter ?? '';
		}
		if (exporter && typedefString) {
			content += '\n';
		}
		if (typedefString) {
			content += typedefString ?? '';
		}
		return content;
	};

	/**
	 * @param { string[] } array
	 * @returns { string[] }
	 */
	#cleanupArrayString = (array) => {
		return array.filter((s) => s.trim() !== '');
	};

	/**
	 * @param {[path: string, {
	 *     path: string;
	 *     parsed: undefined;
	 *     ext: `.${string}`;
	 *     type: returnTypeStringType;
	 *     readme?: string;
	 * } | {
	 *     path: string;
	 *     parsed: parsedFileForDOC;
	 *     ext: string;
	 *     type: returnTypeStringType;
	 *     readme?: string;
	 * }][]} array
	 * @returns {Promise<{
	 * 	readme:string,
	 * 	platforms:{
	 * 		node:string,
	 * 		browser:string,
	 * 		neutral:string,
	 * 		unsupported:string,
	 * 		all:string,
	 * 	},
	 * }|undefined>}
	 */
	#generateFromSRC = async (array) => {
		const contentSRC = (await this.#readmeSourceGetterSetter.get?.()) ?? '';
		if (this.#tableOfContentTitle === undefined || this.#copyright === undefined) {
			return;
		}
		const tableID = this.#tableOfContentTitle.replace(/\s+/g, '-').toLowerCase();
		/**
		 * @type { string[] }
		 */
		const tableOfContent = [];
		/**
		 * @type { string[] }
		 */
		const apiDocuments = [];
		/**
		 * @type { Array<string> }
		 */
		const all = [];
		/**
		 * @type { Array<string> }
		 */
		const node = [];
		/**
		 * @type { Array<string> }
		 */
		const browser = [];
		/**
		 * @type { Array<string> }
		 */
		const neutral = [];
		/**
		 * @type { Array<string> }
		 */
		const unsupported = [];

		await Promise.all(
			ForEach.array(array, async ([, { parsed }], i) => {
				if (!parsed) {
					return;
				}
				const {
					documented,
					content,
					hasValidExportObject,
					path: { relative: relativePath },
					baseName: { noExt },
					platform,
				} = parsed;
				const awaitedPlatform = await platform;
				const trueContent = await content.string();
				if (trueContent === undefined) {
					return;
				}
				const hasNoAutoDoc = /\/\*\*[\s\*]*?@noautodoc[\s\*]*?\*\//.test(trueContent);
				/**
				 * @type { undefined|string }
				 */
				let comprehensiveExporter;
				if (hasValidExportObject) {
					comprehensiveExporter = `export { ${noExt} } from '${
						relativePath.startsWith('.') ? relativePath : `./${relativePath}`
					}';`;
				}
				/**
				 * @type {string[]}
				 */
				const currentDescription = [];
				const { readme, typedef } = documented;
				const [typedefString] = await TryAsync(async () => {
					if (hasValidExportObject) {
						throw 'has no valid export object';
					}
					const result = await typedef();
					return result;
				});
				/**
				 * @type { undefined|string }
				 */
				let comprehensiveTypedefString;
				if (typedefString) {
					const typedefStringModule = typedefString.module;
					comprehensiveTypedefString = typedefStringModule;
					if (!hasNoAutoDoc) {
						const nameVarID = noExt.toLowerCase();
						tableOfContent[i] =
							tableOfContent[i] ?? '' + `[${awaitedPlatform}.${noExt}](#${nameVarID})`;
						apiDocuments[i] =
							apiDocuments[i] ??
							'' +
								`<h2 id="${nameVarID}">${awaitedPlatform}.${noExt}</h2>\n\n- jsdoc types:\n\n\`\`\`js\n${
									/** */
									typedefString.readme.replace(/\[at\]/g, '@').replace(/\[blank\]/g, '[]')
								}\n\`\`\`\n*) <sub>[go to ${this.#tableOfContentTitle}](#${tableID})</sub>\n\n---`;
					}
				}
				if (!hasNoAutoDoc && hasValidExportObject) {
					ForOfSync(
						readme,
						({
							// fullDescription,
							// instanceOrStatic,
							// namedVar,
							// typeOfVar,
							parsedFullDescription,
							reference,
						}) => {
							const { description, jsPreview } = parsedFullDescription;
							currentDescription.push(
								`\n#### reference: ${reference}\n${description}\n${jsPreview}`.replace(
									/\[blank\]/g,
									'',
								),
							);
						},
					);
					const nameVarID = noExt.toLowerCase();
					tableOfContent[i] =
						tableOfContent[i] ?? '' + `[${awaitedPlatform}.${noExt}](#${noExt.toLowerCase()})`;
					apiDocuments[i] =
						apiDocuments[i] ??
						'' +
							`<h2 id="${nameVarID}">${awaitedPlatform}.${noExt}</h2>\n\n-current-description-to-replace-\n\n*) <sub>[go to ${
								this.#tableOfContentTitle
							}](#${tableID})</sub>\n\n---`.replace(
								'-current-description-to-replace-',
								currentDescription.join('\n'),
							);
				}

				const collectedExportContent = this.#generateSingularMJSExportAndType(
					comprehensiveExporter,
					comprehensiveTypedefString,
				);
				if (collectedExportContent) {
					all[i] = collectedExportContent;
				}

				switch (awaitedPlatform) {
					case 'node':
						{
							if (collectedExportContent) {
								node[i] = collectedExportContent;
							}
						}
						break;
					case 'browser':
						{
							if (collectedExportContent) {
								browser[i] = collectedExportContent;
							}
						}
						break;
					case 'neutral':
						{
							if (collectedExportContent) {
								neutral[i] = collectedExportContent;
							}
						}
						break;
					default:
					case 'unsupported':
						{
							if (collectedExportContent) {
								unsupported[i] = collectedExportContent;
							}
						}
						break;
				}
			}),
		);
		const tableOfContentString = `<h2 id="${this.#tableOfContentTitle
			.replace(/\s+/g, '-')
			.toLowerCase()}">${
			this.#tableOfContentTitle
		}</h2>\n\n - -table-of-content-to-replace-\n\n---\n\n-api-document-to-replace-`
			.replace(
				'-table-of-content-to-replace-',
				this.#cleanupArrayString(tableOfContent).join('\n - '),
			)
			.replace('-api-document-to-replace-', this.#cleanupArrayString(apiDocuments).join('\n\n'));

		const readme = `${contentSRC}\n\n---\n\n${tableOfContentString}`;

		return {
			readme,
			platforms: {
				all: this.#cleanupArrayString(all).join('\n'),
				browser: this.#cleanupArrayString(browser).join('\n'),
				neutral: this.#cleanupArrayString(neutral).join('\n'),
				node: this.#cleanupArrayString(node).join('\n'),
				unsupported: this.#cleanupArrayString(unsupported).join('\n'),
			},
		};
	};

	/**
	 * @param {string} name
	 * @param {boolean} absolutePath
	 * @returns {string}
	 */
	#generateExportPath = (name, absolutePath) => {
		const rel = Paths.normalize(join(multiExportEntryPointsPath, `${name}.mjs`));
		if (!absolutePath) {
			if (!rel.startsWith('.')) {
				return `./${rel}`;
			}
			return rel;
		}
		return Paths.normalize(join(Paths.root, rel));
	};

	/**
	 * @param {string} content
	 * @returns {string}
	 */
	#generateExportMJSDOCFromstring = (content) => {
		return `// @ts-check\n/**\n * automatically generated by \`JSautoDOC\`\n * @copyright\n${(
			this.#copyright ?? ''
		).replace(/^/gm, ' * ')}\n */\n${content}`;
	};

	/**
	 * @param {string} name
	 * @param {Object} [packageJSONObject]
	 * @returns {void}
	 */
	#assignToPackageJSONExports = (name, packageJSONObject) => {
		if (!packageJSONObject) {
			return;
		}
		const relativePath = this.#generateExportPath(name, false);
		if (name === 'all') {
			Object.assign(packageJSONObject, { main: relativePath, module: relativePath });
		}
		Object.assign(packageJSONObject, {
			exports: {
				...// @ts-expect-error
				(packageJSONObject.exports ?? {}),
				[`.${Paths.normalizeForRoot(name)}`]: {
					import: relativePath,
					types: relativePath.replace('./', './generated/types/').replace(/\.mjs$/g, '.d.mts'),
				},
			},
		});
	};

	/**
	 * @param {{
	 * 		all:string,
	 * 		node:string,
	 * 		browser:string,
	 * 		neutral:string,
	 * 		unsupported:string,
	 * 	}} platforms
	 * @param {BufferEncoding} encoding
	 * @param {any} packageJSONObject
	 * @param {'node'|'browser'|'neutral'|'unsupported'} name
	 * @returns {ReturnType<typeof TryAsync<void>>}
	 */
	#generatePlatformsHandler = (platforms, encoding, packageJSONObject, name) => {
		return TryAsync(async () => {
			const path = this.#generateExportPath(name, true);
			if (!platforms[name]) {
				const [, errorRemovingPath] = await FileSafe.rm(path);
				if (errorRemovingPath) {
					return;
				}
				Console.info(
					{
						JSautoDOC: `✅ Successfully deleting '${path}' for having no valid exports`,
					},
					{
						now: true,
					},
				);
				return;
			}
			const content = this.#generateExportMJSDOCFromstring(platforms[name]);
			this.#assignToPackageJSONExports(name, packageJSONObject);
			await FileSafe.write(path, content, {
				encoding,
			});
			Console.info(
				{
					JSautoDOC: `✅ Successfully write '${path}'`,
				},
				{
					now: true,
				},
			);
		});
	};

	/**
	 * @type {FSDirArchWatcher__["fullHandler"]}
	 */
	#fullHandler = async ({ array, map }) => {
		const readmePath = this.#readme;
		Console.info(
			{
				JSautoDOC: `generating content for '${Paths.normalize(readmePath)}'`,
			},
			{
				now: true,
			},
		);
		const res = await this.#generateFromSRC(array);
		if (!res) {
			return;
		}
		const { readme, platforms } = res;
		const [packageJSONObject] = await this.#packageJSONHandler.read();
		const encoding = Preferrence.encoding;
		const [promises_] = ForOfSync(
			['all', 'browser', 'node', 'neutral', 'unsupported'],
			async (key) => {
				await this.#generatePlatformsHandler(
					platforms,
					encoding,
					packageJSONObject,
					// @ts-expect-error
					key,
				);
			},
		);
		const [[, errorWriteReadme]] = await Promise.all([
			TryAsync(async () => {
				return await FileSafe.write(
					readmePath,
					await prettier.format(readme, { parser: 'markdown' }),
					{
						encoding,
					},
				);
			}),
			...promises_,
		]);
		if (!!packageJSONObject) {
			await this.#packageJSONHandler.write(packageJSONObject);
		}
		if (errorWriteReadme === undefined) {
			Console.info(
				{
					JSautoDOC: `✅ Successfully generate '${Paths.normalize(readmePath)}';`,
				},
				{
					now: true,
				},
			);
		}
		if (errorWriteReadme) {
			Console.error(
				{
					JSautoDOC: `❌ Unable to generate '${Paths.normalize(readmePath)}';`,
					errorWriteReadme,
				},
				{
					now: true,
				},
			);
			return;
		}
		if (!this.#onLastGeneratedCallback) {
			return;
		}
		await this.#onLastGeneratedCallback({ map });
	};
}
