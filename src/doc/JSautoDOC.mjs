// @ts-check

import { extname, join } from 'node:path';
import { readFile } from 'node:fs/promises';

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

/**
 * @typedef {import('fs').Stats} Stats
 */
/**
 * @type {BufferEncoding}
 */
const encoding = 'utf-8';
const readmesrcname = 'README.src.md';
/**
 * @type {Set<import('../types/ExtnameType.mjs').ExtnameType>}
 */
const acceptableExt = new Set(['.mjs', '.mts', '.ts']);

/**
 * @description
 * - class for auto documenting mjs package/project, using jsdoc;
 * - this autodocumenter uses [chokidar](https://npmjs.com/package/chokidar) under the hood;
 * - this class also is used to generate this `README.md`;
 * - behaviours:
 * >1) add `"at"noautodoc` on self closing jsdoc comment to opt out from generating documentation on said file;
 * >>- auto export must follows the following rules, and there's no way to override;
 * >2) export all named exported 'const'|'function'|'async function'|'class', alphanumeric name, started with Capital letter, same name with fileName on `options.pahts.file`;
 * >3) declare typedef of existing typedef with alphanumeric name, started with Capital letter, same name with fileName, and have no valid export like on point <sup>1</sup> on `options.pahts.file`;
 * >4) create `README.md` based on, `options.paths.dir` and `README.src.md`;
 * >5) extract `"at"description` jsdoc:
 * >>- on static/prop that have depths, all of children should have `"at"static`/`"at"instance` `nameOfImmediateParent`, same block but before `"at"description` comment line;
 * >>- `"at"description` are treated as plain `markdown`;
 * >>- first `"at"${string}` after `"at"description` until `"at"example` will be treated as `javascript` comment block on the `markdown`;
 * >>- `"at"example` are treated as `javascript` block on the `markdown` file, and should be placed last on the same comment block;
 * >>- you can always look at `vivth/src` files to check how the source, and the `README.md` and `index.mjs` documentation/generation results;
 * >6) this types of arrow functions will be converted to regullar function, for concise type emition:
 * >>- validly exported function;
 * >>- static/instance method(s) with generic template;
 */
export class JSautoDOC {
	/**
	 * @type {JSautoDOC|undefined}
	 */
	static #instance;
	/**
	 * @description
	 * @param {Object} [options]
	 * @param {Object} [options.paths]
	 * @param {string} options.paths.file
	 * - entry point;
	 * @param {string} options.paths.readMe
	 * - readme target;
	 * @param {string} options.paths.dir
	 * - source directory;
	 * @param {string} [options.copyright]
	 * @param {string} [options.tableOfContentTitle]
	 * @param {import('chokidar').ChokidarOptions} [options.option]
	 * - ChokidarOptions;
	 * @example
	 * import { JSautoDOC } from 'vivth';
	 *
	 *  new JSautoDOC({
	 * 	paths: { dir: 'src', file: 'index.mjs', readMe: 'README.md' },
	 * 	copyright: 'this library is made and distributed under MIT license;',
	 * 	tableOfContentTitle: 'list of exported API and typehelpers',
	 * });
	 *
	 */
	constructor({
		paths = { dir: './src', file: './index.mjs', readMe: './README.md' },
		tableOfContentTitle = 'exported-api-and-type-list',
		copyright = '',
		option = {},
	} = {}) {
		if (JSautoDOC.#instance instanceof JSautoDOC) {
			return this;
		}
		JSautoDOC.#instance = this;
		this.#tableOfContentTitle = tableOfContentTitle;
		this.#paths = paths;
		this.#copyright = copyright;
		const rootPath = Paths.root;
		if (rootPath === undefined) {
			return;
		}
		const watchpath = join(rootPath, this.#paths.dir);
		const watcher = chokidar.watch(watchpath, option);
		const watcherReadme = chokidar.watch(join(rootPath, readmesrcname), option);
		/**
		 * @type {(eventName: import('chokidar/handler.js').EventName, path: string, stats?: import('fs').Stats) => void}
		 */
		const listener = (eventName, path, stats) => {
			const ext = extname(path);
			if (
				acceptableExt.has(
					// @ts-expect-error
					ext
				) === false
			) {
				return;
			}
			if (ext !== '.mjs') {
				TsToMjs(path, {
					encoding,
				});
				return;
			}
			switch (eventName) {
				case 'add':
				case 'change':
					this.#addHandler(eventName, path, stats);
					break;
				case 'unlink':
					this.#removeHandler(eventName, path, stats);
					break;
			}
		};
		watcher.on('all', listener);
		watcherReadme.on('all', this.#readMeListener);
		if (SafeExit.instance) {
			SafeExit.instance.addCallback(async () => {
				watcher.close();
				watcherReadme.close();
				watcher.removeAllListeners();
				watcherReadme.removeAllListeners();
				watcher.removeListener('all', listener);
				watcherReadme.removeAllListeners(this.#readMeListener);
				watcherReadme.removeListener('all', this.#readMeListener);
			});
		}
	}
	/**
	 * @type {string|undefined}
	 */
	#copyright;
	/**
	 * @type {{
	 *   file: string;
	 *   readMe: string;
	 *   dir: string;
	 *	}|undefined}
	 */
	#paths;
	/**
	 * @type {string|undefined}
	 */
	#tableOfContentTitle;
	/**
	 * @param {import('chokidar/handler.js').EventName} _eventName
	 * @param {string} path_
	 * @param {Stats|undefined} stats
	 * @returns {void}
	 */
	#readMeListener = (_eventName, path_, stats) => {
		if (stats && stats.isFile() === false) {
			return;
		}
		readFile(path_, { encoding }).then((content) => {
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
	#generatedREADME_md = new Effect(async ({ subscribe, isLastCalled }) => {
		const contentSRC = subscribe(this.#readMESRCContent).value;
		const filepaths = subscribe(this.#filePaths).value;
		if ((await isLastCalled(100)) === false || !contentSRC || !filepaths) {
			return;
		}
		const res = await this.#generateFromSRC(contentSRC, filepaths);
		if ((await isLastCalled()) === false || res === undefined) {
			return;
		}
		const { readme, mjsFile } = res;
		const rootPath = Paths.root;
		if (rootPath === undefined || this.#paths === undefined) {
			return;
		}
		const readmePath = join(rootPath, this.#paths.readMe);
		const mjsFilePath = join(rootPath, this.#paths.file);
		const [[, errorWriteReadme], [, errorWriteMjsFile]] = await Promise.all([
			FileSafe.write(readmePath, readme, { encoding }),
			FileSafe.write(mjsFilePath, mjsFile, { encoding }),
		]);
		if (errorWriteReadme === undefined) {
			Console.info({ vivthJSautoDOC: `successfully generate '${readmePath}'` });
		} else {
			Console.error({ vivthJSautoDOC: `unable to generate '${readmePath}'`, errorWriteReadme });
		}
		if (errorWriteMjsFile === undefined) {
			Console.info({ vivthJSautoDOC: `successfully generate '${mjsFilePath}'` });
		} else {
			Console.error({ vivthJSautoDOC: `unable to generate '${mjsFilePath}'`, errorWriteMjsFile });
		}
	});
	/**
	 * @param {string} string
	 * @returns {string}
	 */
	#generateJSDOCFromstring = (string) => {
		return `\n/**\n * automatically generated by \`vivth.JSautoDOC\`\n * @copyright\n${string.replace(
			/^/gm,
			' * '
		)}\n */\n`;
	};
	/**
	 * @typedef { Object } generatedFromSRC
	 * @property { string } readme
	 * @property { string } mjsFile
	 */
	/**
	 * @param {string} contentSRC
	 * @param {Set<string>} filepaths
	 * @returns {Promise<generatedFromSRC|undefined>}
	 */
	#generateFromSRC = async (contentSRC, filepaths) => {
		if (this.#tableOfContentTitle === undefined || this.#copyright === undefined) {
			return;
		}
		const tableID = this.#tableOfContentTitle.replace(/\s+/g, '-').toLowerCase();
		const tableOfContent = [];
		const apiDocuments = [];
		const mjsMain = ['// @ts-check', this.#generateJSDOCFromstring(this.#copyright)];
		const mjsTypes = [];
		for await (const path_ of filepaths) {
			const {
				documented,
				content,
				hasValidExportObject,
				path: { relative: relativePath },
				baseName: { noExt },
			} = (await this.#parsedFilesRef.get(path_)).value;
			const trueContent = await content.string();
			if (trueContent === undefined) {
				return;
			}

			const hasNoAutoDoc = /\/\*\*[\s\*]*?@noautodoc[\s\*]*?\*\//.test(trueContent);
			if (hasValidExportObject) {
				mjsMain.push(
					`export { ${noExt} } from '${
						relativePath.startsWith('.') ? relativePath : `./${relativePath}`
					}';`
				);
			}
			/**
			 * @type {string[]}
			 */
			const currentDescription = [];
			const { readme, typedef } = documented;
			const [typedefString, error] = await TryAsync(async () => {
				if (hasValidExportObject) {
					throw new Error('');
				}
				const result = await typedef();
				return result;
			});
			if (error === undefined && typedefString) {
				mjsTypes.push(typedefString.module);
				if (hasNoAutoDoc === false) {
					const nameVarID = noExt.toLowerCase();
					tableOfContent.push(`[${noExt}](#${nameVarID})`);
					apiDocuments.push(
						`<h2 id="${nameVarID}">${noExt}</h2>\n\n- jsdoc types:\n\n\`\`\`js\n${
							typedefString.readme
						}\n\`\`\`\n*) <sub>[go to ${this.#tableOfContentTitle}](#${tableID})</sub>`
					);
				}
			}
			if (hasNoAutoDoc === false && hasValidExportObject) {
				readme.forEach((ref) => {
					const {
						// fullDescription,
						// instanceOrStatic,
						// namedVar,
						// typeOfVar,
						parsedFullDescription,
						reference,
					} = ref;
					const { description, jsPreview } = parsedFullDescription;
					currentDescription.push(`\n#### reference:${reference}\n${description}\n${jsPreview}`);
				});
				const nameVarID = noExt.toLowerCase();
				tableOfContent.push(`[${noExt}](#${noExt.toLowerCase()})`);
				apiDocuments.push(
					`<h2 id="${nameVarID}">${noExt}</h2>\n\n-current-description-to-replace-\n\n*) <sub>[go to ${
						this.#tableOfContentTitle
					}](#${tableID})</sub>`.replace(
						'-current-description-to-replace-',
						currentDescription.join('\n')
					)
				);
			}
		}
		const tableOfContentString = `<h2 id="${this.#tableOfContentTitle
			.replace(/\s+/g, '-')
			.toLowerCase()}">${
			this.#tableOfContentTitle
		}</h2>\n\n - -table-of-content-to-replace-\n\n-api-document-to-replace-`
			.replace('-table-of-content-to-replace-', tableOfContent.join('\n - '))
			.replace('-api-document-to-replace-', apiDocuments.join('\n\n'));
		return {
			mjsFile: [...mjsMain, ...mjsTypes].join('\n'),
			readme: `${contentSRC}\n${tableOfContentString}`,
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
				const dispatch = (await EventSignal.get(`${prefix}${path__}`, false)).dispatch;
				// @ts-expect-error
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
	 * @type {(eventName: 'add'|'change', path: string, stats?: import('fs').Stats) => void}
	 */
	#addHandler = (eventName, path__, _stats) => {
		TryAsync(async () => {
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
					dispatch.value = new parsedFile(path__, _stats, encoding);
					this.#filePaths.subscribers.notify(async ({ signalInstance }) => {
						await dispatch.value.parse();
						dispatch.subscribers.notify();
						Console.info({ vivthJSautoDOC: `${eventName} '${path__}' to export and doc` });
						signalInstance.value.add(path__);
					});
					break;
				case 'waitForRewrite':
				case 'doNotProcess':
					break;
			}
		}).then(([, error]) => {
			if (error === undefined) {
				return;
			}
			Console.error(error);
		});
	};
	/**
	 * @type {(eventName: 'unlink', path: string, stats?: import('fs').Stats) => void}
	 */
	#removeHandler = (eventName, path__, _stats) => {
		TryAsync(async () => {
			if (_stats?.isFile()) {
				return true;
			}
			return false;
		}).then(([, error]) => {
			if (error === undefined) {
				return;
			}
			this.#filePaths.subscribers.notify(async ({ signalInstance }) => {
				Console.warn({ [eventName]: path__ });
				signalInstance.value.delete(path__);
				this.#parsedFilesRef.unRef(path__);
			});
		});
	};
}
