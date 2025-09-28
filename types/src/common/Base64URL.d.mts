/**
 * @description
 * - create inline base64 url;
 * - usage:
 * >- can be extremely usefull to display file on desktop app webview, without exposing http server;
 * @param {string} fileString
 * @param {string} mimeType
 * @param {(string:string)=>string} btoaFunction
 * - check your js runtime `btoa`;
 * - node compatible:
 * ```js
 * (str, prevBufferEncoding) =>
 * 	Buffer.from(str, prevBufferEncoding).toString('base64')
 * ```
 * @returns {Base64URLString}
 * @example
 * import { Base64URL } from 'vivth'
 * import fileString from './fileString.mjs';
 *
 * Base64URL(fileString, 'application/javascript', btoa);
 */
export function Base64URL(fileString: string, mimeType: string, btoaFunction: (string: string) => string): Base64URLString;
