// @ts-check

import { readFile } from 'node:fs/promises';
import { Stats } from 'node:fs';
import { basename, join, relative, extname, dirname, resolve } from 'node:path';

import { Paths } from '../class/Paths.mjs';
import { LazyFactory } from '../function/LazyFactory.mjs';
import { TrySync } from '../function/TrySync.mjs';
import { Console } from '../class/Console.mjs';
import { TryAsync } from '../function/TryAsync.mjs';
import { Preferrence } from '../common/Preferrence.mjs';
import { GetModuleEsbuildPlatform } from '../function/GetModuleEsbuildPlatform.mjs';
import { multiExportEntryPointsPath } from './JSautoDOC.mjs';
import { SafeImport } from '../function/SafeImport.mjs';
import { isModuleTheBundledVersion } from '../bundler/adds/isModuleTheBundledVersion.mjs';

export class parsedFileForDOC {
	/**
	 * @typedef {{
	 *	instanceOrStatic:{parent:string, type:string},
	 *	fullDescription:string,
	 *	parsedFullDescription:{description:string, jsPreview:string},
	 *	isExport:boolean,
	 *	typeOfVar:string,
	 *	namedVar:string,
	 *	reference:string,
	 * }} refType
	 */
	/**
	 * @param {string} path
	 * - `relative`(to `Paths.root`) OR `absolute`, both are accepted;
	 * @param {import('fs').Stats} [stats]
	 * @param {BufferEncoding} [encoding]
	 */
	constructor(path, stats, encoding = Preferrence.encoding) {
		this.#stats = stats;
		const root = Paths.root.replace(/\\/g, '/');
		this.#fullPath = Paths.diskAbsolute(path);
		this.#relativePath = Paths.normalize(
			relative(join(root, multiExportEntryPointsPath), this.#fullPath),
		);
		this.#encoding = encoding;
		this.platform = GetModuleEsbuildPlatform(this.#fullPath);
	}
	/**
	 * @type {Promise<"browser" | "node" | "neutral" | "unsupported">}
	 */
	platform;
	parse = async () => {
		if (isModuleTheBundledVersion(this.path.full, this.ext.withDot)) {
			return;
		}
		const { details, error, exportName } = await this.content.parsed();
		if (error || exportName === undefined) {
			return;
		}
		for (let i = 0; i < details.length; i++) {
			const detail = details[i];
			if (detail === undefined) {
				continue;
			}
			const [
				,
				,
				instanceOrStaticDef,
				fullDescription,
				isExport,
				typeOfVar,
				getterOrSetter,
				namedVar,
			] = detail;
			if (
				instanceOrStaticDef === undefined ||
				fullDescription === undefined ||
				isExport === undefined ||
				typeOfVar === undefined ||
				getterOrSetter === undefined ||
				namedVar === undefined
			) {
				continue;
			}
			const interpreted = this.#interpreteArrayDesc(
				exportName,
				instanceOrStaticDef,
				fullDescription.replace(/\[at\]/g, '@'),
				isExport,
				typeOfVar,
				getterOrSetter,
				namedVar,
			);
			if (interpreted === undefined) {
				return;
			}
			this.documented.readme.add(interpreted);
		}
	};
	documented = LazyFactory(() => {
		return {
			/**
			 *
			 * @returns {Promise<{
			 * 	module: string;
			 * 	readme: string;
			 * } | undefined>}
			 */
			typedef: async () => {
				const relativePath = this.path.relative;
				if (relativePath === '') {
					return;
				}
				const baseName = this.baseName.noExt.split('.')[0];
				if (baseName === undefined) {
					return;
				}
				const content = await this.content.string();
				if (content === undefined) {
					return;
				}
				const typedef = this.#parseTypedef(baseName, relativePath, content);
				return typedef;
			},
			/**
			 * @type {Set<refType>}
			 */
			readme: new Set(),
		};
	});
	/**
	 * @param {string} exportName
	 * @returns {boolean}
	 */
	static #isExportNameValid = (exportName) => {
		const firstLetter = exportName.split('')[0];
		if (firstLetter === undefined) {
			return false;
		}
		return firstLetter.toUpperCase() === firstLetter;
	};
	/**
	 * @type {undefined|{module:string, readme:string}}
	 */
	parsedType;
	/**
	 * @param {string} exportName
	 * @param {string} relativePath
	 * @param {string} content
	 * @returns {parsedFileForDOC["parsedType"]}
	 */
	#parseTypedef = (exportName, relativePath, content) => {
		const rootPath = Paths.root;
		if (!parsedFileForDOC.#isExportNameValid(exportName)) {
			return undefined;
		}
		if (this.parsedType === undefined) {
			const baseNameNoExt = this.baseName.noExt;
			const relativeDir = this.dirName.relative;
			const contents = content.matchAll(/(\/\*\*[\s\S]*?\*\/)/gm).toArray();
			const readme = contents
				.map(([, val]) => {
					if (val === undefined) {
						return;
					}
					if (!/import\(['"][\s\S]*['"]\)/g.test(val)) {
						return val;
					}
					const res = /import\(['"]([\s\S]*)['"]\)/g.exec(val);
					if (res === null) {
						return;
					}
					const [, importDec] = res;
					if (importDec === undefined) {
						return;
					}
					const correctedPath = Paths.normalize(join(relativeDir, importDec));
					const rep = val.replace(
						importDec,
						correctedPath.startsWith('.') ? correctedPath : `./${correctedPath}`,
					);
					return rep;
				})
				.join('\n');
			const [res0] = contents.filter(([_, captured]) => {
				if (captured === undefined) {
					return false;
				}
				return new RegExp(
					`(?:@typedef|@callback)[\\s\\S]*?${baseNameNoExt}[\\s]?[\\s\\S]*?`,
					'',
				).test(captured);
			});
			if (res0 === undefined) {
				return undefined;
			}
			const [res] = res0;
			if (!res.length) {
				return undefined;
			}
			const templates = res
				.matchAll(/@template\s?{([\s\S]*?)}\s?(\w+)/gm)
				.map(([_, type, name]) => {
					return { name, type, comment: ` * @template {${type}} ${name}` };
				})
				.toArray();

			this.parsedType = {
				module: `/**-templates-
 * @typedef {import('${relativePath}').${exportName}${
		templates.length
			? `<${templates
					.map(({ name }) => {
						return name;
					})
					.join(',')}>`
			: ''
 }} ${exportName}
 */`
					.replace(/\\/g, '/')
					.replace(
						'-templates-',
						templates.length
							? '\n' +
									templates
										.map(({ comment, type }) => {
											const [, matched] = type?.match(/import\(['"]([\s\S]*)['"]\)/) ?? [];
											if (matched && comment) {
												comment = comment.replace(
													matched,
													`.${Paths.normalizeForRoot(
														relative(
															join(rootPath, multiExportEntryPointsPath),
															resolve(dirname(this.#fullPath), matched),
														),
													)}`,
												);
											}
											return comment;
										})
										.join('\n')
							: '',
					),
				readme,
			};
		}
		return this.parsedType;
	};
	/**
	 * @param {string} exportName
	 * @param {string} instanceOrStaticDef
	 * @param {string} fullDescription
	 * @param {string} isExport_
	 * @param {string} typeOfVar
	 * @param {string} getterOrSetter
	 * @param {string} namedVar
	 * @returns {refType|undefined}
	 */
	#interpreteArrayDesc = (
		exportName,
		instanceOrStaticDef,
		fullDescription,
		isExport_,
		typeOfVar,
		getterOrSetter,
		namedVar,
	) => {
		const type = instanceOrStaticDef.includes('@instance')
			? 'instance'
			: instanceOrStaticDef.includes('@static')
				? 'static'
				: instanceOrStaticDef.includes('@helper')
					? 'helper'
					: '';
		const parentSrc = instanceOrStaticDef
			.matchAll(/(?:@instance|@static|@helper)\s+(\w+)/gm)
			.toArray();
		let parent = '';
		if (parentSrc) {
			TrySync(() => {
				const parentSrc_0 = parentSrc[0] ?? [, ''];
				parent = parentSrc_0[1];
			});
		}
		const isExport = isExport_ === 'export';
		let reference = isExport ? exportName : '';
		if (parent) {
			reference = `${parent}.${namedVar}`;
		}
		switch (type) {
			case 'instance':
				reference = `${exportName}_instance.${reference}`;
				break;
			case 'static':
				reference = `${exportName}.${reference}`;
				break;
			case 'helper':
				reference = `isolated helper only: ${reference}`;
				break;
			default:
				reference = isExport
					? `${exportName}`
					: typeOfVar === 'static'
						? `${exportName}.${namedVar}`
						: typeOfVar === ''
							? `${exportName}_instance.${namedVar}`
							: '';
				break;
		}
		if (getterOrSetter !== '') {
			reference = `${reference}:${getterOrSetter}ter`;
		}
		fullDescription = fullDescription.trim();
		if (namedVar.startsWith('#')) {
			reference = '';
		}
		if (namedVar === 'constructor') {
			reference = `new ${exportName}`;
		}
		const parsedFullDescription = this.#parseFullDesc(fullDescription);
		return {
			reference: `\`${reference}\``,
			instanceOrStatic: {
				parent,
				type,
			},
			fullDescription,
			parsedFullDescription,
			isExport,
			typeOfVar,
			namedVar,
		};
	};
	/**
	 * @param {string} fullDescription
	 * @returns {{description:string, jsPreview:string}}
	 */
	#parseFullDesc = (fullDescription) => {
		const fullDescTrue = fullDescription.split('@');
		const fullDescTrue_0 = fullDescTrue[0] ?? '';
		const description = fullDescTrue_0
			.replace('*', '')
			.replace(/\s*(?<!\\)\*\s/g, '\n')
			.trim();
		fullDescTrue.shift();
		/**
		 * @type {string}
		 */
		let example = '';
		let jsPreview = `\n\`\`\`js
/**
 * @${fullDescTrue
		.join('@')
		.replace(/(?<!\\)\*/g, '\n *')
		.replace(/\s+\*/g, '\n\t\*')}
 */\n\`\`\``;
		const [example_] = jsPreview.matchAll(/@example([\s\S]*)\*\//gm).toArray();
		if (example_ === undefined) {
			return {
				description,
				jsPreview: fullDescTrue.length ? jsPreview : '',
			};
		}
		TrySync(() => {
			const example_1 = example_[1] ?? '';
			example = example_1.replace(/(?<!\\)\*/g, '').replace(/^\s{2,2}/gm, ' ');
			jsPreview = jsPreview.replace(example_[0], '\n */');
		});
		return {
			description,
			jsPreview: fullDescTrue.length
				? `${jsPreview
						.replace(/\/\*\*[\s\*]*\*\//g, '')
						.replace(/\`\`\`js[\s]*\`\`\`/gm, '')
						.replace(/\*[\*\s]*\*\//g, '*/')
						.replace(/\[at\]/g, '@')}${
						!!example
							? `\n - <i>example</i>:\n\`\`\`js\n${`${
									/** */
									example.trimEnd().replace(/\\\@/g, '@')
								}\n`
									.replace(/\n+/g, '\n')
									.replace(/^\s([\w\W])/, '$1')}\`\`\``.replace(/\\\*/g, '*')
							: ''
					}`.replace(/\[at\]/g, '@')
				: '',
		};
	};
	/**
	 * @type {undefined|{exportName:undefined, details:undefined, error:{fullpath:string, message:string}}
	 * | {exportName:string|undefined, details:ReturnType<typeof parsedFileForDOC["getDescription"]>, error:undefined}
	 * }
	 */
	#parsed;
	/**
	 * @returns {Promise<{exportName:undefined, details:undefined, error:{fullpath:string, message:string}}
	 * | {exportName:string|undefined, details:ReturnType<typeof parsedFileForDOC["getDescription"]>, error:undefined}
	 * >}
	 */
	#parse = async () => {
		const fullpath = this.#fullPath;
		const content = await this.content.string();
		if (content === undefined) {
			const errorParse = { fullpath, message: 'invalid file content' };
			Console.error({ errorParse }, { now: true });
			return { exportName: undefined, details: undefined, error: errorParse };
		}
		const supposedName = this.baseName.noExt.split('.')[0];
		if (supposedName === undefined || !this.#getTopExport(supposedName, content)) {
			return {
				details: undefined,
				exportName: undefined,
				error: { fullpath, message: 'no valid exported declaration' },
			};
		}
		this.hasValidExportObject = true;
		return {
			details: parsedFileForDOC.getDescription(content),
			exportName: supposedName,
			error: undefined,
		};
	};
	hasValidExportObject = false;
	/**
	 * @param {string} name
	 * @param {string} content
	 * @returns {boolean}
	 */
	#getTopExport = (name, content) => {
		if (!parsedFileForDOC.#isExportNameValid(name)) {
			return false;
		}
		const regex = new RegExp(
			`export\\s*(?:(?:async\\s*|)function|const|class|\\{)\\s*${name}\[\\W\]`,
			'g',
		);
		return regex.test(content);
	};
	/**
	 * @param {string} content
	 * @returns { RegExpExecArray[] }
	 */
	static getDescription = (content) => {
		const regexp =
			/(\/\*\*([\s\S]*?)(?:@description)([\s\S]*?)\*\/\s*(?:@\w+(?:\([\s\S]*?\))?\s*)*(export|\s?)\s?(static|class|const|function|async\s+function|\s?)\s?(?:async|)\s?(get|set|)\s+?(\w+))/gm;
		const modified = content.replace(/\s*\/\/\s+\@ts-[\w-]+\s*/gm, ' ').replace(/\r\n+/g, ' ');
		const matches = modified.matchAll(regexp).toArray();
		return matches;
	};
	/**
	 * @type {string}
	 */
	#fullPath = '';
	/**
	 * @type {string}
	 */
	#relativePath = '';
	/**
	 * @returns {boolean|undefined}
	 */
	get isFile() {
		return this.#stats?.isFile();
	}
	/**
	 * @returns {boolean|undefined}
	 */
	get isDirectory() {
		return this.#stats?.isDirectory();
	}
	baseName = LazyFactory(() => {
		const this_ = this;
		return {
			/**
			 * @returns {string}
			 */
			withExt: basename(this_.#fullPath),
			/**
			 * @returns {string}
			 */
			noExt: basename(this_.#fullPath, extname(this_.#fullPath)),
		};
	});
	path = LazyFactory(() => {
		const this_ = this;
		return {
			/**
			 * @returns {string}
			 */
			get relative() {
				return this_.#relativePath;
			},
			/**
			 * @returns {string}
			 */
			get full() {
				return this_.#fullPath;
			},
		};
	});
	get dirName() {
		const this_ = this;
		return {
			/**
			 * @returns {string}
			 */
			relative: dirname(this_.#relativePath),
			/**
			 * @returns {string}
			 */
			full: dirname(this_.#fullPath),
		};
	}
	get ext() {
		const this_ = this;
		return {
			/**
			 * @returns {string|undefined}
			 */
			withDot: extname(this_.#fullPath),
			/**
			 * @returns {string|undefined}
			 */
			noDot: extname(this_.#fullPath).replace(/^\./, ''),
		};
	}
	/**
	 * @type {BufferEncoding|undefined}
	 */
	#encoding;
	/**
	 * @type {Stats|undefined}
	 */
	#stats;
	get timeStamp() {
		const this_ = this;
		return {
			/**
			 * @returns {Promise<number|undefined>}
			 */
			lastModified: async () => {
				return this_.#stats?.mtimeMs;
			},
			/**
			 * @returns {Promise<number|undefined>}
			 */
			createdAt: async () => {
				return this_.#stats?.birthtimeMs;
			},
		};
	}
	/**
	 * @type {string|undefined}
	 */
	#rawContent;
	content = LazyFactory(() => {
		const this_ = this;
		return {
			/**
			 * @return {Promise<string|undefined>}
			 */
			string: async () => {
				if (!this_.isFile) {
					return undefined;
				}
				const [raw, error] = await TryAsync(async () => {
					return (await readFile(this_.#fullPath)).toString(this.#encoding);
				});
				if (error === undefined) {
					this_.#rawContent = raw;
					return this_.#rawContent;
				}
				Console.error(
					{
						error,
						fullPath: this_.#fullPath,
						message: 'failed to read fullPath',
					},
					{ now: true },
				);
				return undefined;
			},
			/**
			 *
			 * @returns {Promise<{exportName:undefined, details:undefined, error:{fullpath:string, message:string}}|
			 *  {exportName:string|undefined, details:ReturnType<typeof parsedFileForDOC["getDescription"]>, error:undefined}>}
			 */
			parsed: async () => {
				if (this_.#parsed === undefined) {
					this_.#parsed = await this_.#parse();
				}
				return this_.#parsed;
			},
		};
	});

	/**
	 * @returns {ReturnType<typeof TryAsync<any>>}
	 */
	importAsModuleJS = async () => {
		return await TryAsync(async () => {
			return await SafeImport(this.path.full);
		});
	};
}
