/**
 * @description
 * - generate `esbuild.Plugin` for changing unbundled time file into runtime file;
 * - on using esbuild with this plugin, it will:
 * >- replace any module that have similiar file name but ended with Bundled(before extname);
 * >- works on `.mts`|`.ts`|`.mjs`|`.js`;
 * >- `${fileName}.mjs` -> seek for and use `${fileName}.bundled.mjs`, if not found use `${fileName}.mjs`;
 * >- removes `BundledV.vivthUnBundledCodeBlock` code block;
 * @param {string} includedInPath
 * - is generalized path, you can freely uses forward or backward slash;
 * @returns {ReturnType<CreateESPlugin>}
 * @example
 * import { ToBundledJSPlugin } from 'vivth/node';
 *
 * export const myBundledPlugin = ToBundledJSPlugin('/myProjectName/src/');
 */
export function ToBundledJSPlugin(includedInPath: string): ReturnType<typeof CreateESPlugin>;
export function commonContentFixesBundled(filePath: string, originalContent_: string): string;
import { CreateESPlugin } from '../CreateESPlugin.mjs';
