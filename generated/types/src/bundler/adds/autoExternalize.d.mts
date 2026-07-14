import type { Plugin } from 'esbuild';
/**
 * @import {Plugin} from 'esbuild'
 */
/**
 * @param {string} path
 * @param {string} targetPath
 * @param {string} watchPath
 * @param {string} mapToPath
 * @param {Map<string, Set<string>>} depMap
 * @param {Map<string, () => Promise<any>>} esbuildPathRebuild
 * @returns {Plugin}
 */
export declare const autoExternalize: (path: string, targetPath: string, watchPath: string, mapToPath: string, depMap: Map<string, Set<string>>, esbuildPathRebuild: Map<string, () => Promise<any>>) => Plugin;
