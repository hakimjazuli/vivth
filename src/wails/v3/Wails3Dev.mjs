// @ts-check

import { basename, dirname, extname, join, relative } from 'node:path';
import { Console } from '../../class/Console.mjs';
import { FSDirArchWatcher } from '../../class/FSDirArchWatcher.mjs';
import { Paths } from '../../class/Paths.mjs';
import { QChannel } from '../../class/QChannel.mjs';
import { TryAsync } from '../../function/TryAsync.mjs';
import {
	wailsFileContentsConnection,
	wailsFileContentsUtilsGetterSetter,
	wailsProjectHelperSnippetService,
	wailsProjectHelperEmitter,
	wailsProjectHelperSettings,
	wailsProjectHelperSnippet,
} from '../wailsProjectHelper.mjs';
import { wailsUtils } from '../wailsUtils.mjs';
import { Timeout } from '../../function/Timeout.mjs';
import { readFile } from 'node:fs/promises';
import { Preferrence } from '../../common/Preferrence.mjs';
import { FileSafe } from '../../class/FileSafe.mjs';
import { ForOfSync } from '../../function/ForOfSync.mjs';
import { LazyFactory } from '../../function/LazyFactory.mjs';
import { Signal } from '../../class/Signal.mjs';
import { Effect } from '../../class/Effect.mjs';
import { toValidJsConstName } from '../wails3BindingsGeneratorHelper.mjs';

/**
 * @description
 * suited for wails3 project with stateless backend getter setter pattern using `sqlite3`;
 * this class assume `Paths` and `SafeExit` to be instantiated;
 * helper method with pre templated way of:
 * - sqlite go code generation from SQL file on `{projectroot}/sql`;
 * - main_services.go generation from `{projectroot}/backend`;
 * > > - function commented with `// FORM`;
 * > - provide auto formatter and ipc generator for `// FORM` pattern;
 * > > - `// FORM` prefix for setter function;
 * - provide OOP-ish approach snippets(for .vscode):
 * > - `??staticPrepare`;
 * > - `??staticMethod`;
 * > - `??instancePrepare`;
 * > - `??instanceSingletonPrepare`;
 * > - `??instanceMethod`;
 * > - `??servicePrepare`;
 * > - `??serviceMethod`;
 * > - `??eventRegister`;
 * > - `??initPrepare`;
 * - provide `explorer.fileNesting.patterns` on `settings.json` for `.vscode`;
 * > - will nest based on parent `*.md` and `*.sql`;
 * - provide standard `backend/Connection.go` for connecting to `sqlite3` database;
 * > - you should require `modernc.org/sqlite` by running `go get modernc.org/sqlite`;
 * - provide standard internal `backend/UtilsGetterSetter.go` for thread-safe, multiple readers/writters;
 * - provide getter setter pattern `backend/Emitter.go` for return template;
 */
export class Wails3Dev {
	/**
	 * @type {Wails3Dev | undefined}
	 */
	static #instance;
	static #q = new QChannel('Vivth:Wails3Dev');

	/**
	 * - parse sql file into typed go function, in same dir;
	 * - package is always sql, so dirname should be sql;
	 * - type are self closing, it recogninse go native types;
	 * - `:` prefix is for input field;
	 * - type then no `:` prefix means it is an output field;
	 * @param {string} filePath
	 * @returns {ReturnType<typeof TryAsync<boolean>>}
	 */
	static #sql = (filePath) => {
		return wailsUtils.pathToSQLHandler(filePath);
	};
	/**
	 * @param {string} name
	 * @returns {string}
	 */
	static #createServiceString = (name) => {
		return `application.NewService(&backend.${name}{})`;
	};
	/**
	 * @param {string} filePath
	 * @returns {string}
	 */
	static #getPackageFromContent = (filePath) => {
		return Paths.normalize(join(basename(Paths.root), relative(Paths.root, dirname(filePath))));
	};
	/**
	 * Extracts string elements from `EmitterStatic.New([]string{...})`.
	 * Returns an empty array if no non-empty string slice is found.
	 *
	 * @param {string} content
	 * @returns {string[]}
	 */
	static #extractEmitterStrings = (content) => {
		const blockMatch = content.match(/EmitterStatic\.New\(\s*\[\s*\]string\s*\{([\s\S]*?)\}\s*\)/);
		if (!blockMatch) {
			return [];
		}

		const inner = blockMatch[1];
		if (!inner) {
			return [];
		}
		const items = [];
		const literalPattern = /"(?:\\.|[^"\\])*"|`[^`]*`/g;

		for (const match of inner.matchAll(literalPattern)) {
			const raw = match[0];
			if (raw.startsWith('"')) {
				items.push(JSON.parse(raw));
			} else {
				items.push(raw.slice(1, -1));
			}
		}

		return items;
	};
	static #Wails3ListenersBindings = LazyFactory(
		/**
		 * @returns {Signal<Map<string, Set<string>>>}
		 */ () => new Signal(new Map()),
	);
	/**
	 * @param {Set<string>} trueBindings
	 * @returns {string}
	 */
	static #CreateVivthWails3BindingsString = (trueBindings) => {
		/**
		 * @type {string[]}
		 */
		const base = ['// @ts-check', "import { Wails3Listener } from 'vivth/neutral';"];
		const ascArr = Array.from(trueBindings).sort((a, b) => a.localeCompare(b));
		for (let i = 0; i < ascArr.length; i++) {
			const str = ascArr[i];
			if (!str) {
				continue;
			}
			const varName = toValidJsConstName(str);
			base.push(
				`/**
 * @description
 * - call to generate Wails3Listener instance for \`${varName}\`;
 * - call the returned \`.vivthCleanup\` to prevent leaks;
 * > - like on component destroyed/unmout, etc.;
 * @param { ConstructorParameters<typeof Wails3Listener>[1] } handler
 * @returns { Wails3Listener }
 */
export const NewWails3ListenerFor_${varName} = (handler) => new Wails3Listener('${str}', handler);`,
			);
		}
		return `${base.join('\n')}\n`;
	};
	static #Wails3ListenersBindingsEffect = LazyFactory(
		() =>
			new Effect(async ({ subscribe, isLastCalled }) => {
				await Timeout(Wails3Dev.#delay);
				if (!(await isLastCalled())) {
					throw 'not the last call';
				}
				const core = subscribe(Wails3Dev.#Wails3ListenersBindings).value;
				const trueBindings = new Set();
				ForOfSync(core, ([, setOfString]) => {
					ForOfSync(setOfString, (string) => {
						trueBindings.add(string);
					});
				});
				const stringBindings = Wails3Dev.#CreateVivthWails3BindingsString(trueBindings);
				await FileSafe.write(
					Paths.diskAbsolute('/frontend/vivth/wails/listenerEvents.mjs'),
					stringBindings,
					{
						encoding: Preferrence.encoding,
					},
				);
			}),
	);
	/**
	 * @param {string} filePath
	 * @param {'add'|'delete'} eventName
	 * @returns {Promise<void>}
	 */
	static #goRegisterVivthWails3Emitters = async (filePath, eventName) => {
		const [content, errorRead] = await TryAsync(async () => {
			return readFile(filePath, { encoding: Preferrence.encoding });
		});

		if (errorRead) {
			Wails3Dev.#Wails3ListenersBindings.value.delete(filePath);
		} else {
			const emitterEvents = Wails3Dev.#extractEmitterStrings(content);
			if (emitterEvents.length === 0) {
				return;
			}
			// accessing 1 of the property to trigger lazy factory generator
			Wails3Dev.#Wails3ListenersBindingsEffect.options;
			switch (eventName) {
				case 'add':
					Wails3Dev.#Wails3ListenersBindings.value.set(filePath, new Set(emitterEvents));
					break;
				case 'delete':
					Wails3Dev.#Wails3ListenersBindings.value.delete(filePath);
					break;
			}
			Wails3Dev.#Wails3ListenersBindings.subscribers.notify();
			if (errorRead) {
				throw errorRead;
			}
		}
	};
	/**
	 * @param {string} filePath
	 * @returns {ReturnType<typeof TryAsync<{
	 *   importFromPackage: string;
	 *   serviceDeclaration: string;
	 * }>>}
	 */
	static #goCheckServices = async (filePath) => {
		return await Wails3Dev.#q.callback(filePath, async ({ isLastOnQ }) => {
			/**
			 * prevent rapid autoformat by go autoformatter to be handled immediately
			 */
			await Timeout(Wails3Dev.#delay);
			if (!isLastOnQ()) {
				throw 'not the last call';
			}
			// Derive naming variants from file basename
			const rawBaseName = basename(filePath, extname(filePath));
			if (!rawBaseName.endsWith('Service')) {
				throw 'not a Service';
			}
			const [content, errorRead] = await TryAsync(async () => {
				return readFile(filePath, { encoding: Preferrence.encoding });
			});

			if (!!errorRead) {
				throw errorRead;
			}

			// Ensure lowercase lead and upper pascal lead
			// const baseNameLowerLead = rawBaseName.charAt(0).toLowerCase() + rawBaseName.slice(1);
			const baseNameUpperLead = rawBaseName.charAt(0).toUpperCase() + rawBaseName.slice(1);

			// CHECKS HERE: Ensure type ${baseNameUpperLead} struct exists
			const structRegex = new RegExp(`type\\s+${baseNameUpperLead}\\s+struct\\s*\\{[\\s\\S]*?\\}`);

			if (!structRegex.test(content)) {
				throw new Error(`Missing struct type ${baseNameUpperLead} in ${filePath}`);
			}

			let modifiedContent = content;
			let needsCorrection = false;

			const setterRegex = new RegExp(
				`(\\/\\/\\s*FORM\\s*\\n)(?:\\/\\/.*\\n)*\\s*func\\s*\\(\\s*thisService\\s*(?:\\*)?${baseNameUpperLead}\\s*\\)\\s+([A-Za-z_]\\w*)\\s*\\(([^)]*)\\)\\s*(\\(?[^)]*\\)?)\\s*(\\{[\\s\\S]*?\\})`,
				'g',
			);

			modifiedContent = modifiedContent.replace(
				setterRegex,
				/**
				 * @param {string} match
				 * @param {string} setterComment
				 * @param {string} funcName
				 * @param {string} args
				 * @param {string} returnType
				 * @param {string} body
				 * @returns {string}
				 */
				(match, setterComment, funcName, args, returnType, body) => {
					/**
					 * @type {string}
					 */
					let currentArgs = args.trim();
					let currentReturn = returnType.trim();

					let functionNeedsCorrection = false;
					let correctedArgs = currentArgs;

					// Parse arguments by splitting safely (accounting for spaces/commas)
					const argParts = currentArgs
						? currentArgs
								.split(',')
								.map((s) => s.trim())
								.filter(Boolean)
						: [];

					if (argParts.length > 0) {
						// More than one argument: keep only arg0 (the first one)
						if (argParts.length > 1) {
							functionNeedsCorrection = true;
						}

						let arg0 = argParts[0];
						if (!arg0) {
							return match; // Safe guard: return original match if empty
						}

						// An argument looks like "name Type" or just "Type" (unnamed)
						const argTokens = arg0.split(/\s+/);
						let argType = argTokens.length > 1 ? argTokens[argTokens.length - 1] : argTokens[0];
						if (!argType) {
							return match; // Safe guard
						}

						// Clean up pointer prefixes or package prefixes to check ending
						const cleanType = argType.replace(/^[*]+/, '').split('.').pop();
						if (!cleanType) {
							return match; // Safe guard
						}

						if (!cleanType.endsWith('Struct')) {
							// Rename the type of arg0 to TypeMustEndWithStruct (preserving argument name if present)
							functionNeedsCorrection = true;
							if (argTokens.length > 1) {
								const argName = argTokens.slice(0, -1).join(' ');
								const pkgMatch = argType.match(/^(.+\.)?(.+)$/);
								const pkgPrefix = pkgMatch && pkgMatch[1] ? pkgMatch[1] : '';
								const isPointer = argType.startsWith('*');
								const newType = (isPointer ? '*' : '') + pkgPrefix + 'TypeMustEndWithStruct';
								arg0 = `${argName} ${newType}`;
							} else {
								const pkgMatch = argType.match(/^(.+\.)?(.+)$/);
								const pkgPrefix = pkgMatch && pkgMatch[1] ? pkgMatch[1] : '';
								const isPointer = argType.startsWith('*');
								arg0 = (isPointer ? '*' : '') + pkgPrefix + 'TypeMustEndWithStruct';
							}
						}

						correctedArgs = arg0;
					} else {
						// Zero arguments -> default to required single argument struct
						correctedArgs = `input TypeMustEndWithStruct`;
						functionNeedsCorrection = true;
					}

					// Check return values: must be (*EmitterInstance, error) or (*EmitterInstance, error)
					let correctedReturn = currentReturn;
					const normalizedReturn = currentReturn.replace(/\s+/g, '');
					const validReturns = ['(*EmitterInstance,error)'];

					if (!validReturns.includes(normalizedReturn)) {
						correctedReturn = '(*EmitterInstance, error)';
						functionNeedsCorrection = true;
					}

					if (functionNeedsCorrection) {
						needsCorrection = true;
						// Prepend the required warning comment right after // FORM
						const warningComment = `// only one argument is allowed, and it's type must ends with Struct\n`;
						return `${setterComment}${warningComment}func (thisClass *${baseNameUpperLead}) ${funcName}(${correctedArgs}) ${correctedReturn} ${body}`;
					}

					return match;
				},
			);

			if (needsCorrection) {
				await FileSafe.write(filePath, wailsUtils.formatGoCodeString(filePath, modifiedContent), {
					encoding: Preferrence.encoding,
				});
				throw `running correction for:"${filePath}"`;
			}

			return {
				importFromPackage: Wails3Dev.#getPackageFromContent(filePath),
				serviceDeclaration: Wails3Dev.#createServiceString(baseNameUpperLead),
			};
		});
	};
	/**
	 * @type {number}
	 */
	static #delay = 182;
	/**
	 * @description
	 * - this is a singleton constructor;
	 * - dev script to watch multiple directories on your `projectRoot` for auto format and auto generate things;
	 * @param {number} [minDelay]
	 * - used to add timeout for ide go autoformatter;
	 * - default 200;
	 * @example
	 * import { Paths } from 'vivth/neutral';
	 * import { Wails3Dev, SafeExit } from 'vivth/node';
	 * new Paths({
	 * 	root: process.env.INIT_CWD ?? process.cwd(),
	 * });
	 * new SafeExit('SIGTERM', 'SIGINT');
	 * new Wails3Dev();
	 */
	constructor(minDelay = 200) {
		if (Wails3Dev.#instance) {
			return Wails3Dev.#instance;
		}
		const projectName = wailsUtils.getProjectName();
		Wails3Dev.#delay = minDelay + Wails3Dev.#delay;
		if (!wailsUtils.checkGoProjectName(projectName)) {
			throw { problem: 'projectName, must supports go project name standard', projectName };
		}
		wailsUtils.jsonPrepare(
			[wailsProjectHelperSnippet, wailsProjectHelperSnippetService],
			['.vscode', 'project.code-snippets'],
		);
		wailsUtils.jsonPrepare([wailsProjectHelperSettings], ['.vscode', 'settings.json']);
		wailsUtils.writeFileContent(wailsFileContentsUtilsGetterSetter, [
			'backend',
			'UtilsGetterSetter.go',
		]);
		wailsUtils.writeFileContent(wailsFileContentsConnection, ['backend', 'Connection.go']);
		wailsUtils.writeFileContent(wailsProjectHelperEmitter, ['backend', 'Emitter.go']);
		new FSDirArchWatcher(
			[
				/** */
				Paths.diskAbsolute('/backend/'),
				Paths.diskAbsolute('/sql/'),
			],
			{
				debounce: Wails3Dev.#delay,
				each: async (ev, path, stats) => {
					if (!stats || !stats.isFile()) {
						await Wails3Dev.#goRegisterVivthWails3Emitters(path, 'delete');
						throw '';
					}
					switch (ev) {
						case 'add':
						case 'change':
							await Wails3Dev.#goRegisterVivthWails3Emitters(path, 'add');
							break;
						default:
							await Wails3Dev.#goRegisterVivthWails3Emitters(path, 'delete');
							throw '';
					}
					switch (extname(path)) {
						case '.sql':
							await Wails3Dev.#sql(path);
							Console.info(`✅ Successfully handles:'${path}'`, { now: true });
							throw '';
						case '.go':
							const [response, err] = await Wails3Dev.#goCheckServices(path);
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
					 * @type {string[]}
					 */
					const services = [];
					const packages = new Set();
					ForOfSync(array, ([_path, { importFromPackage, serviceDeclaration }]) => {
						packages.add(importFromPackage);
						services.push(serviceDeclaration);
					});
					const path_main_services_go = Paths.diskAbsolute('main_services.go');
					await FileSafe.write(
						path_main_services_go,
						wailsUtils.formatGoCodeString(
							path_main_services_go,
							wailsUtils.generateAppServiceContent(packages, services),
						),
						{ encoding: Preferrence.encoding },
					);
				},
			},
		);
	}
}
