import { FSDirArchWatcher } from '../class/FSDirArchWatcher.mjs';
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
export declare function ViteScriptTypeModule(watchPaths: string[], pathFilter: (path: string) => boolean, fsDirArchWatcherOptions: Omit<ConstructorParameters<typeof FSDirArchWatcher>[1], 'each' | 'full'>): import('vite').PluginOption;
