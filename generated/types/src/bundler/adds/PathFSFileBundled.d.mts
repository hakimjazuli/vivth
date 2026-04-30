export class PathFSFile {
    /**
     * @param {string} relativePath
     * @param {{shouldNotInlcudes:string}} [options]
     * @returns {PathFSFile}
     */
    static vivthFile: (relativePath: string, options?: {
        shouldNotInlcudes: string;
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
    #private;
}
