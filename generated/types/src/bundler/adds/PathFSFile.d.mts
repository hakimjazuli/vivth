/**
 * @description
 * >- the file are added to `asar` AS IS, OR
 * >- transformed according to the `asar.options.transform` value;
 */
export class PathFSFile {
    /**
     * @description
     * @param {string} relativePath
     * - to the dirname of the file you are calling this method;
     * @param {Parameters<typeof import('./PathFSBundles.mjs').PathFSBundles["vivthBundles"]>[1]} [options]
     * @returns {PathFSFile}
     * @example
     * import { PathFSFile } from 'vivth';
     *
     * PathFSFile.vivthFile('../CompileAS.mjs');
     */
    static vivthFile: (relativePath: string, options?: Parameters<typeof import("./PathFSBundles.mjs").PathFSBundles["vivthBundles"]>[1]) => PathFSFile;
    /**
     * @private
     * @param {Parameters<typeof PathFSFile["vivthFile"]>[0]} relativePath
     * @param {Parameters<typeof PathFSFile["vivthFile"]>[1]} [options]
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
