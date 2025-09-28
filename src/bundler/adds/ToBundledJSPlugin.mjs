// @ts-check

import { basename, extname } from 'node:path';
import { readFile, exists } from 'node:fs/promises';
import { CreateESPlugin } from '../CreateESPlugin.mjs';

/**
 * @description
 * - generate `esbuild.Plugin` for changing dev time file into runtime file;
 * - on using esbuild with this plugin, it will replace any module that have similiar file name but ended with Bundled(before extname);
 * >- works on `.mts`|`.ts`|`.mjs`|`.cjs`|`.js`;
 * >- `anyFileName.mjs` -> seek for and use `anyFileNameBundled.mjs`, if not found use `anyFileName.mjs`;
 * @param {string} includedInPath
 * - is generalized, you can freely uses forward or backward slash;
 * @returns {ReturnType<CreateESPlugin>}
 * @example
 * import { ToBundledJSPlugin } from 'vivth';
 *
 * export const myBundledPlugin = ToBundledJSPlugin('/myProjectName/src/');
 */
export function ToBundledJSPlugin(includedInPath) {
	const filter = new RegExp(includedInPath.replace(/[\\/]/g, '[\\\\/]'), '');
	return CreateESPlugin(`ToBundledJSPlugin:${includedInPath}`, (build) => {
		build.onLoad({ filter }, async (args) => {
			const filePath = args.path;
			const fileExt = extname(filePath);
			/**
			 * @type {'js'|'ts'}
			 */
			let loader;
			switch (fileExt) {
				case '.mts':
				case '.ts':
					loader = 'ts';
					break;
				case '.mjs':
				case '.cjs':
				case '.js':
				default:
					loader = 'js';
					break;
			}
			const originalContent = (await readFile(filePath)).toString('utf-8');
			if (!loader) {
				return {
					contents: originalContent,
					loader,
				};
			}
			if (filePath.endsWith(`Bundled${fileExt}`)) {
				return {
					contents: originalContent,
					loader,
				};
			}
			const originalBaseName = basename(filePath);
			const originalFileName = originalBaseName.replace(fileExt, '');
			const realRef = `${originalFileName}Bundled`;
			const runtimeFile = filePath.replace(
				new RegExp(`${originalBaseName}\$`.replace('.', '\\.'), ''),
				`${realRef}${fileExt}`
			);
			const isExist = await exists(runtimeFile);
			if (!isExist) {
				return {
					contents: originalContent,
					loader,
				};
			}
			const contents = (await readFile(runtimeFile)).toString('utf-8');
			return {
				contents,
				loader,
			};
		});
	});
}
