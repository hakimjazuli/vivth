// @ts-check

import { readFile, stat } from 'node:fs/promises';
import { Stats } from 'node:fs';
import { normalize, basename, join, relative, extname, dirname } from 'node:path';

import { Paths } from '../class/Paths.mjs';
import { LazyFactory } from '../function/LazyFactory.mjs';
import { TrySync } from '../function/TrySync.mjs';
import { Console } from '../class/Console.mjs';
import { TryAsync } from '../function/TryAsync.mjs';

export class parsedFile {
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
	 * @param {string} path__
	 * @param {BufferEncoding} [encoding]
	 */
	constructor(path__, encoding = 'utf-8') {
		const root = Paths.root.replace(/\\/g, '/');
		if (Paths.normalize(path__).startsWith(root)) {
			this.#fullPath = path__;
		} else {
			this.#fullPath = join(root, path__);
		}
		this.#relativePath = Paths.normalize(relative(root, this.#fullPath));
		this.#encoding = encoding;
	}
	parse = async () => {
		const { details, error, exportName } = await this.content.parsed();
		if (error) {
			return;
		}
		for (let i = 0; i < details.length; i++) {
			const [
				_,
				__,
				instanceOrStaticDef,
				fullDescription,
				isExport,
				typeOfVar,
				getterOrSetter,
				namedVar,
			] = details[i];
			const interpreted = this.#interpreteArrayDesc(
				exportName,
				instanceOrStaticDef,
				fullDescription,
				isExport,
				typeOfVar,
				getterOrSetter,
				namedVar
			);
			this.documented.readme.add(interpreted);
		}
	};
	documented = LazyFactory(() => {
		return {
			typedef: async () => {
				const relativePath = this.path.relative;
				if (!relativePath) {
					return;
				}
				const typedef = this.#parseTypedef(
					this.baseName.noExt.split('.')[0],
					relativePath,
					await this.content.string()
				);
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
		return firstLetter.toUpperCase() === firstLetter;
	};
	/**
	 * @type {undefined|{module:string, readme:string}}
	 */
	parsedType = undefined;
	/**
	 * @param {string} exportName
	 * @param {string} relativePath
	 * @param {string} content
	 * @returns {parsedFile["parsedType"]}
	 */
	#parseTypedef = (exportName, relativePath, content) => {
		if (!parsedFile.#isExportNameValid(exportName)) {
			return undefined;
		}
		if (!this.parsedType) {
			const baseNameNoExt = this.baseName.noExt;
			const relativeDir = this.dirName.relative;
			const contents = content.matchAll(/(\/\*\*[\s\S]*?\*\/)/gm).toArray();
			const readme = contents
				.map(([_, val]) => {
					if (!/import\(['"][\s\S]*['"]\)/g.test(val)) {
						return val;
					}
					const [__, importDec] = /import\(['"]([\s\S]*)['"]\)/g.exec(val);
					const correctedPath = Paths.normalize(normalize(join(relativeDir, importDec)));
					const rep = val.replace(
						importDec,
						correctedPath.startsWith('.') ? correctedPath : `./${correctedPath}`
					);
					return rep;
				})
				.join('\n');
			const [[res]] = contents.filter(([_, captured]) => {
				if (
					!new RegExp(`(?:@typedef|@callback)[\\s\\S]*?${baseNameNoExt}\\s?[\\s\\S]*?`, '').test(
						captured
					)
				) {
					return false;
				}
				return true;
			});
			if (!res.length) {
				return undefined;
			}
			const templates = res
				.matchAll(/@template\s?{([\s\S]*?)}\s?(\w)*/gm)
				.map(([_, type, name]) => {
					return { name, comment: ` * @template {${type}} ${name}` };
				})
				.toArray();
			this.parsedType = {
				module: `/**-templates-
 * @typedef {import('./${relativePath}').${exportName}${
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
										.map(({ comment }) => {
											return comment;
										})
										.join('\n')
							: ''
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
	 * @returns {refType}
	 */
	#interpreteArrayDesc = (
		exportName,
		instanceOrStaticDef,
		fullDescription,
		isExport_,
		typeOfVar,
		getterOrSetter,
		namedVar
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
				parent = parentSrc[0][1];
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
		return {
			reference: `\`${reference}\``,
			instanceOrStatic: {
				parent,
				type,
			},
			fullDescription,
			parsedFullDescription: this.#parseFullDesc(fullDescription),
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
		const description = fullDescTrue[0]
			.replace('*', '')
			.replace(/(?<!\\)\*\s/g, '\n')
			.trim();
		fullDescTrue.shift();
		let example;
		let jsPreview = `\n\`\`\`js
/**
 * @${fullDescTrue.join('@').replace(/(?<!\\)\*/g, '\n *')}
 */\n\`\`\``;
		const [example_] = jsPreview.matchAll(/@example([\s\S]*)\*\//gm).toArray();
		TrySync(() => {
			example = example_[1].replace(/(?<!\\)\*/g, '').replace(/^\s{2,2}/gm, ' ');
			jsPreview = jsPreview.replace(example_[0], '\n */');
		});
		return {
			description,
			jsPreview: fullDescTrue.length
				? `${jsPreview
						.replace(/\/\*\*[\s\*]*\*\//g, '')
						.replace(/\`\`\`js[\s]*\`\`\`/gm, '')
						.replace(/\*[\*\s]*\*\//g, '*/')}${
						example ? `\n - <i>example</i>:\n\`\`\`js${example}\n\`\`\``.replace(/\\\*/g, '*') : ''
				  }`
				: '',
		};
	};
	/**
	 * @type {{exportName:undefined, details:undefined, error:{fullpath:string, message:string}}
	 * | {exportName:string|undefined, details:ReturnType<typeof parsedFile["getDescription"]>, error:undefined}
	 * }
	 */
	#parsed;
	/**
	 * @returns {Promise<{exportName:undefined, details:undefined, error:{fullpath:string, message:string}}
	 * | {exportName:string|undefined, details:ReturnType<typeof parsedFile["getDescription"]>, error:undefined}
	 * >}
	 */
	#parse = async () => {
		const fullpath = this.#fullPath;
		const content = await this.content.string();
		if (content === undefined) {
			const error = { fullpath, message: 'invalid file content' };
			Console.error(error);
			return { exportName: undefined, details: undefined, error };
		}
		const supposedName = this.baseName.noExt.split('.')[0];
		if (!this.#getTopExport(supposedName, content)) {
			return {
				details: undefined,
				exportName: undefined,
				error: { fullpath, message: 'no valid exported declaration' },
			};
		}
		this.hasValidExportObject = true;
		return {
			details: parsedFile.getDescription(content),
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
		if (!parsedFile.#isExportNameValid(name)) {
			return false;
		}
		const regex = new RegExp(
			`export\\s*(?:(?:async\\s*|)function|const|class|\\{)\\s*${name}`,
			'g'
		);
		return regex.test(content);
	};
	/**
	 * @param {string} content
	 * @returns { RegExpExecArray[] }
	 */
	static getDescription = (content) => {
		const regexp =
			/(\/\*\*([\s\S]*?)(?:@description)([\s\S]*?)\*\/\s?(export|\s?)\s?(static|class|const|function|async\s+function|\s?)\s?(?:async|)\s?(get|set|)\s+?(\w+))/gm;
		const modified = content.replace(/\r\n+/g, ' ');
		const matches = modified.matchAll(regexp).toArray();
		return matches;
	};
	/**
	 * @type {string}
	 */
	#fullPath;
	/**
	 * @type {string}
	 */
	#relativePath;
	/**
	 * @returns {Promise<boolean>}
	 */
	isFile = async () => {
		return (await this.stats()).isFile();
	};
	/**
	 * @returns {Promise<boolean>}
	 */
	isDirectory = async () => {
		return (await this.stats()).isDirectory();
	};

	baseName = LazyFactory(() => {
		const this_ = this;
		return {
			/**
			 * @returns {string}
			 */
			get withExt() {
				return basename(this_.#fullPath);
			},
			/**
			 * @returns {string}
			 */
			get noExt() {
				return basename(this_.#fullPath, extname(this_.#fullPath));
			},
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
			get relative() {
				return dirname(this_.#relativePath);
			},
			/**
			 * @returns {string}
			 */
			get full() {
				return dirname(this_.#fullPath);
			},
		};
	}
	get ext() {
		const this_ = this;
		return {
			/**
			 * @returns {string|undefined}
			 */
			get withDot() {
				if (this_.isDirectory && !this_.isFile) {
					return undefined;
				}
				return extname(this_.#fullPath);
			},
			/**
			 * @returns {string|undefined}
			 */
			get noDot() {
				if (this_.isDirectory && !this_.isFile) {
					return undefined;
				}
				return extname(this_.#fullPath).replace(/^\./, '');
			},
		};
	}
	/**
	 * @type {BufferEncoding}
	 */
	#encoding;
	/**
	 * @type {Stats}
	 */
	#stats;
	/**
	 * @private
	 * @returns {Promise<Stats>}
	 */
	stats = async () => {
		if (!this.#stats) {
			this.#stats = await stat(this.#fullPath);
		}
		return this.#stats;
	};
	get timeStamp() {
		const this_ = this;
		return {
			/**
			 * @returns {Promise<number>}
			 */
			lastModified: async () => {
				return (await this_.stats()).mtimeMs;
			},
			/**
			 * @returns {Promise<number>}
			 */
			createdAt: async () => {
				return (await this_.stats()).birthtimeMs;
			},
		};
	}
	/**
	 * @type {string}
	 */
	#rawContent;
	content = LazyFactory(() => {
		const this_ = this;
		return {
			/**
			 * @return {Promise<string|undefined>}
			 */
			string: async () => {
				if (this_.isDirectory && !this_.isFile) {
					return undefined;
				}
				const [raw, error] = await TryAsync(async () => {
					return await readFile(this_.#fullPath, this_.#encoding);
				});
				if (!error) {
					this_.#rawContent = raw;
					return this_.#rawContent.toString();
				}
				Console.error({
					error,
					fullPath: this_.#fullPath,
					message2: 'failed to read fullPath',
				});
				return undefined;
			},
			parsed: async () => {
				if (!this_.#parsed) {
					this_.#parsed = await this_.#parse();
				}
				return this_.#parsed;
			},
		};
	});
	/**
	 * @returns {[Promise<any>, undefined]|[undefined, Error]}
	 */
	get importAsModuleJS() {
		const realTimePath = `${this.#fullPath}?${Date.now()}`;
		let [importedModule, error] = TrySync(async () => {
			return import(`file://${realTimePath}`);
		});
		if (!error) {
			return [importedModule, undefined];
		}
		[importedModule, error] = TrySync(() => {
			return import(realTimePath);
		});
		if (!error) {
			return [importedModule, undefined];
		}
		Console.error({ error, timeStamp: Date.now() });
		return [undefined, error];
	}
}
