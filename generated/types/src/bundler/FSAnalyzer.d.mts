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
     * @param {'cjs'|'esm'} format
     * @param {Object} asarConfig
     * @param {Parameters<createPackageFromFiles>[3]} [asarConfig.InputMetadata]
     * @param {Parameters<createPackageFromFiles>[4]} [asarConfig.options]
     * @param {string} bundledJSFilePath
     * @returns {ReturnType<typeof TryAsync<string>>}
     * @example
     * import { readFile } from 'node:fs/promises';
     *
     * import { FSInlineAnalyzer } from 'vivth';
     *
     * const filePath = join(Paths.root,'README.md'); // assuming Paths is already instantiated once;
     * const [resultFinalContent, errorFinalContent] = await FSInlineAnalyzer.finalContent(
     * 	filePath,
     * 	await readFile(filePath, {encoding: 'utf-8'}),
     * 	'esm',
     * 	{},
     * 	...args
     * );
     */
    static finalContent: (entryPoint: string, content: string, format: "cjs" | "esm", asarConfig: {
        InputMetadata?: Parameters<typeof createPackageFromFiles>[3];
        options?: Parameters<typeof createPackageFromFiles>[4];
    }, bundledJSFilePath: string) => ReturnType<typeof TryAsync<string>>;
    /**
     * return regex as string from template literal that are supposed to be regex
     * @param {string} str
     * @returns {RegExp}
     */
    static "__#private@#hydrateRegex": (str: string) => RegExp;
    /**
     * @param {string} rootPath
     * @param {Parameters<typeof FSAnalyzer["finalContent"]>[2]} format
     * @param {string} content
     * @param {Parameters<typeof FSAnalyzer["finalContent"]>[3]} asarConfig
     * @param {string} bundledJSFile
     * @returns {Promise<void>}
     */
    static "__#private@#analyze_asarFile": (rootPath: string, format: Parameters<(typeof FSAnalyzer)["finalContent"]>[2], content: string, asarConfig: Parameters<(typeof FSAnalyzer)["finalContent"]>[3], bundledJSFile: string) => Promise<void>;
}
import { TryAsync } from '../function/TryAsync.mjs';
type createPackageFromFiles = typeof import("@electron/asar")["createPackageFromFiles"];
import { createPackageFromFiles } from '@electron/asar';
export {};
