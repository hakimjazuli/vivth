// @ts-check

import { dirname, extname, join, relative } from 'node:path';
import { readFile, readdir } from 'node:fs/promises';

import { Paths } from '../class/Paths.mjs';
import { LitExp } from '../class/LitExp.mjs';
import { TryAsync } from '../function/TryAsync.mjs';
import { FSInline } from './FSInline.mjs';
import { EsBundler } from './EsBundler.mjs';
import { removeVivthDevCodeBlock } from './adds/ToBundledJSPlugin.mjs';

/**
 * @param {string} str
 * @returns {RegExp}
 */
const hydrateRegex = (str) => {
	const match = str.match(/^\/(.*)\/([a-z]*)$/);
	if (match === null) {
		throw new Error('Invalid regex string format');
	}
	const [, pattern = '', flags] = match;
	return new RegExp(pattern, flags);
};

/**
 * @description
 * - collections of static method to analyze content for `FSInline`;
 * - mostly used internally;
 */
export class FSInlineAnalyzer {
	/**
	 * @description
	 * - to be used on bundled content;
	 * @param {string} content
	 * @param {'cjs'|'esm'} format
	 * @returns {ReturnType<typeof TryAsync<string>>}
	 * @example
	 * import { readFile } from 'node:fs/promises';
	 *
	 * import { FSInlineAnalyzer } from 'vivth';
	 *
	 * const [resultFinalContent, errorFinalContent] = await FSInlineAnalyzer.finalContent(
	 * 	await readFile('./resultESBunlded.mjs', {encoding: 'utf-8'}),
	 * 	'esm'
	 * );
	 */
	static finalContent = async (content, format) => {
		return await TryAsync(async () => {
			content = removeVivthDevCodeBlock(content);
			const [literalFile, errorPrepareFile] = LitExp.prepare({
				FSInline: /[\w][\w\d]*/,
				method: /\.vivthFSInlineFile\s*?\(\s*?['"]/,
				path: false,
				closing: /['"]\s*?\)/,
			});
			const [literalWorker, errorPreparWorker] = LitExp.prepare({
				ref: /[\w][\w\d]*/,
				method: /\.newVivthWorker\s*?\(\s*?['"]/,
				path: false,
				closing: /['"]\s*\)/,
			});
			const [literalDir, errorPrepareDir] = LitExp.prepare({
				FSInline: /[\w][\w\d]*/,
				method: /\.vivthFSInlineDir\s*?\(\s*?['"]/,
				path: false,
				methodClosing: /['"]\s*?,\s*/,
				rule: false,
				functionClosing: /\s*?\)/,
			});
			if (errorPrepareFile || errorPrepareDir || errorPreparWorker) {
				throw { errorPrepareFile, errorPrepareDir, errorPreparWorker };
			}
			const templateFile = literalFile`${'FSInline'}${'method'}${'path'}${'closing'}`;
			const templateWorker = literalWorker`${'ref'}${'method'}${'path'}${'closing'}`;
			const templateDir = literalDir`${'FSInline'}${'method'}${'path'}${'methodClosing'}${'rule'}${'functionClosing'}`;
			const [resultMatchingFile, errorMatchingFile] = templateFile.evaluate.matchedAllAndGrouped(
				content,
				{
					flags: 'gm',
					whiteSpaceSensitive: false,
				}
			);
			const [resultMatchingWorker, errorMatchingWorker] =
				templateWorker.evaluate.matchedAllAndGrouped(content, {
					flags: 'gm',
					whiteSpaceSensitive: false,
				});
			const [resultMatchingDir, errorMatchingDir] = templateDir.evaluate.matchedAllAndGrouped(
				content,
				{
					flags: 'gm',
					whiteSpaceSensitive: false,
				}
			);
			if (errorMatchingFile || errorMatchingDir || errorMatchingWorker) {
				throw { errorMatchingFile, errorMatchingDir, errorMatchingWorker };
			}
			if (Paths.root === undefined) {
				throw new Error('Path.root undefined');
			}
			const {
				result: { named: namedFile },
			} = resultMatchingFile;
			for (let i = 0; i < namedFile.length; i++) {
				const res = namedFile[i];
				if (res === undefined) {
					continue;
				}
				const { path } = res;
				if ('path' in FSInline.vivthFSInlinelists) {
					continue;
				}
				FSInline.vivthFSInlinelists[path] = Buffer.from(
					removeVivthDevCodeBlock(await readFile(join(Paths.root, path), { encoding: 'utf-8' }))
				);
			}
			const {
				result: { named: namedDir },
			} = resultMatchingDir;
			for (let i = 0; i < namedDir.length; i++) {
				const res = namedDir[i];
				if (res === undefined) {
					continue;
				}
				let { path, rule } = res;
				rule = rule.trim();
				const results = await FSInlineAnalyzer.#dir(join(Paths.root, path), hydrateRegex(rule));
				for (let j = 0; j < results.length; j++) {
					const res = results[j];
					if (res === undefined) {
						continue;
					}
					const { path, buffer } = res;
					if (path in FSInline.vivthFSInlinelists) {
						continue;
					}
					FSInline.vivthFSInlinelists[path] = buffer;
				}
			}
			const {
				result: { named: namedWorker },
			} = resultMatchingWorker;
			for (let i = 0; i < namedWorker.length; i++) {
				const res = namedWorker[i];
				if (res === undefined) {
					continue;
				}
				const { path } = res;
				const fullPath = join(Paths.root, path);
				const content = removeVivthDevCodeBlock(await readFile(fullPath, { encoding: 'utf-8' }));
				const [contentBundled, errorBundled] = await EsBundler(
					{
						content,
						// @ts-expect-error
						extension: extname(fullPath),
						root: dirname(fullPath),
					},
					{
						minify: true,
						format,
					}
				);
				if (errorBundled) {
					continue;
				}
				const [trueContent, errorFinal] = await FSInlineAnalyzer.finalContent(
					contentBundled,
					format
				);
				if (errorFinal) {
					continue;
				}
				FSInline.vivthFSInlinelists[path] = Buffer.from(trueContent);
			}
			return content.replace(
				/static\s*vivthFSInlinelists(?:;|)/,
				`static vivthFSInlinelists=${JSON.stringify(FSInline.vivthFSInlinelists)}`
			);
		});
	};
	/**
	 * @typedef {{path:string, buffer:Buffer<ArrayBuffer>}[]} _dirReturn
	 */
	/**
	 * @param {string} dirName
	 * @param {RegExp} ruleForFileFullPath
	 * @returns {Promise<_dirReturn>}
	 */
	static #dir = async (dirName, ruleForFileFullPath) => {
		/**
		 * @type {_dirReturn}
		 */
		const result = [];
		/**
		 * @param {string} current
		 * @returns {Promise<void>}
		 */
		const walk = async (current) => {
			if (Paths.root === undefined) {
				return;
			}
			const entries = await readdir(current, {
				recursive: false,
				withFileTypes: true,
				encoding: 'utf-8',
			});
			for (const entry of entries) {
				const fullPath = Paths.normalize(join(current, entry.name));
				const relativePath = Paths.normalizesForRoot(relative(Paths.root, fullPath));
				if (entry.isDirectory()) {
					await walk(fullPath);
					continue;
				}
				if (entry.isFile() && ruleForFileFullPath.test(fullPath)) {
					result.push({
						path: relativePath,
						buffer: Buffer.from(
							removeVivthDevCodeBlock(await readFile(fullPath, { encoding: 'utf-8' }))
						),
					});
				}
			}
		};
		await walk(dirName);
		return result;
	};
}
