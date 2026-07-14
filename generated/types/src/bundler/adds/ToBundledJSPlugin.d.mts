import { CreateESPlugin } from '../CreateESPlugin.mjs';
/**
 * @param {string} filePath
 * @param {string} originalContent_
 * @returns {string}
 */
export declare const commonContentFixesBundled: (filePath: string, originalContent_: string) => string;
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
 * @returns {ReturnType<typeof CreateESPlugin>}
 * @example
 * import { ToBundledJSPlugin } from 'vivth/node';
 *
 * export const myBundledPlugin = ToBundledJSPlugin('/myProjectName/src/');
 */
export declare function ToBundledJSPlugin(includedInPath: string): ReturnType<typeof CreateESPlugin>;
