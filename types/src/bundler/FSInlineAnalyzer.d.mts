/**
 * @description
 * - collections of static method to analyze content for `FSInline`;
 * - mostly used internally;
 */
export class FSInlineAnalyzer {
    /**
     * @description
     * - to be used on bundled content;
     * @param {string} content
     * @param {'cjs'|'esm'} format
     * @returns {ReturnType<typeof TryAsync<string>>}
     * @example
     * import { readFile } from 'node:fs/promises';
     *
     * import { FSInlineAnalyzer } from 'vivth';
     *
     * const [resultFinalContent, errorFinalContent] = await FSInlineAnalyzer.finalContent(
     * 	await readFile('./resultESBunlded.mjs', {encoding: 'utf-8'}),
     * 	'esm'
     * );
     */
    static finalContent: (content: string, format: "cjs" | "esm") => ReturnType<typeof TryAsync<string>>;
    /**
     * @typedef {{path:string, buffer:Buffer<ArrayBuffer>}[]} _dirReturn
     */
    /**
     * @param {string} dirName
     * @param {RegExp} ruleForFileFullPath
     * @returns {Promise<_dirReturn>}
     */
    static "__#private@#dir": (dirName: string, ruleForFileFullPath: RegExp) => Promise<{
        path: string;
        buffer: Buffer<ArrayBuffer>;
    }[]>;
}
import { TryAsync } from '../function/TryAsync.mjs';
