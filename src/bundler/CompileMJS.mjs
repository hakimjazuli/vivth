// @ts-check

import { readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';

import { Paths } from '../class/Paths.mjs';
import { EsBundler } from './EsBundler.mjs';
import { Console } from '../class/Console.mjs';
import { WriteFileSafe } from '../function/WriteFileSafe.mjs';

/**
 * @description
 * - function to bundle to single mjs file, including the workerThread;
 * @param {Object} options
 * @param {string} options.entryPoint
 * @param {string} options.outputNoExt
 * - no extention needed, result will always be '.mjs';
 * @param {BufferEncoding} options.encoding
 * @param {boolean} [options.minify]
 * - default false;
 * @param {boolean} [options.asBinary]
 * - default false;
 * @returns {Promise<ReturnType<typeof WriteFileSafe>>}
 * @example
 * import { Paths, CompileMJS } from 'vivth';
 *
 * new Paths({
 * 	root: process?.env?.INIT_CWD ?? process?.cwd(),
 * });
 *
 * CompileMJS({
 * 	entryPoint: '/index.mjs',
 * 	encoding: 'utf-8',
 * 	outputNoExt: '/test/compiled',
 * 	minify: false,
 * 	asBinary: true,
 * });
 */
export const CompileMJS = async ({
	entryPoint,
	encoding,
	outputNoExt,
	minify = false,
	asBinary = false,
}) => {
	const rootPath = Paths.root;
	const fullpathEntry = join(rootPath, entryPoint);
	const fulloutput = join(rootPath, `${outputNoExt}.mjs`);
	const mainext = extname(fullpathEntry);
	const [content, error] = await EsBundler(
		{
			content: await readFile(fullpathEntry, { encoding }),
			extension: mainext,
			asBinary: false,
		},
		{
			minify: false,
			keepNames: true,
		}
	);
	if (error) {
		Console.error(error);
		return;
	}
	let strippedComment = content.replace(/\/\*\*[\s\S]*?\*\//gm, '');
	const workersMatched = strippedComment
		.matchAll(
			/new\s(WorkerMainThread\w*?)\(['"]([\s\S]*?\.worker\.[\s\S]*?)['"][\s\S]*?(?:{([\s\S]*?)}|)[\s\S]*?\)/gm
		)
		.toArray();
	/**
	 * @type {Set<string>}
	 */
	const fileNames = new Set();
	for (const [string, className, path_, options] of workersMatched) {
		fileNames.add(path_);
		const newComment = `new ${className}(vivthWorkerFilesObject["${path_}"], {${
			options ?? ''
		}}, true)`;
		strippedComment = strippedComment.replace(string, newComment);
	}
	const vivthWorkerFilesObject = {};
	for await (const path_ of fileNames) {
		const workerFullPath = join(rootPath, path_);
		const content = await readFile(workerFullPath, { encoding });
		const [bundle, _] = await EsBundler(
			{
				content,
				extension: extname(workerFullPath),
			},
			{
				minify: true,
			}
		);
		vivthWorkerFilesObject[path_] = bundle;
	}
	const [finalContent] = await EsBundler(
		{
			content: `const vivthWorkerFilesObject = ${JSON.stringify(
				vivthWorkerFilesObject
			)};\n${strippedComment}`,
			extension: mainext,
			asBinary,
		},
		{ minify }
	);
	return await WriteFileSafe(fulloutput, finalContent, {
		encoding,
	});
};
