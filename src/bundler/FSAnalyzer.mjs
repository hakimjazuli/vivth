// @ts-check

import { dirname, extname, join } from 'node:path';
import { readFile } from 'node:fs/promises';

import { createPackageFromFiles } from '@electron/asar';

import { Paths } from '../class/Paths.mjs';
import { LitExp } from '../class/LitExp.mjs';
import { TryAsync } from '../function/TryAsync.mjs';
import { commonContentFixesBundled } from './adds/ToBundledJSPlugin.mjs';
import { Console } from '../class/Console.mjs';
import { EsBundler } from './EsBundler.mjs';
import { Preferrence } from '../common/Preferrence.mjs';
import { CreateTransform } from './adds/CreateTransform.mjs';
import { GetFilesFromDir } from '../function/GetFilesFromDir.mjs';
import { PipeAsync } from '../function/PipeAsync.mjs';
import { FSasar } from './FSasar.mjs';
import { PathFSFile } from './adds/PathFSFile.mjs';

/**
 * @description
 * - collections of static method to process content for:
 * >- `FSasar`;
 * - mostly used internally;
 */
export class FSAnalyzer {
	/**
	 * @typedef {typeof import('@electron/asar')["createPackageFromFiles"]} createPackageFromFiles
	 */
	/**
	 * @description
	 * - to be used on bundled content;
	 * @param {string} entryPoint
	 * @param {string} content
	 * @param {'cjs'|'esm'} format
	 * @param {Object} asarConfig
	 * @param {Parameters<createPackageFromFiles>[3]} [asarConfig.InputMetadata]
	 * @param {Parameters<createPackageFromFiles>[4]} [asarConfig.options]
	 * @param {string} bundledJSFilePath
	 * @returns {ReturnType<typeof TryAsync<string>>}
	 * @example
	 * import { readFile } from 'node:fs/promises';
	 *
	 * import { FSInlineAnalyzer } from 'vivth';
	 *
	 * const filePath = join(Paths.root,'README.md'); // assuming Paths is already instantiated once;
	 * const [resultFinalContent, errorFinalContent] = await FSInlineAnalyzer.finalContent(
	 * 	filePath,
	 * 	await readFile(filePath, {encoding: 'utf-8'}),
	 * 	'esm',
	 * 	{},
	 * 	...args
	 * );
	 */
	static finalContent = async (entryPoint, content, format, asarConfig, bundledJSFilePath) => {
		return await TryAsync(async () => {
			content = commonContentFixesBundled(entryPoint, format, content);
			FSAnalyzer.#analyze_asarFile(Paths.root, format, content, asarConfig, bundledJSFilePath);
			return content;
		});
	};
	/**
	 * return regex as string from template literal that are supposed to be regex
	 * @param {string} str
	 * @returns {RegExp}
	 */
	static #hydrateRegex = (str) => {
		const match = str.match(/^\/(.*)\/([a-z]*)$/);
		if (
			/**  */
			match === null
		) {
			throw { str, message: 'Invalid regex string format' };
		}
		const [, pattern = '', flags] = match;
		return new RegExp(pattern, flags);
	};
	/**
	 * @param {string} rootPath
	 * @param {Parameters<typeof FSAnalyzer["finalContent"]>[2]} format
	 * @param {string} content
	 * @param {Parameters<typeof FSAnalyzer["finalContent"]>[3]} asarConfig
	 * @param {string} bundledJSFile
	 * @returns {Promise<void>}
	 */
	static #analyze_asarFile = async (rootPath, format, content, asarConfig, bundledJSFile) => {
		rootPath = Paths.normalize(rootPath);
		const [literalBundle, errorPreparBundle] = LitExp.prepare({
			ref: /[\w][\w\d]*/,
			method: /\.vivthBundles\s*?\(\s*?['"]/,
			path: false,
			methodClosing: /['"]/,
		});
		const [literalFile, errorPreparFile] = LitExp.prepare({
			ref: /[\w][\w\d]*/,
			method: /\.vivthFile\s*?\(\s*?['"]/,
			path: false,
			methodClosing: /['"]/,
		});
		const [literalDir, errorPrepareDir] = LitExp.prepare({
			ref: /[\w][\w\d]*/,
			method: /\.vivthDir\s*?\(\s*?['"]/,
			path: false,
			methodClosing: /['"]\s*?,\s*?/,
			rule: false,
			closing: /\s*?(?:,|\))/,
		});
		if (
			/**  */
			errorPreparBundle ||
			errorPreparFile ||
			errorPrepareDir
		) {
			Console.error({ errorPreparBundle, errorPreparFile, errorPrepareDir });
			return;
		}
		const templateBundle = literalBundle`${'ref'}${'method'}${'path'}${'methodClosing'}`;
		const templateFile = literalFile`${'ref'}${'method'}${'path'}${'methodClosing'}`;
		const templateDir = literalDir`${'ref'}${'method'}${'path'}${'methodClosing'}${'rule'}${'closing'}`;
		const [resultMatchingBundle, errorMatchingBundle] =
			templateBundle.evaluate.matchedAllAndGrouped(content, {
				flags: 'gm',
				whiteSpaceSensitive: false,
			});
		const [resultMatchingFile, errorMatchingFile] = templateFile.evaluate.matchedAllAndGrouped(
			content,
			{
				flags: 'gm',
				whiteSpaceSensitive: false,
			},
		);
		const [resultMatchingDir, errorMatchingDir] = templateDir.evaluate.matchedAllAndGrouped(
			content,
			{
				flags: 'gm',
				whiteSpaceSensitive: false,
			},
		);
		if (
			/**  */
			errorMatchingBundle ||
			errorMatchingFile ||
			errorMatchingDir
		) {
			Console.error({ errorMatchingBundle, errorMatchingFile, errorMatchingDir });
			return;
		}
		const { InputMetadata = {}, options = {} } = asarConfig;
		const asarPath = bundledJSFile.replace(new RegExp(`${extname(bundledJSFile)}\$`, ''), '.asar');
		const {
			result: { named: namedBundle },
		} = resultMatchingBundle;
		const {
			result: { named: namedFile },
		} = resultMatchingFile;
		const {
			result: { named: namedDir },
		} = resultMatchingDir;
		/**
		 * @type {Set<string>}
		 */
		const fileNames = new Set();
		/**
		 * @type {Map<string, string>}
		 */
		const checkBundle = new Map();
		/**
		 * @type {Set<string>}
		 */
		const checkFile = new Set();
		/**
		 * @type {Set<string>}
		 */
		const checkDir = new Set();
		for (let i = 0; i < namedBundle.length; i++) {
			const res = namedBundle[i];
			if (
				/**  */
				res === undefined
			) {
				continue;
			}
			const fullPath = Paths.normalize(join(Paths.root, res.path));
			const extension = extname(fullPath);
			if (
				/**  */
				checkBundle.has(fullPath)
			) {
				continue;
			}
			const [stringRes, errorBundling] = await EsBundler(
				{
					content: await PipeAsync(
						await readFile(fullPath, { encoding: Preferrence.encoding }),
						async (content) => {
							switch (format) {
								case 'cjs':
									return `${(await FSasar.file(PathFSFile.vivthFile('../polyfills/PKGPolyfill.mjs'))).toString(Preferrence.encoding)}
${content}`;
								case 'esm':
								default:
									return content;
							}
						},
					),
					// @ts-expect-error
					extension,
					root: dirname(fullPath),
					withBinHeader: false,
				},
				{
					format,
					minify: true,
					absWorkingDir: dirname(fullPath),
				},
			);
			if (
				/**  */
				errorBundling
			) {
				Console.error({ errorBundling });
				continue;
			}
			fileNames.add(fullPath);
			checkBundle.set(fullPath, commonContentFixesBundled(fullPath, format, stringRes));
		}
		for (let i = 0; i < namedDir.length; i++) {
			const res = namedDir[i];
			if (
				/**  */
				res === undefined
			) {
				continue;
			}
			const { path, rule } = res;
			const fullPath = join(Paths.root, path);
			if (
				/**  */
				checkDir.has(fullPath)
			) {
				continue;
			}
			checkDir.add(fullPath);
			const rule_ = FSAnalyzer.#hydrateRegex(rule.trim());
			await GetFilesFromDir(fullPath, rule_, fileNames);
		}
		for (let i = 0; i < namedFile.length; i++) {
			const res = namedFile[i];
			if (
				/**  */
				res === undefined
			) {
				continue;
			}
			const fullPath = join(Paths.root, res.path);
			if (
				/**  */
				checkFile.has(fullPath)
			) {
				continue;
			}
			checkFile.add(fullPath);
			fileNames.add(fullPath);
		}
		const optionsTransform = options.transform;
		options.transform = (filePath) => {
			filePath = Paths.normalize(filePath);
			const newStringFromBundle = checkBundle.get(filePath);
			if (
				/**  */
				newStringFromBundle
			) {
				return CreateTransform(newStringFromBundle);
			}
			const res = optionsTransform?.(filePath);
			if (
				/**  */
				!res
			) {
				return;
			}
			return res;
		};
		await createPackageFromFiles(rootPath, asarPath, Array.from(fileNames), InputMetadata, options);
	};
}
