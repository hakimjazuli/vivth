// @ts-check

import { dirname, extname, join } from 'node:path';

import { createPackageFromFiles } from '@electron/asar';

import { Paths } from '../class/Paths.mjs';
import { LitExp } from '../class/LitExp.mjs';
import { TryAsync } from '../function/TryAsync.mjs';
import { commonContentFixesBundled } from './adds/ToBundledJSPlugin.mjs';
import { Console } from '../class/Console.mjs';
import { EsBundler } from './EsBundler.mjs';
import { CreateTransform } from './adds/CreateTransform.mjs';
import { GetFilesFromDir } from '../function/GetFilesFromDir.mjs';
import { readFile } from 'node:fs/promises';
import { Preferrence } from '../common/Preferrence.mjs';

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
	 * @param {Object} asarConfig
	 * @param {Parameters<createPackageFromFiles>[3]} [asarConfig.InputMetadata]
	 * @param {Parameters<createPackageFromFiles>[4]} [asarConfig.options]
	 * @param {string} bundledJSFilePath
	 * @returns {ReturnType<typeof TryAsync<string>>}
	 * @example
	 * import { readFile } from 'node:fs/promises';
	 *
	 * import { FSAnalyzer } from 'vivth/node';
	 * import { Preferrence } from 'vivth/neutral';
	 *
	 * const filePath = 'README.md';
	 * const [resultFinalContent, errorFinalContent] = await FSAnalyzer.finalContent(
	 * 	filePath,
	 * 	await readFile(filePath, {encoding: Preferrence.encoding}),
	 * 	'esm',
	 * 	{},
	 * 	...args
	 * );
	 */
	static finalContent = async (entryPoint, content, asarConfig, bundledJSFilePath) => {
		return await TryAsync(async () => {
			content = commonContentFixesBundled(entryPoint, content);
			FSAnalyzer.#analyze_asarFile(Paths.root, content, asarConfig, bundledJSFilePath);
			return content;
		});
	};

	/**
	 * return regex as string from template literal that are supposed to be regex
	 * @param {string} str
	 * @returns {RegExp}
	 */
	static #hydrateRegex = (str) => {
		const arr = str.split('/');
		str = `/${arr[1]}/`;
		const match = str.match(/^\/(.*)\/([a-z]*)$/);
		if (match === null) {
			throw { str, message: 'Invalid regex string format' };
		}
		const [, pattern = '', flags] = match;
		return new RegExp(pattern, flags);
	};

	/**
	 * @param {string} rootPath
	 * @param {string} content
	 * @param {Parameters<typeof FSAnalyzer["finalContent"]>[2]} asarConfig
	 * @param {string} bundledJSFile
	 * @returns {Promise<void>}
	 */
	static #analyze_asarFile = async (rootPath, content, asarConfig, bundledJSFile) => {
		rootPath = Paths.normalize(rootPath);
		const [literalBundle, errorPrepareRegexBundle] = LitExp.prepare({
			ref: /[\w][\w\d]*/,
			method: /\.vivthBundles\s*?\(\s*?['"]/,
			path: /[\w\W\/\.]*/,
			methodClosing: /['"]/,
			closing: /\s*[,);]/,
		});
		const [literalFile, errorPrepareRegexFile] = LitExp.prepare({
			ref: /[\w][\w\d]*/,
			method: /\.vivthFile\s*?\(\s*?['"]/,
			path: /[\w\W\/\.]*/,
			methodClosing: /['"]/,
			closing: /\s*[,);]/,
		});
		const [literalDir, errorPrepareRegexDir] = LitExp.prepare({
			ref: /[\w][\w\d]*/,
			method: /\.vivthDir\s*?\(\s*?['"]/,
			path: /[\w\W\/\.]*/,
			methodClosing: /['"]\s*?,\s*?/,
			rule: false,
			closing: /\s*[,);]/,
		});
		if (errorPrepareRegexBundle || errorPrepareRegexFile || errorPrepareRegexDir) {
			Console.error(
				{
					errorPrepareRegexBundle,
					errorPrepareRegexFile,
					errorPrepareRegexDir,
				},
				{ now: true },
			);
			return;
		}
		const templateBundle = literalBundle`${'ref'}${'method'}${'path'}${'methodClosing'}${'closing'}`;
		const templateFile = literalFile`${'ref'}${'method'}${'path'}${'methodClosing'}${'closing'}`;
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
		if (errorMatchingBundle || errorMatchingFile || errorMatchingDir) {
			Console.error({ errorMatchingBundle, errorMatchingFile, errorMatchingDir }, { now: true });
			return;
		}
		const { InputMetadata = {}, options = {} } = asarConfig;
		const asarPath = bundledJSFile.replace(new RegExp(`${extname(bundledJSFile)}\$`, ''), '.asar');
		const {
			result: { named: namedBundle },
			// regexp: regexBundle,
		} = resultMatchingBundle;
		const {
			result: { named: namedFile },
			// regexp: regexFile,
		} = resultMatchingFile;
		const {
			result: { named: namedDir },
			// regexp: regexDir,
		} = resultMatchingDir;
		// Console.info({
		// 	regexBundle,
		// 	regexFile,
		// 	regexDir,
		// });
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
			if (res === undefined) {
				continue;
			}
			const fullPath = Paths.normalize(join(Paths.root, res.path));
			const extension = extname(fullPath);
			if (checkBundle.has(fullPath)) {
				continue;
			}
			const [stringRes, errorBundling] = await EsBundler(
				{
					content: await readFile(fullPath, { encoding: Preferrence.encoding }),
					// @ts-expect-error
					extension,
					root: dirname(fullPath),
					withBinHeader: false,
				},
				{
					format: 'esm',
					minify: true,
					absWorkingDir: dirname(fullPath),
				},
			);
			if (errorBundling) {
				Console.error({ errorBundling }, { now: true });
				continue;
			}
			fileNames.add(fullPath);
			checkBundle.set(fullPath, commonContentFixesBundled(fullPath, stringRes));
		}
		for (let i = 0; i < namedDir.length; i++) {
			const res = namedDir[i];
			if (res === undefined) {
				continue;
			}
			const { path, rule } = res;
			const fullPath = Paths.normalize(join(Paths.root, path));
			if (checkDir.has(fullPath)) {
				continue;
			}
			checkDir.add(fullPath);
			const rule_ = FSAnalyzer.#hydrateRegex(rule.trim());
			await GetFilesFromDir(fullPath, rule_, fileNames);
		}
		for (let i = 0; i < namedFile.length; i++) {
			const res = namedFile[i];
			if (res === undefined) {
				continue;
			}

			const fullPath = Paths.normalize(join(Paths.root, res.path));
			if (checkFile.has(fullPath)) {
				continue;
			}
			checkFile.add(fullPath);
			fileNames.add(fullPath);
		}
		const optionsTransform = options.transform;
		options.transform = (filePath) => {
			filePath = Paths.normalize(filePath);
			const newStringFromBundle = checkBundle.get(filePath);
			if (newStringFromBundle) {
				return CreateTransform(newStringFromBundle);
			}
			const res = optionsTransform?.(filePath);
			if (!res) {
				return;
			}
			return res;
		};
		await createPackageFromFiles(rootPath, asarPath, Array.from(fileNames), InputMetadata, options);
	};
}
