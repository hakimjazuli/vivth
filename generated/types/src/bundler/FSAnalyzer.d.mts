import { TryAsync } from '../function/TryAsync.mjs';
export type createPackageFromFiles = typeof import('@electron/asar')["createPackageFromFiles"];
/**
 * @description
 * - collections of static method to process content for:
 * >- `FSasar`;
 * - mostly used internally;
 */
export declare class FSAnalyzer {
    #private;
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
        InputMetadata?: Parameters<createPackageFromFiles>[3];
        options?: Parameters<createPackageFromFiles>[4];
    }, bundledJSFilePath: string) => ReturnType<typeof TryAsync<string>>;
}
