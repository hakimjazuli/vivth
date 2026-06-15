/**
 * @description
 * - Automatically discovers HTML files in a directory and maps them to input keys;
 * - [Paths](#paths) needs to be instantiated;
 * @param {string} dirPath - The absolute or relative path to the directory to scan.
 * @param {string} distPath - The distribution folder name to exclude.
 * @returns {import('vite').PluginOption}
 */
export function ViteGetAllHTMLFile(dirPath: string, distPath: string): import("vite").PluginOption;
