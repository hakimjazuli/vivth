/**
 * @description
 * - when used with `EsBundler+ToBundledJSPlugin` the file on the dir that are match the rule are `Bundled` first before being put on the `.asar`;
 */
export class PathFSBundles {
    /**
     * @description
     * @param {string} relativePath
     * - to the dirname of the file you are calling this method;
     * @param {{shouldNotInlcudes:string}} [options]
     * - `shouldNotInlcudes`:
     * >- when this method receive non immediate string(declared on other file),
     * >- `shouldNotInlcudes` should be filled with the string like,
     * >- `/${libname}/path/to/file/this/method/is/being/called.extname`;
     * @returns {PathFSBundles}
     * @example
     * import { PathFSBundles } from 'vivth';
     *
     * PathFSBundles.vivthBundles('../src/entryPoint.mjs');
     */
    static vivthBundles: (relativePath: string, options?: {
        shouldNotInlcudes: string;
    }) => PathFSBundles;
    /**
     * @private
     * @param {Parameters<typeof PathFSBundles["vivthBundles"]>[0]} relativePath
     * @param {Parameters<typeof PathFSBundles["vivthBundles"]>[1]} [options]
     */
    private constructor();
    /**
     * @description
     * - relative path of the target to the project root;
     * @returns {string}
     */
    get path(): string;
    /**
     * @description
     * - depending on whether running on bundled or not;
     * - unBundled: absolute disk path of the file caller;
     * - bundled: `blankstring`;
     * @returns {string}
     */
    get callerPath(): string;
    #private;
}
