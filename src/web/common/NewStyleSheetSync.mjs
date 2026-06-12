// @ts-check

/**
 * @description
 * - function helper to synchronously `CSSStyleSheet`;
 * >- './main.css';
 * ```css
 * :host{
 * 	background-color: red;
 * }
 * ```
 * - internally used for `CSS`;
 * @param {string} string
 * @param {ConstructorParameters<typeof CSSStyleSheet>} arg1
 * @returns {CSSStyleSheet}
 */
export function NewStyleSheetSync(string, ...arg1) {
	const sheet = new CSSStyleSheet(...arg1);
	sheet.replaceSync(string);
	return sheet;
}
