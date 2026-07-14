export declare class PathFSFile {
    #private;
    /**
     * @param {string} relativePath
     * @param {{shouldNotIncludes:string}} [options]
     * @returns {PathFSFile}
     */
    static vivthFile: (relativePath: string, options?: {
        shouldNotIncludes: string;
    }) => PathFSFile;
    /**
     * @private
     * @param {Parameters<typeof PathFSFile["vivthFile"]>[0]} relativePath
     * @param {Parameters<typeof PathFSFile["vivthFile"]>[1]} [_options]
     */
    private constructor();
    /**
     * @returns {string}
     */
    get path(): string;
    /**
     * @returns {string}
     */
    get callerPath(): string;
}
