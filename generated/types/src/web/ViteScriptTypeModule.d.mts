import { FSDirArchWatcher } from '../class/FSDirArchWatcher.mjs';
/**
 * @description
 * - vite plugin to always add `[type="module"]` on listed extention file;
 * - this module assumes [Paths](#paths) and [SafeExit](#safeexit) to be instantiated;
 * @param {string[]} extensions
 * - file extensions to modify the scripts;
 * - example: `['.html', '.php']`;
 * @param {string[]} watchPaths
 * -
 * - example: `['/']`;
 * @param {Omit<ConstructorParameters<typeof FSDirArchWatcher>[1], 'each'|'full'>} fsDirArchWatcherOptions
 * @returns {import('vite').PluginOption}
 */
export declare function ViteScriptTypeModule(extensions: string[], watchPaths: string[], fsDirArchWatcherOptions: Omit<ConstructorParameters<typeof FSDirArchWatcher>[1], 'each' | 'full'>): import('vite').PluginOption;
