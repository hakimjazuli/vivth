// @ts-check

import { build } from 'esbuild';

import { Console } from '../class/Console.mjs';
import { Paths } from '../class/Paths.mjs';
import { TryAsync } from '../function/TryAsync.mjs';

/**
 * @description
 * - opinionated bundler for extension below using esbuild;
 * - bundles all imports into a single output string;
 * @param {Object} options
 * @param {string} options.content
 * - the code can also uses composites from the result from multiple readFiles;
 * - the import statements on the content should use absolute path from project root, prefixed with forward slash;
 * @param {string} options.extension
 * @param {boolean} [options.asBinary]
 * @param {Omit<Parameters<build>[0], 'entryPoints'|'bundle'|'write'|'format'|'sourcemap'|'external'|'stdin'>} [esbuildOptions]
 * @returns {Promise<ReturnType<typeof TryAsync<string>>>}
 * @example
 * import { EsBundler } from 'vivth';
 *
 * const bundledString = EsBundler(,
 * 	{
 * 		content: ``,
 * 		extension: '.mts',
 * 		...options
 * 	},
 * 	{
 * 	...esbuildOptions,
 * });
 */
export const EsBundler = async ({ content, extension, asBinary = false }, esbuildOptions = {}) => {
	return await TryAsync(async () => {
		/** @type {Parameters<build>[0]['stdin']['loader']} */
		let loader;
		switch (extension) {
			case '.mts':
			case '.ts':
				loader = 'ts';
				break;
			case '.mjs':
				loader = 'js';
				break;
			default:
				const error = {
					extension,
					message: 'Invalid extension passed to EsBundler',
					acceptedextensions: ['.mts', '.ts', '.mjs'],
				};
				Console.error(error);
				throw new Error(JSON.stringify(error));
		}
		const result = await build({
			target: 'esnext',
			platform: 'node',
			...esbuildOptions,
			stdin: {
				contents: content,
				loader,
				resolveDir: Paths.root,
			},
			format: 'esm',
			bundle: true,
			write: false,
			sourcemap: false,
			external: [],
			banner: {
				js: asBinary ? '#!/usr/bin/env node' : '',
			},
		});
		if (result.warnings?.length) {
			Console.warn(result.warnings.map((w) => w.text).join('\n'));
		}
		const resString = result.outputFiles?.[0]?.text;
		return resString ?? '';
	});
};
