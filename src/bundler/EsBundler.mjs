// @ts-check

import { build } from 'esbuild';

import { Console } from '../class/Console.mjs';
import { Paths } from '../class/Paths.mjs';
import { TryAsync } from '../function/TryAsync.mjs';
import { pluginVivthBundle } from './adds/pluginVivthBundle.mjs';
import { BrowserExternals } from './adds/BrowserExternals.mjs';

/**
 * @description
 * - opinionated bundler for limited extensions using esbuild;
 * - bundles all imports into a single output string;
 * @param {Object} options
 * @param {string} options.content
 * - the code can also uses composites from the result from multiple readFiles;
 * @param {string} options.root
 * - use dirname of said fileString path;
 * @param {'.mts'|'.ts'|'.mjs'} options.extension
 * - supported extension;
 * @param {boolean} [options.withBinHeader]
 * @param {Omit<Parameters<typeof build>[0],
 * 'entryPoints'|'bundle'|'write'|'sourcemap'|'outdir'|'splitting'|'format'>
 * } [esbuildOptions]
 * - assume `esm`;
 * @returns {ReturnType<typeof TryAsync<string>>}
 * @example
 * import { EsBundler } from 'vivth/node';
 *
 * const [bundledString, errorBundling] = EsBundler(
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
	esbuildOptions = {},
) {
	return await TryAsync(async () => {
		/**
		 * @type {import('esbuild').StdinOptions["loader"]}
		 */
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
				Console.error(error, { now: true });
				throw JSON.stringify(error);
		}
		const mainFields = esbuildOptions.mainFields;
		if (!mainFields?.length) {
			esbuildOptions.mainFields = ['module', 'main'];
		}
		esbuildOptions.external = [...(esbuildOptions?.external ?? [])];
		if (esbuildOptions.platform === 'browser') {
			esbuildOptions.external = Array.from(
				new Set(esbuildOptions.external).union(BrowserExternals),
			);
		}
		esbuildOptions.plugins = [...(esbuildOptions?.plugins ?? []), pluginVivthBundle];
		const result = await build({
			target: 'esnext',
			platform: 'node',
			...esbuildOptions,
			stdin: {
				contents: content,
				loader,
				resolveDir: root ?? Paths.root,
			},
			loader: esbuildOptions.loader,
			format: 'esm',
			bundle: true,
			write: false,
			sourcemap: false,
			banner: {
				js: withBinHeader ? '#!/usr/bin/env node' : '',
				...esbuildOptions.banner,
			},
		});
		if (result.warnings?.length) {
			const warningText = result.warnings.map((w) => w.text).join('\n');
			const warningArray = [warningText];
			/**
			 * auto cjs mitigation no longer supported
			 * ```js
			 * const regex = /import\.meta[\s\S]*cjs|cjs[\s\S]*import\.meta/i;
			 * if (regex.test(warningText)) {
			 * 	warningArray.push(
			 * 		`⚠️ Note: This is a false positive. 'vivth/node.EsBundler' already mitigates it with __filename.`,
			 * 		`As long as only 'import.meta.url' is accessed, it is most likely fine.`,
			 * 	);
			 * }
			 * ```
			 */
			Console.warn(warningArray, { now: true });
		}
		const resString = result.outputFiles?.[0]?.text;
		if (resString === undefined) {
			return '';
		}
		return resString;
	});
}
