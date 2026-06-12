// @ts-check

/**
 * @description
 * - function helper to asynchronously `CSSStyleSheet`;
 * >- './main.css';
 * ```css
 * :host{
 * 	background-color: red;
 * }
 * ```
 * - internally used for `Dynamics`;
 * @param {string} string
 * @param {ConstructorParameters<typeof CSSStyleSheet>} arg1
 * @returns {Promise<CSSStyleSheet>}
 */
export async function NewStyleSheetAsync(string, ...arg1) {
	const sheet = new CSSStyleSheet(...arg1);
	await sheet.replace(string);
	return sheet;
}
