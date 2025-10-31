/**
 * @description
 * - class helper to inline files;
 * >- as `type: "buffer"`;
 * - use only if you are planning to use [CompileJS](#compilejs);
 * >- the class static methods don't obfuscate target file;
 * >- don't embed any sensitive content using this methods of this class;
 */
export class FSInline {
    /**
     * @description
     * - declare entrypoint of file inlining;
     * >- on the dev time, it's just regullar `readFile` from `node:fs/promises`;
     * >- on the compiled, it will read file from `FSInline.vivthFSInlinelists`
     * @param {string} filePathFromProject
     * - doesn't require prefix;
     * @returns {Promise<Buffer<ArrayBuffer>>}
     * - dev: returns `ArrayBuffer`;
     * - bundled: embed the `ArrayBuffer` of file, which then returned;
     * >- `Dev` will be cleaned up;
     * @example
     * import { FSInline } from 'vivth';
     *
     * (await FSInline.vivthFSInlineFile('/assets/text.txt')).toString('utf-8');
     */
    static vivthFSInlineFile: (filePathFromProject: string) => Promise<Buffer<ArrayBuffer>>;
    /**
     * @description
     * - declare entrypoint of file inlining, include all files on `dir` and `subdir` that match the `fileRule`;
     * - consider this as inline assets embed/bundler;
     * @param {string} dirPathFromProject
     * - doesn't require prefix;
     * @param {RegExp} fileRule
     * @returns {Promise<typeof FSInline["vivthFSInlineFile"]>}
     * @example
     * import { FSInline } from 'vivth';
     *
     * export const pngAssets = await FSInline.vivthFSInlineDir('/assets', /.png$/g);
     */
    static vivthFSInlineDir: (dirPathFromProject: string, fileRule: RegExp) => Promise<(typeof FSInline)["vivthFSInlineFile"]>;
    /**
     * @description
     * - placeholder for FSInline;
     * - it's remain publicly accessible so it doesn't mess with regex analyze on bundle;
     * - shouldn't be manually accessed;
     * >- access via `FSInline.vivthFSInlineFile` or `FSInline.vivthFSInlineDir`;
     * @type {Record<string, Buffer<ArrayBuffer>>}
     */
    static vivthFSInlinelists: Record<string, Buffer<ArrayBuffer>>;
}
