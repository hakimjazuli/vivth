/**
 * @description
 * - generate `CSSStyleSheet` with template literal;
 * @param {TemplateStringsArray} strings
 * @param {...string} values
 * @returns {CSSStyleSheet}
 * @example
 * import { CSS as css } from 'vivth/neutral';
 * // webcomponent context via `WC_extends`
 * static CSS = css`
 * 	:host{
 * 		--my-theme: salmon;
 * 		background-color: var(--my-theme);
 * 	}
 * `
 * constructor(){
 * 	super();
 * 	const root = this.attachShadow({mode:'closed'});
 * 	root.adoptedStyleSheets= [MyClass.CSS];
 * }
 * //
 */
export declare function CSS(strings: TemplateStringsArray, ...values: string[]): CSSStyleSheet;
