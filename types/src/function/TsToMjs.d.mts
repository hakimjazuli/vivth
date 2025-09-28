/**
 * @description
 * - turn `.mts`||`.ts` file into `.mjs`, no bundling, just translation;
 * - on certain circumstance where `.mjs` result needed to be typed, you need to manually add `jsdoc`;
 * >- uses `"at"preserve` to register `jsdoc` inline;
 * @param {string} path_
 * - path from `Paths.root`;
 * @param {Object} [options]
 * @param {string} [options.overrideDir]
 * - default: write conversion to same directory;
 * - path are relative to project root;
 * @param {BufferEncoding} [options.encoding]
 * - default: `utf-8`;
 * @returns {Promise<void>}
 * @example
 * import { TsToMjs } from 'vivth';
 *
 * TsToMjs('./myFile.mts', { encoding: 'utf-8', overrideDir: './other/dir' });
 */
export function TsToMjs(path_: string, { overrideDir, encoding }?: {
    overrideDir?: string;
    encoding?: BufferEncoding;
}): Promise<void>;
