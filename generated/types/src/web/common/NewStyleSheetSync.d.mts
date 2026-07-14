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
export declare function NewStyleSheetSync(string: string, ...arg1: ConstructorParameters<typeof CSSStyleSheet>): CSSStyleSheet;
