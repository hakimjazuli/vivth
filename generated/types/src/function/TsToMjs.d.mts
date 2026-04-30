/**
 * @description
 * - turn `.mts`||`.ts` file into `.mjs`, no bundling, just traspilation;
 * - on certain circumstance where `.mjs` result needed to be typed, you need to manually add `jsdoc`;
 * >- uses `"at"preserve` to register `jsdoc`;
 * - auto compile and typehint `.as.ts` to `.wasm`;
 * @param {string} path_
 * - relative path from `Paths.root`;
 * @param {Object} [options]
 * @param {string} [options.overrideOutputDir]
 * - default: write conversion to same directory;
 * - path are relative to project root;
 * @param {BufferEncoding} [options.encoding]
 * - default: `utf-8`;
 * @param {import('../typehints/AutoDocASOptions.mjs').AutoDocASOptions} [options.assemblyScriptOptions]
 * @returns {Promise<void>}
 * @example
 * import { TsToMjs } from 'vivth';
 *
 * await TsToMjs('./myFile.mts', { encoding: 'utf-8', overrideOutputDir: './other/dir' });
 */
export function TsToMjs(path_: string, { overrideOutputDir, encoding, assemblyScriptOptions, }?: {
    overrideOutputDir?: string | undefined;
    encoding?: BufferEncoding | undefined;
    assemblyScriptOptions?: import("../typehints/AutoDocASOptions.mjs").AutoDocASOptions | undefined;
}): Promise<void>;
