/**
 * @description
 * - collections of static method to process content for:
 * >- `FSasar`;
 * - mostly used internally;
 */
export class FSAnalyzer {
    /**
     * @typedef {typeof import('@electron/asar')["createPackageFromFiles"]} createPackageFromFiles
     */
    /**
     * @description
     * - to be used on bundled content;
     * @param {string} entryPoint
     * @param {string} content
     * @param {Object} asarConfig
     * @param {Parameters<createPackageFromFiles>[3]} [asarConfig.InputMetadata]
     * @param {Parameters<createPackageFromFiles>[4]} [asarConfig.options]
     * @param {string} bundledJSFilePath
     * @returns {ReturnType<typeof TryAsync<string>>}
     * @example
     * import { readFile } from 'node:fs/promises';
     *
     * import { FSAnalyzer } from 'vivth/node';
     * import { Preferrence } from 'vivth/neutral';
     *
     * const filePath = 'README.md';
     * const [resultFinalContent, errorFinalContent] = await FSAnalyzer.finalContent(
     * 	filePath,
     * 	await readFile(filePath, {encoding: Preferrence.encoding}),
     * 	'esm',
     * 	{},
     * 	...args
     * );
     */
    static finalContent: (entryPoint: string, content: string, asarConfig: {
        InputMetadata?: Parameters<typeof createPackageFromFiles>[3];
        options?: Parameters<typeof createPackageFromFiles>[4];
    }, bundledJSFilePath: string) => ReturnType<typeof TryAsync<string>>;
    /**
     * return regex as string from template literal that are supposed to be regex
     * @param {string} str
     * @returns {RegExp}
     */
    static #hydrateRegex: (str: string) => RegExp;
    /**
     * @param {string} rootPath
     * @param {string} content
     * @param {Parameters<typeof FSAnalyzer["finalContent"]>[2]} asarConfig
     * @param {string} bundledJSFile
     * @returns {Promise<void>}
     */
    static #analyze_asarFile: (rootPath: string, content: string, asarConfig: Parameters<(typeof FSAnalyzer)["finalContent"]>[2], bundledJSFile: string) => Promise<void>;
}
import { TryAsync } from '../function/TryAsync.mjs';
type createPackageFromFiles = typeof import("@electron/asar")["createPackageFromFiles"];
import { createPackageFromFiles } from '@electron/asar';
export {};
