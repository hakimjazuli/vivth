// @ts-check

import { basename, extname } from 'node:path';
import { readFile, exists } from 'node:fs/promises';
import { CreateESPlugin } from '../CreateESPlugin.mjs';
import { GetNamedImportAlias } from '../../function/GetNamedImportAlias.mjs';

/**
 * @param {string} originalContent_
 * @returns {string}
 */
export const removeVivthDevCodeBlock = (originalContent_) => {
	const alias = GetNamedImportAlias(originalContent_, 'Dev', 'vivth');
	if (!alias) {
		return originalContent_;
	}
	const regex = new RegExp(
		`(\\s*${alias}.vivthDevCodeBlock\\s*\\([\\s\\S]*?,\\s*['"]vivthDevCodeBlock['"]\\s*\\)(?:\\;|,|))`,
		'g'
	);
	return originalContent_.replace(regex, '');
};

/**
 * @description
 * - generate `esbuild.Plugin` for changing dev time file into runtime file;
 * - on using esbuild with this plugin, it will:
 * >- replace any module that have similiar file name but ended with Bundled(before extname);
 * >- works on `.mts`|`.ts`|`.mjs`|`.cjs`|`.js`;
 * >- `${fileName}.mjs` -> seek for and use `${fileName}Bundled.mjs`, if not found use `${fileName}.mjs`;
 * >- removes `Dev.vivthDevCodeBlock` code block;
 * @param {string} includedInPath
 * - is generalized path, you can freely uses forward or backward slash;
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
			 * @type {'js'|'ts'|undefined}
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
					loader = 'js';
					break;
			}
			/**
			 * @type {ReturnType<Parameters<import('esbuild').PluginBuild["onLoad"]>[1]>}
			 */
			const ret = { loader };
			if (loader === undefined || filePath.endsWith(`Bundled${fileExt}`)) {
				const originalContent = (await readFile(filePath)).toString('utf-8');
				ret.contents = removeVivthDevCodeBlock(originalContent);
				return ret;
			}
			const originalBaseName = basename(filePath);
			const originalFileName = originalBaseName.replace(fileExt, '');
			const realRef = `${originalFileName}Bundled`;
			const bundledFile = filePath.replace(
				new RegExp(`${originalBaseName}\$`.replace('.', '\\.'), ''),
				`${realRef}${fileExt}`
			);
			const isExist = await exists(bundledFile);
			if (isExist === false) {
				const originalContent = (await readFile(filePath)).toString('utf-8');
				ret.contents = removeVivthDevCodeBlock(originalContent);
				return ret;
			}
			const originalContent = (await readFile(bundledFile)).toString('utf-8');
			ret.contents = removeVivthDevCodeBlock(originalContent);
			return ret;
		});
	});
}
