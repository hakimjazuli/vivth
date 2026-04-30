export class PathFSBundles {
    /**
     * @param {string} relativePath
     * @param {{shouldNotInlcudes:string}} [options]
     * @returns {PathFSBundles}
     */
    static vivthBundles: (relativePath: string, options?: {
        shouldNotInlcudes: string;
    }) => PathFSBundles;
    /**
     * @private
     * @param {Parameters<typeof PathFSBundles["vivthBundles"]>[0]} relativePath
     * @param {Parameters<typeof PathFSBundles["vivthBundles"]>[1]} [_options]
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
