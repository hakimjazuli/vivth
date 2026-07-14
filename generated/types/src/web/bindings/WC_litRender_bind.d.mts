import { render } from 'lit-html';
/**
 * @description
 * - factory to create simplified render function by omiting args[1++];
 * @param {import('../../typehints/ParametersFollowingN.mts').ParametersFollowingN<typeof render, 1>} args
 * @returns {(template: import('lit-html').TemplateResult)=>import('lit-html').RootPart}
 * @example
 * // webcomponent context via `WC_extends`
 * constructor(){
 * 	super();
 * 	this.#root = this.attachShadow({ mode: 'closed' });
 * 	this.#render = WC_litRender_bind(this.#root, this);
 * }
 * #root;
 * #render;
 * #something(){
 * 	this.#render(html`<div></div>`); // <- args[1++] are omitted
 * }
 * ///
 */
export declare function WC_litRender_bind(...args: import('../../typehints/ParametersFollowingN.mts').ParametersFollowingN<typeof render, 1>): (template: import('lit-html').TemplateResult) => import('lit-html').RootPart;
