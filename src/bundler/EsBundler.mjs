// @ts-check

import { build } from 'esbuild';

import { Console } from '../class/Console.mjs';
import { Paths } from '../class/Paths.mjs';
import { TryAsync } from '../function/TryAsync.mjs';
import { pluginVivthBundle } from './adds/pluginVivthBundle.mjs';
import { externals } from './adds/externals.mjs';

/**
 * @description
 * - opinionated bundler for extension below using esbuild;
 * - bundles all imports into a single output string;
 * @param {Object} options
 * @param {string} options.content
 * - the code can also uses composites from the result from multiple readFiles;
 * @param {string} options.root
 * - use dirname of said fileString path;
 * @param {'.mts'|'.ts'|'.mjs'} options.extension
 * @param {boolean} [options.withBinHeader]
 * @param {Omit<Parameters<build>[0],
 * 'entryPoints'|'bundle'|'write'|'sourcemap'>
 * } [esbuildOptions]
 * @returns {ReturnType<typeof TryAsync<string>>}
 * @example
 * import { EsBundler } from 'vivth';
 *
 * const bundledString = EsBundler(
 * 	{
 * 		content: ``,
 * 		extension: '.mts',
 * 		...options
 * 	},
 * 	{
 * 	...esbuildOptions,
 * });
 */
export async function EsBundler(
	{ content, extension, root, withBinHeader = false },
	esbuildOptions = {}
) {
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
		esbuildOptions.external = [...(esbuildOptions?.external ?? []), ...externals];
		esbuildOptions.plugins = [...(esbuildOptions?.plugins ?? []), pluginVivthBundle];
		const result = await build({
			target: 'esnext',
			platform: 'node',
			format: 'esm',
			...esbuildOptions,
			stdin: {
				contents: content,
				loader,
				resolveDir: root ?? Paths.root,
			},
			bundle: true,
			write: false,
			sourcemap: false,
			banner: {
				js: withBinHeader ? '#!/usr/bin/env node' : '',
				...esbuildOptions.banner,
			},
		});
		if (result.warnings?.length) {
			Console.warn(result.warnings.map((w) => w.text).join('\n'));
		}
		const resString = result.outputFiles?.[0]?.text;
		if (!resString) {
			return '';
		}
		return resString;
	});
}
