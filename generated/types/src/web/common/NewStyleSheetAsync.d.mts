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
export function NewStyleSheetAsync(string: string, options?: CSSStyleSheetInit | undefined): Promise<CSSStyleSheet>;
