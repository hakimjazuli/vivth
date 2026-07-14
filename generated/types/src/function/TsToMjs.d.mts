/**
 * @description
 * - turn `.mts`||`.ts` file into `.mjs`, no bundling, just traspilation;
 * - on certain circumstance where `.mjs` result needed to be typed, you need to manually add `jsdoc`;
 * >- uses `"at"preserve` to register `jsdoc`;
 * >- at [at]\[blank\]typedef, import itself.mts pointing to the same exported object to fully type it in mjs(which `vivth` used to generate exports);
 * - auto compile and typehint `.as.ts` to `.wasm`;
 * @param {string} path
 * - `relative`(to `Paths.root`) OR `absolute`, both are accepted;
 * @param {Object} [options]
 * @param {string} [options.overrideOutputDir]
 * - default: write conversion to same directory;
 * - path are relative to project root;
 * @param {BufferEncoding} [options.encoding]
 * - default: `utf-8`;
 * @param {import('../typehints/AutoDocASOptions.mjs').AutoDocASOptions} [options.assemblyScriptOptions]
 * @returns {Promise<void>}
 * @example
 * import { TsToMjs } from 'vivth/node';
 *
 * await TsToMjs('./myFile.mts', { encoding: 'utf-8', overrideOutputDir: './other/dir' });
 */
export declare function TsToMjs(path: string, { overrideOutputDir, encoding, assemblyScriptOptions, }?: {
    overrideOutputDir?: string;
    encoding?: BufferEncoding;
    assemblyScriptOptions?: import('../typehints/AutoDocASOptions.mjs').AutoDocASOptions;
}): Promise<void>;
