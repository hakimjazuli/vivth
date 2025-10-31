/**
 * @description
 * - generate `esbuild.Plugin` for changing dev time file into runtime file;
 * - on using esbuild with this plugin, it will:
 * >- replace any module that have similiar file name but ended with Bundled(before extname);
 * >- works on `.mts`|`.ts`|`.mjs`|`.cjs`|`.js`;
 * >- `${fileName}.mjs` -> seek for and use `${fileName}Bundled.mjs`, if not found use `${fileName}.mjs`;
 * >- removes `Dev.vivthDevCodeBlock` code block;
 * @param {string} includedInPath
 * - is generalized path, you can freely uses forward or backward slash;
 * @returns {ReturnType<CreateESPlugin>}
 * @example
 * import { ToBundledJSPlugin } from 'vivth';
 *
 * export const myBundledPlugin = ToBundledJSPlugin('/myProjectName/src/');
 */
export function ToBundledJSPlugin(includedInPath: string): ReturnType<typeof CreateESPlugin>;
export function removeVivthDevCodeBlock(originalContent_: string): string;
import { CreateESPlugin } from '../CreateESPlugin.mjs';
