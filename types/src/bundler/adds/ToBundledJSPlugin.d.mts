/**
 * @description
 * - generate `esbuild.Plugin` for changing dev time file into runtime file;
 * - on using esbuild with this plugin, it will replace any module that have similiar file name but ended with Bundled(before extname);
 * >- works on `.mts`|`.ts`|`.mjs`|`.cjs`|`.js`;
 * >- `anyFileName.mjs` -> seek for and use `anyFileNameBundled.mjs`, if not found use `anyFileName.mjs`;
 * @param {string} includedInPath
 * - is generalized, you can freely uses forward or backward slash;
 * @returns {ReturnType<CreateESPlugin>}
 * @example
 * import { ToBundledJSPlugin } from 'vivth';
 *
 * export const myBundledPlugin = ToBundledJSPlugin('/myProjectName/src/');
 */
export function ToBundledJSPlugin(includedInPath: string): ReturnType<typeof CreateESPlugin>;
import { CreateESPlugin } from '../CreateESPlugin.mjs';
