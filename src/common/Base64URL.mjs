// @ts-check

/**
 * @description
 * - create inline base64 url;
 * - usage:
 * >- can be extremely usefull to display file on desktop app webview, without exposing http server;
 * @param {string} fileString
 * @param {string} mimeType
 * @param {(string:string)=>string} btoaFunction
 * - check your js runtime `btoa`;
 * @returns {string}
 * @example
 * import { Base64URL } from 'vivth'
 * import { fileString } from './fileString.mjs';
 *
 * Base64URL(fileString, 'application/javascript', btoa);
 */
export const Base64URL = (fileString, mimeType, btoaFunction) => {
	const utf8 = new TextEncoder().encode(fileString);
	let binary = '';
	for (let byte of utf8) {
		binary += String.fromCharCode(byte);
	}
	return `data:${mimeType};base64,${btoaFunction(binary)}`;
};
