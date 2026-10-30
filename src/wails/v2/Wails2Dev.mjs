// @ts-check

import {
	/** */
	dirname,
	basename,
	extname,
	relative,
} from 'node:path';

import { readFile } from 'node:fs/promises';

import { QChannel } from '../../class/QChannel.mjs';
import { Preferrence } from '../../common/Preferrence.mjs';
import { TryAsync } from '../../function/TryAsync.mjs';
import { Timeout } from '../../function/Timeout.mjs';
import { FileSafe } from '../../class/FileSafe.mjs';
import { Paths } from '../../class/Paths.mjs';
import { FSDirArchWatcher } from '../../class/FSDirArchWatcher.mjs';
import { Console } from '../../class/Console.mjs';
import {
	wailsProjectHelperSnippet,
	wailsProjectHelperSettings,
	wailsFileContentsConnection,
	wailsFileContentsUtilsGetterSetter,
} from '../wailsProjectHelper.mjs';
import { wailsUtils } from '../wailsUtils.mjs';

/**
 * @description
 * suited for wails2 project with getter setter pattern using `sqlite3`;
 * this class assume `Paths` and `SafeExit` to be instantiated;
 * helper method with pre templated way of:
 * - sqlite go code generation from SQL file on `{projectroot}/sql`;
 * - auto_ipc.go generation from `{projectroot}/backend`;
 * > > - function commented with `// GETTER`;
 * > > - function commented with `// SETTER`;
 * > - provide auto formatter and ipc generator for `// GETTER` and `// SETTER` pattern;
 * > > - `// GETTER` prefix for getter function;
 * > > - `// SETTER` prefix for setter function;
 * - provide OOP-ish approach snippets(for .vscode):
 * > - `??staticPrepare`;
 * > - `??staticMethod`;
 * > - `??instancePrepare`;
 * > - `??instanceSingletonPrepare`;
 * > - `??instanceMethod`;
 * - provide `explorer.fileNesting.patterns` on `settings.json` for `.vscode`;
 * > - will nest based on parent `*.md` and `*.sql`;
 * - provide standard `backend/Connection.go` for connecting to `sqlite3` database;
 * - provide standard internal `backend/UtilsGetterSetter.go` for thread-safe, multiple readers/writters;
 */
export class Wails2Dev {
	/**
	 * @type {Wails2Dev | undefined}
	 */
	static #instance;
	static #q = new QChannel('Vivth:Wails2Dev');
	/**
	 * - parse sql file into typed go function, in same dir;
	 * - package is always sql, so dirname should be sql;
	 * - type are self closing, it recogninse go native types;
	 * - `:` prefix is for input field;
	 * - type then no `:` prefix means it is an output field;
	 * @param {string} path
	 * @returns {ReturnType<typeof TryAsync<boolean>>}
	 */
	static #sql = (path) => {
		return wailsUtils.pathToSQLHandler(path, 2);
	};
	/**
	 * Parses Go source files to generate wrapper methods on the App struct.
	 * - Auto-formats SETTER methods to return ([]string, error).
	 * - Auto-formats GETTER methods missing a dual return ending in error to (GETTER_need_to_return_something, error).
	 * - Generates void event-dispatch wrappers for SETTER methods.
	 * @param {string} filePath
	 * @param {number} timeout
	 * @returns {ReturnType<typeof TryAsync<{
	 *   importFrom: string;
	 *   funcDeclaration: string;
	 * }>>}
	 */
	static #go = async (filePath, timeout) => {
		return await Wails2Dev.#q.callback(filePath, async ({ isLastOnQ }) => {
			/**
			 * prevent rapid autoformat by go autoformatter to be handled immediately
			 */
			await Timeout(timeout);
			if (!isLastOnQ()) {
				throw 'not the last call';
			}
			const [content, errorRead] = await TryAsync(async () => {
				return readFile(filePath, { encoding: Preferrence.encoding });
			});
			if (!!errorRead) {
				throw errorRead;
			}

			// Derive naming variants from file basename
			const rawBaseName = basename(filePath, extname(filePath));

			// Ensure lowercase lead and upper pascal lead
			const baseNameLowerLead = rawBaseName.charAt(0).toLowerCase() + rawBaseName.slice(1);
			const baseNameUpperLead = rawBaseName.charAt(0).toUpperCase() + rawBaseName.slice(1);

			// 1) Check: type ${baseName lowecase lead}Static struct{}
			const typeStructRegex = new RegExp(
				`type[\\s\\S]+${baseNameLowerLead}Static\\s+struct\\s*\\{[^}]*\\}`,
				'm',
			);
			if (!typeStructRegex.test(content)) {
				throw { filePath, typeStructRegex, match: 0 };
			}

			// 2) Check: var ${BaseName}Static${baseName lowecase lead}Static
			const varStaticRegex = new RegExp(
				`var[\\s\\S]+${baseNameUpperLead}Static\\s+${baseNameLowerLead}Static`,
				'm',
			);
			if (!varStaticRegex.test(content)) {
				throw { filePath, varStaticRegex, match: 0 };
			}

			// 3) Match `// SETTER` or `// GETTER` block followed strictly by continuous comments and method signature
			// Handles both pointer (*connectionStatic) and value (connectionStatic) receivers
			const exportBlockRegex = new RegExp(
				`(//\\s*(?:SETTER|GETTER)(?:\\r?\\n//.*?)*)\\r?\\n` +
					`func\\s+(\\([^\\)]*?\\b\\*?\\s*${baseNameLowerLead}Static\\))\\s+([A-Za-z0-9_]+)` +
					`(?:\\s*(\\[[^\\]]+\\]))?\\s*` +
					`\\(((?:[^()]+|\\([^()]*\\))*)\\)` +
					`((?:[^{]|\\n)*?)\\s*\\{`,
				'gs',
			);

			const matches = [...content.matchAll(exportBlockRegex)];
			if (matches.length === 0) {
				throw { filePath, exportBlockRegex, match: 0 };
			}

			let updatedContent = content;

			// Auto-format signatures for SETTER and GETTER blocks
			updatedContent = updatedContent.replace(
				exportBlockRegex,
				(match, comments, receiver, funcName, typeParams, params, rawReturnType) => {
					const rawTypeParamsStr = typeParams ? typeParams : '';
					const isSetter = comments.startsWith('// SETTER') || comments.includes('\n// SETTER');
					const cleanReturnType = rawReturnType.replace(/\/\/.*$/gm, '').trim();

					if (isSetter) {
						return `${comments}\nfunc ${receiver} ${funcName}${rawTypeParamsStr}(${params}) ([]string, error) {`;
					}

					// Valid GETTER must return 2 values ending in `error`
					const isValidGetterReturn =
						/^\s*\([^,]+,\s*error\s*\)$/.test(cleanReturnType) ||
						/^\s*\(\s*[a-zA-Z0-9_.]+(?:\s+[a-zA-Z0-9_\.\[\]]+)?\s*,\s*(?:[a-zA-Z0-9_.]+\s+)?error\s*\)$/.test(
							cleanReturnType,
						);

					if (!isValidGetterReturn) {
						return `${comments}\nfunc ${receiver} ${funcName}${rawTypeParamsStr}(${params}) (GETTER_need_to_return_something, error) {`;
					}

					return match;
				},
			);

			if (updatedContent !== content) {
				await FileSafe.write(filePath, updatedContent, { encoding: Preferrence.encoding });
				throw 'calling autoformat';
			}

			const funcDeclarations = matches.map((match) => {
				const rawComments = match[1];
				const funcName = match[3]?.trim();
				const rawTypeParams = match[4] ? match[4].trim() : ''; // e.g. "[T any, K comparable]"
				const rawParamsStr = match[5]?.replace(/\/\/.*$/gm, '').trim();

				// Clean trailing single-line comments and whitespace from return type
				const rawReturnType = match[6]?.replace(/\/\/.*$/gm, '').trim();

				const isSetter =
					rawComments?.startsWith('// SETTER') || rawComments?.includes('\n// SETTER');

				// Format leading comments
				const docComments = rawComments
					?.split(/\r?\n/)
					.map((line) => line.trim())
					.filter((line) => line !== '// SETTER' && line !== '// GETTER')
					.join('\n');

				// Parse parameter declarations
				const paramsList = rawParamsStr
					? rawParamsStr
							.split(',')
							.map((p) => p.trim())
							.filter(Boolean)
					: [];

				// Check if 1st parameter is `appCtx context.Context`
				const hasAppContext =
					paramsList.length > 0 && /^appCtx\s+(?:\*?context\.)?Context$/.test(paramsList[0] ?? '');

				// Strip `appCtx` parameter for external method signature
				const outerParamsList = hasAppContext ? paramsList.slice(1) : paramsList;
				const outerParamsStr = outerParamsList.join(', ');

				// Determine if type arguments can be inferred automatically by Go compiler
				let invocationTypeArgs = '';
				if (rawTypeParams) {
					const typeNames = rawTypeParams
						.slice(1, -1) // Strip '[' and ']'
						.split(',')
						.map((clause) => clause.trim().split(/\s+/)[0]) // Grab identifier
						.filter(Boolean);

					const allParamsInferred = typeNames.every((tName) => {
						const regex = new RegExp(`\\b${tName}\\b`);
						return regex.test(rawParamsStr ?? '');
					});

					if (!allParamsInferred && typeNames.length > 0) {
						invocationTypeArgs = `[${typeNames.join(', ')}]`;
					}
				}

				// Extract parameter identifiers for invocation pass-through
				const invocationArgs = outerParamsList.flatMap((paramStr) => {
					const parts = paramStr.split(/\s+/);
					const typePart = parts[parts.length - 1]; // Last token is the type or variadic type
					const names = parts.slice(0, parts.length - 1); // Leading tokens are variable names

					return names.map((nameStr) => {
						const cleanName = nameStr.replace(/,$/, '');
						return typePart && typePart.startsWith('...') ? `${cleanName}...` : cleanName;
					});
				});

				// Insert `a.ctx` as first argument if original method accepts context
				if (hasAppContext) {
					invocationArgs.unshift('a.ctx');
				}

				const invocationArgsStr = invocationArgs.join(', ');
				const docPrefix = docComments ? `${docComments}\n` : '';

				if (isSetter) {
					// SETTER generation: no return, emit event on success
					return `${docPrefix}func (a *App) ${baseNameUpperLead}${funcName}${rawTypeParams}(${outerParamsStr}) {
	dispatch, err := ${baseNameUpperLead}Static.${funcName}${invocationTypeArgs}(${invocationArgsStr})
	if err != nil {
		return
	}
	runtime.EventsEmit(a.ctx, "getter:update", dispatch)
}`;
				}

				// GETTER generation: standard return signature pass-through
				const returnTypeStr = rawReturnType ? ` ${rawReturnType}` : '';
				const hasReturn = (rawReturnType?.length ?? 0) > 0;
				return `${docPrefix}func (a *App) ${baseNameUpperLead}${funcName}${rawTypeParams}(${outerParamsStr})${returnTypeStr} {
	${hasReturn ? 'return ' : ''}${baseNameUpperLead}Static.${funcName}${invocationTypeArgs}(${invocationArgsStr})
}`;
			});

			const relativePathToThePackage = Paths.normalize(relative(dirname(Paths.root), filePath))
				.replace(basename(filePath), '')
				.replace(/\/$/, '');

			return {
				importFrom: relativePathToThePackage,
				funcDeclaration: funcDeclarations
					.join('\n\n')
					.replace(/\n{3,}/g, '\n\n')
					.trim(),
			};
		});
	};

	/**
	 * @description
	 * - this is a singleton constructor;
	 * - dev script to watch multiple directories on your `projectRoot` for auto format and auto generate things;
	 * @param {number} [minDelay]
	 * - used to add timeout for ide go autoformatter;
	 * - default 200;
	 * @example
	 * import { Paths } from 'vivth/neutral';
	 * import { Wails2Dev, SafeExit } from 'vivth/node';
	 * new Paths({
	 * 	root: process.env.INIT_CWD ?? process.cwd(),
	 * });
	 * new SafeExit('SIGTERM', 'SIGINT');
	 * new Wails2Dev();
	 */
	constructor(minDelay = 200) {
		if (!!Wails2Dev.#instance) {
			return Wails2Dev.#instance;
		}
		const projectName = wailsUtils.getProjectName();
		const delay = minDelay + 182;
		if (!wailsUtils.checkGoProjectName(projectName)) {
			throw { problem: 'projectName, must supports go project name standard', projectName };
		}
		wailsUtils.jsonPrepare([wailsProjectHelperSnippet], ['.vscode', 'project.code-snippets']);
		wailsUtils.jsonPrepare([wailsProjectHelperSettings], ['.vscode', 'settings.json']);
		wailsUtils.writeFileContent(wailsFileContentsUtilsGetterSetter, [
			'backend',
			'UtilsGetterSetter.go',
		]);
		wailsUtils.writeFileContent(wailsFileContentsConnection, ['backend', 'Connection.go']);
		new FSDirArchWatcher(
			[
				/** */
				Paths.diskAbsolute('/backend/'),
				Paths.diskAbsolute('/sql/'),
			],
			{
				debounce: delay,
				each: async (ev, path, stats) => {
					if (!stats || !stats.isFile()) {
						throw '';
					}
					switch (ev) {
						case 'add':
						case 'change':
							break;
						default:
							throw '';
					}
					switch (extname(path)) {
						case '.sql':
							await Wails2Dev.#sql(path);
							Console.info(`✅ Successfully handles:'${path}'`, { now: true });
							throw '';
						case '.go':
							const [response, err] = await Wails2Dev.#go(path, minDelay);
							if (err) {
								throw err;
							}
							Console.info({ message: `✅ Successfully handles:'${path}'` }, { now: true });
							return response;
						default:
							throw '';
					}
				},
				full: async ({ array }) => {
					/**
					 * @type {Set<string>}
					 */
					const importList = new Set();
					/**
					 * @type {Array<string>}
					 */
					const imports = [];
					/**
					 * @type {Array<string>}
					 */
					const funcs = [];
					for (let i = 0; i < array.length; i++) {
						const arrI = array[i];
						if (!arrI) {
							continue;
						}
						const [__path, res] = arrI;
						const { funcDeclaration, importFrom } = res;
						if (!importList.has(importFrom)) {
							imports.push(`. "${importFrom}"`);
							imports.push(`SQL "${projectName}/sql"`);
							importList.add(importFrom);
						}
						funcs.push(funcDeclaration);
					}
					const pathToSaveTo = Paths.diskAbsolute('/auto_ipc.go');
					const trueContent = wailsUtils.formatGoCodeString(
						pathToSaveTo,
						`package main\nimport(\n${imports.join('\n')}\n)\n\n${funcs.join('\n')}`,
					);
					const [, error] = await FileSafe.write(pathToSaveTo, trueContent, {
						encoding: Preferrence.encoding,
					});
					if (error) {
						return;
					}
					Console.info(`✅ Successfully build:'${pathToSaveTo}'`, { now: true });
				},
			},
		);
	}
}
