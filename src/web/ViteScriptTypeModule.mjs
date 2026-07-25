// @ts-check

import { TryAsync } from '../function/TryAsync.mjs';
import { FSDirArchWatcher } from '../class/FSDirArchWatcher.mjs';
import { Preferrence } from '../common/Preferrence.mjs';
import { readFile } from 'node:fs/promises';
import { FileSafe } from '../class/FileSafe.mjs';
import { Console } from '../class/Console.mjs';

/**
 * @description
 * - vite plugin to always add `[type="module"]` on listed extention file;
 * - this module assumes [Paths](#paths) and [SafeExit](#safeexit) to be instantiated;
 * @param {string[]} watchPaths
 * - example: `['/']`;
 * @param {(path:string)=>boolean} pathFilter
 * - example: `(path) => extname(path) === '.html'`;
 * @param {Omit<ConstructorParameters<typeof FSDirArchWatcher>[1], 'each'|'full'>} fsDirArchWatcherOptions
 * @returns {import('vite').PluginOption}
 */
export function ViteScriptTypeModule(watchPaths, pathFilter, fsDirArchWatcherOptions) {
	let started = false;
	return {
		name: 'vivth/web:ViteScriptTypeModule',
		apply: 'serve',
		async configureServer(devServer) {
			if (started) {
				return;
			}
			started = true;
			const fsWatcher = new FSDirArchWatcher(watchPaths, {
				each: async (eventName, path, stats) => {
					if (!stats || !stats.isFile()) {
						throw '';
					}
					switch (eventName) {
						case 'add':
						case 'change':
							break;
						default:
							throw '';
					}
					if (!pathFilter(path)) {
						throw '';
					}
					const encoding = Preferrence.encoding;
					const [correctedContent, throwedWarn] = await TryAsync(async () => {
						const content = await readFile(path, { encoding });
						const regex = /<script(?![^>]*\btype=)([^>]*\bsrc=["'][^"']+["'][^>]*)>/gi;
						if (!regex.test(content)) {
							throw new Error('No <script src> tags without type found');
						}
						regex.lastIndex = 0;
						return content.replace(regex, (_match, attrs) => `<script type="module"${attrs}>`);
					});
					if (throwedWarn) {
						Console.warn({ throwedWarn, path });
						throw '';
					}
					await FileSafe.write(path, correctedContent, { encoding });
				},
				full: async () => {},
				...fsDirArchWatcherOptions,
			});
			devServer.httpServer?.on('close', () => {
				fsWatcher.vivthCleanup();
			});
		},
	};
}
