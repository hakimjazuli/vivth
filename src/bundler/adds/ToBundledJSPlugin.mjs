// @ts-check

import { basename, dirname, extname, relative, resolve } from 'node:path';
import { readFile } from 'node:fs/promises';

import { CreateESPlugin } from '../CreateESPlugin.mjs';
import { GetNamedImportAlias } from '../../function/GetNamedImportAlias.mjs';
import { FileSafe } from '../../class/FileSafe.mjs';
import { Paths } from '../../class/Paths.mjs';
import { PipeSync } from '../../function/PipeSync.mjs';
import { VivthUnBundledCodeBlock } from '../../common/VivthUnBundledCodeBlock.mjs';
import { Preferrence } from '../../common/Preferrence.mjs';
import { isModuleTheBundledVersion } from './isModuleTheBundledVersion.mjs';

/**
 * @param {string} filePath
 * @param {string} originalContent_
 * @returns {string}
 */
export const commonContentFixesBundled = (filePath, originalContent_) => {
	return PipeSync(
		originalContent_,
		(content) => {
			for (let i = 0; i < PathFStoBefixed.length; i++) {
				const stringToBeFixed = PathFStoBefixed[i];
				if (!stringToBeFixed) {
					continue;
				}
				content = fixPathFS(filePath, content, stringToBeFixed);
			}
			return content;
		},
		(content) => removeVivthUnBundledCodeBlock(content),
	);
};

const PathFStoBefixed = ['Bundles', 'Dir', 'File'];

/**
 * Rewrite all relative string arguments inside `PathFS` calls.
 * @param {string} currentFilePath - Absolute path of the current file.
 * @param {string} originalContent_ - The source code to scan and rewrite.
 * @param {string} mode
 * @returns {string} - Modified source code with paths rewritten.
 */
const fixPathFS = (currentFilePath, originalContent_, mode) => {
	const alias = GetNamedImportAlias(originalContent_, `PathFS${mode}`, 'vivth/node');
	if (!alias) {
		return originalContent_;
	}
	// Regex: match alias("...") or alias('...'), enforcing same quote style
	const callRegex = new RegExp(`${alias}\\.(vivth[\\w]+)\\((['"])(\\.?\\.?\\/[^'"]*)\\2`, 'g');
	let modified = originalContent_;
	modified = modified.replace(callRegex, (full, methodName, quote, relPath) => {
		if (!relPath) {
			return full;
		}
		const absPath = resolve(dirname(currentFilePath), relPath);
		const relToRoot = relative(Paths.root, absPath);
		const normalized = Paths.normalize(relToRoot);
		return `${alias}.${methodName}(${quote}${normalized}${quote}`;
	});
	return modified;
};

/**
 * @param {string} originalContent_
 * @returns {string}
 */
const removeVivthUnBundledCodeBlock = (originalContent_) => {
	const alias = GetNamedImportAlias(originalContent_, 'BundledV', 'vivth/neutral');
	if (!alias) {
		return originalContent_;
	}
	const regex = new RegExp(
		`(\\s*${alias}.${VivthUnBundledCodeBlock}\\s*\\([\\s\\S]*?['"]${VivthUnBundledCodeBlock}['"]\\s*\\)(?:\\;|,))`,
		'g',
	);
	return originalContent_.replace(regex, '');
};

/**
 * @description
 * - generate `esbuild.Plugin` for changing unbundled time file into runtime file;
 * - on using esbuild with this plugin, it will:
 * >- replace any module that have similiar file name but ended with Bundled(before extname);
 * >- works on `.mts`|`.ts`|`.mjs`|`.js`;
 * >- `${fileName}.mjs` -> seek for and use `${fileName}.bundled.mjs`, if not found use `${fileName}.mjs`;
 * >- removes `BundledV.vivthUnBundledCodeBlock` code block;
 * @param {string} includedInPath
 * - is generalized path, you can freely uses forward or backward slash;
 * @returns {ReturnType<CreateESPlugin>}
 * @example
 * import { ToBundledJSPlugin } from 'vivth/node';
 *
 * export const myBundledPlugin = ToBundledJSPlugin('/myProjectName/src/');
 */
export function ToBundledJSPlugin(includedInPath) {
	const filter = new RegExp(includedInPath.replace(/[\\/]/g, '[\\\\/]'), '');
	return CreateESPlugin(
		`ToBundledJSPlugin:${includedInPath}`,
		({
			/** */
			onLoad,
		}) => {
			onLoad({ filter }, async ({ path: filePath }) => {
				const extension = extname(filePath);
				/**
				 * @type {'js'|'ts'|undefined}
				 */
				let loader;
				switch (extension) {
					case '.mts':
					case '.cts':
					case '.ts':
						loader = 'ts';
						break;
					case '.mjs':
					case '.js':
						loader = 'js';
						break;
				}
				/**
				 * @type {ReturnType<Parameters<import('esbuild').PluginBuild["onLoad"]>[1]>}
				 */
				const ret = { loader };
				if (loader === undefined || isModuleTheBundledVersion(filePath, extension)) {
					const originalContent = (await readFile(filePath)).toString(Preferrence.encoding);
					ret.contents = commonContentFixesBundled(filePath, originalContent);
					return ret;
				}
				const originalBaseName = basename(filePath);
				const originalFileName = originalBaseName.replace(extension, '');
				const realRef = `${originalFileName}.bundled`;
				const bundledFile = filePath.replace(
					new RegExp(`${originalBaseName}\$`.replace('.', '\\.'), ''),
					`${realRef}${extension}`,
				);
				const isExist = await FileSafe.exist(bundledFile);
				if (!isExist) {
					const originalContent = (await readFile(filePath)).toString(Preferrence.encoding);
					ret.contents = commonContentFixesBundled(filePath, originalContent);
					return ret;
				}
				const originalContent = (await readFile(bundledFile)).toString(Preferrence.encoding);
				ret.contents = commonContentFixesBundled(filePath, originalContent);
				return ret;
			});
		},
	);
}
