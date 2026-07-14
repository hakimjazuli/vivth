/**
 * @description
 * - create inline base64 url;
 * - usage:
 * >- can be extremely usefull to display file on desktop app webview, without exposing http server;
 * >- when using `FSasar`, use [Base64URL](#base64url) instead;
 * @param {string} filePath
 * @returns {Promise<{data:string, mime:string|false}|undefined>}
 * @example
 * import { join } from 'node:path'
 *
 * import { Base64URLFromFile } from 'vivth/node';
 * import { Paths } from 'vivth/neutral';
 *
 * await Base64URLFromFile(join(Paths.root, '/path/to/file'));
 */
export declare function Base64URLFromFile(filePath: string): Promise<{
    data: string;
    mime: string | false;
} | undefined>;
