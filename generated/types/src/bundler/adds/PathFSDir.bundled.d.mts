export class PathFSDir {
    /**
     * @param {string} relativePath
     * @param {RegExp} rule
     * @param {{shouldNotIncludes:string}} [options]
     * @returns {PathFSDir}
     */
    static vivthDir: (relativePath: string, rule: RegExp, options?: {
        shouldNotIncludes: string;
    }) => PathFSDir;
    /**
     * @param {Parameters<typeof PathFSDir["vivthDir"]>[0]} relativePath
     * @param {Parameters<typeof PathFSDir["vivthDir"]>[2]} [_options]
     * @param {Parameters<typeof PathFSDir["vivthDir"]>[1]} [rule]
     */
    constructor(relativePath: Parameters<(typeof PathFSDir)["vivthDir"]>[0], _options?: Parameters<(typeof PathFSDir)["vivthDir"]>[2], rule?: Parameters<(typeof PathFSDir)["vivthDir"]>[1]);
    /**
     * @type {RegExp}
     */
    get rule(): RegExp;
    /**
     * @returns {string}
     */
    get path(): string;
    /**
     * @returns {string}
     */
    get callerPath(): string;
    #private;
}
