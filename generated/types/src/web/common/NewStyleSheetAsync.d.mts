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
export declare function NewStyleSheetAsync(string: string, ...arg1: ConstructorParameters<typeof CSSStyleSheet>): Promise<CSSStyleSheet>;
