// @ts-check

import { basename, extname, join } from 'node:path';
import { readFile } from 'node:fs/promises';

import prettier from 'prettier';
import chokidar from 'chokidar';

import { EventSignal } from '../class/EventSignal.mjs';
import { parsedFile } from './parsedFile.mjs';
import { SafeExit } from '../class/SafeExit.mjs';
import { Effect } from '../class/Effect.mjs';
import { Paths } from '../class/Paths.mjs';
import { Signal } from '../class/Signal.mjs';
import { LazyFactory } from '../function/LazyFactory.mjs';
import { TryAsync } from '../function/TryAsync.mjs';
import { Console } from '../class/Console.mjs';
import { TsToMjs } from '../function/TsToMjs.mjs';
import { FileSafe } from '../class/FileSafe.mjs';
import { correctBeforeParse } from './correctBeforeParse.mjs';
import { Preferrence } from '../common/Preferrence.mjs';
import { ForOfSync } from '../function/ForOfSync.mjs';
import { QChannel } from '../class/QChannel.mjs';

/**
 * @typedef {import('fs').Stats} Stats
 */

const readmesrcname = 'README.src.md';
export const vivthJSautoDOC = 'vivth.JSautoDOC';
/**
 * @type {Set<import('../typehints/ExtnameType.mjs').ExtnameType>}
 */
const acceptableExt = new Set(['.js', '.mjs', '.mts', '.ts']);

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
 */
export class JSautoDOC {
	/**
	 * @type {JSautoDOC|undefined}
	 */
	static #instance;
	/**
	 * @description
	 * @param {Object} options
	 * @param {Object} [options.paths]
	 * @param {string} options.paths.file
	 * - entry point;
	 * @param {string} options.paths.readMe
	 * - readme target;
	 * @param {string} options.paths.dir
	 * - source directory;
	 * @param {string} [options.copyright]
	 * @param {string} [options.tableOfContentTitle]
	 * @param {number} [options.maxDebounceForGeneratingDocAndExport]
	 * - default `10_000`;
	 * @param {import('chokidar').ChokidarOptions} [options.chokidarOptions]
	 * - ChokidarOptions;
	 * @param {import('../typehints/AutoDocASOptions.mjs').AutoDocASOptions} [options.assemblyScriptOptions]
	 * - abstracted details to handle `.as.ts` file;
	 * @param {(arg0:{documentedFilePathsStructuredClone:Set<string>})=>Promise<void>} [options.onLastGeneratedCallback]
	 * - callback to be run on finishing generating document AND exports;
	 * - only handle that marked as `isLastCalled`;
	 * @example
	 * import { JSautoDOC } from 'vivth';
	 *
	 * new JSautoDOC({
	 * 	paths: { dir: 'src', file: 'index.mjs', readMe: 'README.md' },
	 * 	copyright: 'this library is made and distributed under MIT license;',
	 * 	tableOfContentTitle: 'list of exported API and typehelpers',
	 * 	// assemblyScriptOptions: {},
	 * 	// onLastGeneratedCallback: async (options) => {
	 * 	// 	Console.log(options);
	 * 	// },
	 * });
	 *
	 */
	constructor({
		paths = { dir: './src', file: './index.mjs', readMe: './README.md' },
		tableOfContentTitle = 'exported-api-and-type-list',
		copyright = '',
		maxDebounceForGeneratingDocAndExport = 10_000,
		chokidarOptions = undefined,
		assemblyScriptOptions = undefined,
		onLastGeneratedCallback = undefined,
	}) {
		if (
			/**  */
			JSautoDOC.#instance instanceof JSautoDOC
		) {
			return this;
		}
		if (
			/**  */
			!SafeExit.instance
		) {
			Console.error('❌`vivth.JSautoDOC` needs `vivth.SafeExit` to be instansiated');
			return;
		}
		JSautoDOC.#instance = this;
		this.#onLastGeneratedCallback = onLastGeneratedCallback;
		this.#tableOfContentTitle = tableOfContentTitle;
		this.#paths = paths;
		this.#copyright = copyright;
		this.#maxDebounceForGeneratingDocAndExport = maxDebounceForGeneratingDocAndExport;
		const rootPath = Paths.root;
		const watchpath = join(rootPath, this.#paths.dir);
		const watcher = chokidar.watch(watchpath, chokidarOptions);
		const watcherReadme = chokidar.watch(join(rootPath, readmesrcname), chokidarOptions);
		this.#assemblyScriptOptions = assemblyScriptOptions;
		watcher.on('all', this.#listener);
		watcherReadme.on('all', this.#readMeListener);
		SafeExit.instance.addCallback(async () => {
			watcherReadme.removeAllListeners();
			watcherReadme.close();
			watcher.removeAllListeners();
			watcher.close();
		});
	}
	/**
	 * @type { import('../typehints/AutoDocASOptions.mjs').AutoDocASOptions|undefined }
	 */
	#assemblyScriptOptions;
	/**
	 * @type {(eventName: import('chokidar/handler.js').EventName, path: string, stats?: import('fs').Stats) => void}
	 */
	#listener = (eventName, path, stats) => {
		path = Paths.normalize(path);
		this.#q.callback(path, async () => {
			/**
			 * @type {`.${string}`}
			 */
			// @ts-expect-error
			const ext = extname(path);
			if (
				/**  */
				!acceptableExt.has(ext)
			) {
				return;
			}
			if (
				/**  */
				basename(path).endsWith(`.d${ext}`)
			) {
				FileSafe.rename(path, path.replace(new RegExp(`.d${ext}$`), ext));
				return;
			}
			switch (eventName) {
				case 'add':
				case 'change':
					if (
						/**  */
						ext !== '.mjs'
					) {
						await TsToMjs(path, {
							encoding: Preferrence.encoding,
							assemblyScriptOptions: this.#assemblyScriptOptions,
						});
						return;
					}
					await this.#addHandler(eventName, path, stats);
					break;
				case 'unlink':
					if (
						/**  */
						ext !== '.mjs'
					) {
						return;
					}
					await this.#removeHandler(eventName, path, stats);
					break;
			}
		});
	};
	#q = LazyFactory(() => new QChannel('JSautoDOC:TsToMjs'));
	/**
	 * @type {undefined|((arg0:{documentedFilePathsStructuredClone:Set<string>})=>Promise<void>)}
	 */
	#onLastGeneratedCallback = undefined;
	/**
	 * @type {number|undefined}
	 */
	#maxDebounceForGeneratingDocAndExport = undefined;
	/**
	 * @type {string|undefined}
	 */
	#copyright;
	/**
	 * @type {{
	 *   file: string;
	 *   readMe: string;
	 *   dir: string;
	 *	}}
	 */
	// @ts-expect-error
	#paths;
	/**
	 * @type {string|undefined}
	 */
	#tableOfContentTitle = undefined;
	/**
	 * @param {import('chokidar/handler.js').EventName} _eventName
	 * @param {string} path_
	 * @param {Stats|undefined} stats
	 * @returns {void}
	 */
	#readMeListener = (_eventName, path_, stats) => {
		path_ = Paths.normalize(path_);
		this.#q.callback(path_, async ({ isLastOnQ }) => {
			if (
				/**  */
				!isLastOnQ()
			) {
				return;
			}
			if (
				/**  */
				stats &&
				stats.isFile() === false
			) {
				return;
			}
			const content = await readFile(path_, { encoding: Preferrence.encoding });
			this.#readMESRCContent.value = content;
		});
	};
	/**
	 * @type {Signal<Set<string>>}
	 */
	#filePaths = LazyFactory(() => new Signal(new Set()));
	/**
	 * @type {Signal<string>}
	 */
	#readMESRCContent = LazyFactory(() => new Signal(''));
	// @ts-expect-error
	#generatedREADME_md = new Effect(async ({ subscribe, isLastCalled }) => {
		const contentSRC = subscribe(this.#readMESRCContent).value ?? '';
		const documentedFilePathsStructuredClone = structuredClone(subscribe(this.#filePaths).value);
		if (
			/**  */
			!(await isLastCalled(100)) ||
			!documentedFilePathsStructuredClone
		) {
			return;
		}
		const rootPath = Paths.root;
		const readmePath = join(rootPath, this.#paths.readMe);
		const mjsFilePath = join(rootPath, this.#paths.file);
		Console.info({
			now: Date.now(),
			[vivthJSautoDOC]: `generating content for '${Paths.normalize(readmePath)}' and '${Paths.normalize(mjsFilePath)}';`,
		});
		const res = await this.#generateFromSRC(contentSRC, documentedFilePathsStructuredClone);
		if (
			/**  */
			!(await isLastCalled(100)) ||
			res === undefined
		) {
			return;
		}
		const { readme, mjsFile } = res;
		const [[, errorWriteReadme], [, errorWriteMjsFile]] = await Promise.all([
			FileSafe.write(mjsFilePath, mjsFile, { encoding: Preferrence.encoding }),
			FileSafe.write(readmePath, await prettier.format(readme, { parser: 'markdown' }), {
				encoding: Preferrence.encoding,
			}),
		]);
		if (
			/**  */
			errorWriteMjsFile === undefined &&
			errorWriteReadme === undefined
		) {
			Console.info({
				now: Date.now(),
				[vivthJSautoDOC]: `✅successfully generate '${Paths.normalize(mjsFilePath)}' and '${Paths.normalize(readmePath)}';`,
			});
		}
		if (
			/**  */
			errorWriteReadme ||
			errorWriteMjsFile
		) {
			if (
				/**  */
				errorWriteMjsFile
			) {
				Console.error({
					now: Date.now(),
					[vivthJSautoDOC]: `❌unable to generate '${Paths.normalize(mjsFilePath)}';`,
					errorWriteMjsFile,
				});
			}
			if (
				/**  */
				errorWriteReadme
			) {
				Console.error({
					now: Date.now(),
					[vivthJSautoDOC]: `❌unable to generate '${Paths.normalize(readmePath)}';`,
					errorWriteReadme,
				});
			}
			return;
		}
		if (
			/**  */
			!this.#onLastGeneratedCallback ||
			!(await isLastCalled())
		) {
			return;
		}
		await this.#onLastGeneratedCallback({ documentedFilePathsStructuredClone });
	}, this.#maxDebounceForGeneratingDocAndExport);
	/**
	 * @param {string} string
	 * @returns {string}
	 */
	#generateJSDOCFromstring = (string) => {
		return `\n/**\n * automatically generated by \`${vivthJSautoDOC}\`\n * @copyright\n${string.replace(
			/^/gm,
			' * ',
		)}\n */\n`;
	};
	/**
	 * @param {string} contentSRC
	 * @param {Set<string>} filepaths
	 * @returns {Promise<{
	 * readme:string,mjsFile:string
	 * }|undefined>}
	 */
	#generateFromSRC = async (contentSRC, filepaths) => {
		if (
			/**  */
			this.#tableOfContentTitle === undefined ||
			this.#copyright === undefined
		) {
			return;
		}
		const tableID = this.#tableOfContentTitle.replace(/\s+/g, '-').toLowerCase();
		const tableOfContent = [];
		const apiDocuments = [];
		const mjsMain = ['// @ts-check', this.#generateJSDOCFromstring(this.#copyright)];
		const mjsTypes = [];
		const sortedFilepaths = [...filepaths].sort((a, b) => a.localeCompare(b));
		for await (const path_ of sortedFilepaths) {
			const {
				documented,
				content,
				hasValidExportObject,
				path: { relative: relativePath },
				baseName: { noExt },
			} = (await this.#parsedFilesRef.get(path_)).value;
			const trueContent = await content.string();
			if (
				/**  */
				trueContent === undefined
			) {
				this.#filePaths.value.delete(path_);
				continue;
			}
			const hasNoAutoDoc = /\/\*\*[\s\*]*?@noautodoc[\s\*]*?\*\//.test(trueContent);
			if (
				/**  */
				hasValidExportObject
			) {
				mjsMain.push(
					`export { ${noExt} } from '${
						relativePath.startsWith('.') ? relativePath : `./${relativePath}`
					}';`,
				);
			}
			/**
			 * @type {string[]}
			 */
			const currentDescription = [];
			const { readme, typedef } = documented;
			const [typedefString, error] = await TryAsync(async () => {
				if (
					/**  */
					hasValidExportObject
				) {
					throw 'has no valid export object';
				}
				const result = await typedef();
				return result;
			});
			if (
				/**  */
				error === undefined &&
				typedefString
			) {
				mjsTypes.push(typedefString.module);
				if (
					/**  */
					!hasNoAutoDoc
				) {
					const nameVarID = noExt.toLowerCase();
					tableOfContent.push(`[${noExt}](#${nameVarID})`);
					apiDocuments.push(
						`<h2 id="${nameVarID}">${noExt}</h2>\n\n- jsdoc types:\n\n\`\`\`js\n${
							typedefString.readme
						}\n\`\`\`\n*) <sub>[go to ${this.#tableOfContentTitle}](#${tableID})</sub>\n\n---`,
					);
				}
			}
			if (
				/**  */
				hasNoAutoDoc === false &&
				hasValidExportObject
			) {
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
							`\n#### reference:${reference}\n${description}\n${jsPreview}`.replace(
								/\[blank\]/g,
								'',
							),
						);
					},
				);
				const nameVarID = noExt.toLowerCase();
				tableOfContent.push(`[${noExt}](#${noExt.toLowerCase()})`);
				apiDocuments.push(
					`<h2 id="${nameVarID}">${noExt}</h2>\n\n-current-description-to-replace-\n\n*) <sub>[go to ${
						this.#tableOfContentTitle
					}](#${tableID})</sub>\n\n---`.replace(
						'-current-description-to-replace-',
						currentDescription.join('\n'),
					),
				);
			}
		}
		const tableOfContentString = `<h2 id="${this.#tableOfContentTitle
			.replace(/\s+/g, '-')
			.toLowerCase()}">${
			this.#tableOfContentTitle
		}</h2>\n\n - -table-of-content-to-replace-\n\n---\n\n-api-document-to-replace-`
			.replace('-table-of-content-to-replace-', tableOfContent.join('\n - '))
			.replace('-api-document-to-replace-', apiDocuments.join('\n\n'));
		return {
			mjsFile: [...mjsMain, ...mjsTypes].join('\n'),
			readme: `${contentSRC}\n\n---\n\n${tableOfContentString}`,
		};
	};
	#parsedFilesRef = LazyFactory(() => {
		const prefix = 'parsedFiles:';
		return {
			/**
			 * @param {string} path__
			 * @returns {Promise<Signal<parsedFile>>}
			 */
			get: async (path__) => {
				const dispatch = (await EventSignal.get(`${prefix}${path__}`)).dispatcher;
				return dispatch;
			},
			/**
			 * @param {string} path__
			 * @returns {Promise<void>}
			 */
			unRef: async (path__) => {
				const parsedFile = await this.#parsedFilesRef.get(`${prefix}${path__}`);
				parsedFile.remove.ref();
			},
		};
	});
	/**
	 * @type {(eventName: 'add'|'change', path: string, stats?: import('fs').Stats) => Promise<void>}
	 */
	#addHandler = async (_eventName, path__, _stats) => {
		await TryAsync(async () => {
			if (
				//
				!_stats?.isFile()
			) {
				return;
			}
			const res = await correctBeforeParse(path__, 'utf-8');
			switch (res) {
				case 'shouldProceedNextCheck':
					const dispatch = await this.#parsedFilesRef.get(path__);
					dispatch.value = new parsedFile(path__, _stats, Preferrence.encoding);
					this.#filePaths.subscribers.notify(async ({ signalInstance }) => {
						await dispatch.value.parse();
						dispatch.subscribers.notify();
						Console.info({
							now: Date.now(),
							[vivthJSautoDOC]: `export and document '${Paths.normalize(path__)}';`,
						});
						signalInstance.value.add(path__);
					});
					break;
				case 'waitForRewrite':
				case 'doNotProcess':
					break;
			}
		}).then(([, errorJSautoDOC]) => {
			if (
				/**  */
				errorJSautoDOC === undefined
			) {
				return;
			}
			Console.error({
				now: Date.now(),
				errorJSautoDOC,
			});
		});
	};
	/**
	 * @type {(eventName: 'unlink', path: string, stats?: import('fs').Stats) => Promise<void>}
	 */
	#removeHandler = async (eventName, path__, stats) => {
		await TryAsync(async () => {
			if (
				/**  */
				stats?.isFile()
			) {
				return true;
			}
			return false;
		}).then(([, error]) => {
			if (
				/**  */
				error === undefined
			) {
				return;
			}
			this.#filePaths.subscribers.notify(async ({ signalInstance }) => {
				Console.warn({ now: Date.now(), [eventName]: path__ });
				signalInstance.value.delete(path__);
				await this.#parsedFilesRef.unRef(path__);
			});
		});
	};
}
