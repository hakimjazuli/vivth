/**
 * @description
 * - when used with `EsBundler+ToBundledJSPlugin` the file on the dir that are match the rule are `Bundled` first before being put on the `.asar`;
 */
export declare class PathFSBundles {
    #private;
    /**
     * @description
     * @param {string} relativePath
     * - to the dirname of the file you are calling this method;
     * @param {{shouldNotIncludes:string}} [options]
     * - `shouldNotIncludes`:
     * >- when this method receive non immediate string(declared on other file),
     * >- `shouldNotIncludes` should be filled with the string like,
     * >- `/${libname}/path/to/file/this/method/is/being/called.extname`;
     * @returns {PathFSBundles}
     * @example
     * // D://true/path/mypath.mjs
     * import { PathFSBundles } from 'vivth/node';
     *
     * PathFSBundles.vivthBundles('../src/entryPoint.mjs', {
     * 	shouldNotIncludes: 'D://true/path/mypath.mjs',
     * });
     */
    static vivthBundles: (relativePath: string, options?: {
        shouldNotIncludes: string;
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
     * @returns {string}
     * - unBundled: `absolutePath` on disk of the file caller;
     * - bundled: `blankString`;
     */
    get callerPath(): string;
}
