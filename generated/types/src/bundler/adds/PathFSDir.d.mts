/**
 * @description
 * - includes all files, that match the rule to `.asar` specification;
 */
export class PathFSDir {
    /**
     * @description
     * @param {string} relativePath
     * - relativePath to the `dirname` of the file you are calling this method;
     * @param {RegExp} rule
     * @param {Parameters<typeof import('./PathFSBundles.mjs').PathFSBundles["vivthBundles"]>[1]} [options]
     * @returns {PathFSDir}
     * @example
     * import { PathFSDir } from 'vivth/node';
     *
     * PathFSDir.vivthDir('../src/', /[\s\S]\*[blank]/);
     * // visible for ide inline check: without `[blank]`;
     */
    static vivthDir: (relativePath: string, rule: RegExp, options?: Parameters<typeof import("./PathFSBundles.mjs").PathFSBundles["vivthBundles"]>[1]) => PathFSDir;
    /**
     * @private
     * @param {Parameters<typeof PathFSDir["vivthDir"]>[0]} relativePath
     * @param {Parameters<typeof PathFSDir["vivthDir"]>[2]} [options]
     * @param {Parameters<typeof PathFSDir["vivthDir"]>[1]} [rule]
     */
    private constructor();
    /**
     * @description
     * - rule for dir, to get file any file match the rule inside that directory;
     * @type {RegExp}
     */
    get rule(): RegExp;
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
