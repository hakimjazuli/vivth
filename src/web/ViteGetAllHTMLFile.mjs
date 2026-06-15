// @ts-check

import {
	/** */
	resolve,
	relative,
	extname,
	// sep,
} from 'node:path';
import { readdirSync, statSync } from 'node:fs';
import { Paths } from '../class/Paths.mjs';
import { TryAsync } from '../function/TryAsync.mjs';
import { Console } from '../class/Console.mjs';

/**
 * @param {string} currentDir
 * @param {string} absoluteDist
 * @param {string} absoluteDir
 * @param {Record<string, any>} inputs
 * @returns {void}
 */
function scanDir(currentDir, absoluteDist, absoluteDir, inputs) {
	// Fast paths to ignore heavy directories right away at the top level
	const dirName = currentDir.split('/').pop() ?? '.';
	if (dirName === 'node_modules' || dirName.startsWith('.')) {
		return;
	}

	const files = readdirSync(currentDir);

	for (const file of files) {
		const fullPath = Paths.normalize(resolve(currentDir, file));
		const isDirectory = statSync(fullPath).isDirectory();

		// Safely check if the directory is actually the build destination folder
		if (fullPath === absoluteDist || fullPath.startsWith(absoluteDist + '/')) {
			continue;
		}

		if (isDirectory) {
			scanDir(fullPath, absoluteDist, absoluteDir, inputs);
		} else if (extname(file) === '.html') {
			const relativePath = Paths.normalize(relative(absoluteDir, fullPath));

			// Vite requires forward slashes for internal module IDs/names
			const urlKey = relativePath.replace(/[\\]/g, '/').replace(/\.html$/, '');

			inputs[urlKey] = fullPath;
		}
	}
}

/**
 * @description
 * - Automatically discovers HTML files in a directory and maps them to input keys;
 * - [Paths](#paths) needs to be instantiated;
 * @param {string} dirPath - The absolute or relative path to the directory to scan.
 * @param {string} distPath - The distribution folder name to exclude.
 * @returns {import('vite').PluginOption}
 */
export function ViteGetAllHTMLFile(dirPath, distPath) {
	return {
		name: 'vivth/web:ViteGetAllHTMLFile',
		async config({ build }) {
			const buildPromise = TryAsync(async () => {
				const absoluteDir = Paths.diskAbsolute(dirPath);
				const absoluteDist = Paths.diskAbsolute(distPath);
				const inputs = {};
				try {
					scanDir(absoluteDir, absoluteDist, absoluteDir, inputs);
				} catch (error) {
					throw { autoHtmlInputs: `Error scanning directory '${dirPath}'`, error };
				}

				build = build || {};
				const optionsKey = build.rolldownOptions ? 'rolldownOptions' : 'rollupOptions';
				build[optionsKey] = build[optionsKey] || {};
				const input = build[optionsKey].input ?? {};
				build[optionsKey].input = {
					// @ts-expect-error
					...input,
					...inputs,
				};

				console.log('📦 Dynamic HTML Inputs Generated:', inputs);
			});
			const dynamicsHandler = TryAsync(async () => {});
			const [[, errorBuild], [, errorDynamic]] = await Promise.all([buildPromise, dynamicsHandler]);
			if (errorBuild) {
				Console.error({ errorBuild });
			}
			if (errorDynamic) {
				Console.error({ errorDynamic });
			}
		},
	};
}
