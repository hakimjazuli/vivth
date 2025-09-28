export class FSInline {
    static prefix: string;
    /**
     * @param {string} filePathFromProject
     * @returns {Promise<Buffer<ArrayBuffer>>}
     */
    static vivthFSInlineFile: (filePathFromProject: string) => Promise<Buffer<ArrayBuffer>>;
    /**
     * @param {string} dirPathFromProject
     * @param {Object} regexRule
     * @param {RegExp} regexRule.dir
     * @param {RegExp} regexRule.file
     * @returns {Promise<typeof FSInline["vivthFSInlineFile"]>}
     * - relative to the `dirPathFromProject`
     */
    static vivthFSInlineDir: (dirPathFromProject: string) => Promise<(typeof FSInline)["vivthFSInlineFile"]>;
    /**
     * - to be used as embed placeholder on `bundled` and `compiled`;
     * @type {Record<string, Buffer<ArrayBufferLike>>}
     */
    static vivthFSInlinelists: Record<string, Buffer<ArrayBufferLike>>;
}
