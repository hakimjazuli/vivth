// @ts-check

import { html, render } from 'lit-html';
import { html as htmlStatic, unsafeStatic } from 'lit-html/static.js';

import { ForInSync } from '../../function/ForInSync.mjs';
import { ForOfSync } from '../../function/ForOfSync.mjs';

/**
 * @import {ArrayToKeys} from '../../typehints/ArrayToKeys.mjs'
 * @import {TemplateResult, RenderOptions} from 'lit-html'
 */

/**
 * @param {readonly string[]} namedSlots
 * @param {Record<string, string>|undefined} childrenDataArgsPlaceholder
 * @returns {any}
 */
const getChildrenData = (namedSlots, childrenDataArgsPlaceholder) => {
	if (!childrenDataArgsPlaceholder) {
		childrenDataArgsPlaceholder = {};
		ForOfSync(namedSlots, (name) => {
			// @ts-expect-error
			childrenDataArgsPlaceholder[name] = name;
		});
	}
	return childrenDataArgsPlaceholder;
};
/**
 * @description
 * - typesafe factory generator for creating element of `WC_extendsA`/`WC_extendsB` class;
 * - this function is returned by static method `.define`;
 * >- bind it with static property;
 * - uses `lit-html` under the hood;
 * @template {(new (...args: any[]) => HTMLElement) & {
 *  tagName: string;
 * 	extendIs: string;
 *  observedAttributes?: readonly string[];
 *  namedSlots?: readonly string[];
 * }} BASE_CONSTRUCTOR
 * @param {BASE_CONSTRUCTOR} arg0
 * @returns {{
 * 		dom:(
 * 		 		attributes?:BASE_CONSTRUCTOR['observedAttributes'] extends readonly string[]
 * 		 			? Partial<
 * 		 					Record<ArrayToKeys<BASE_CONSTRUCTOR['observedAttributes']>, string>
 * 		 				>
 * 		 			: undefined,
 * 		 		childrenData?:(slotName:Record<ArrayToKeys<BASE_CONSTRUCTOR['namedSlots']>, string>)=>TemplateResult,
 * 		 		renderOptions?:RenderOptions
 * 		 	)=>InstanceType<BASE_CONSTRUCTOR>;
 * 		template:
 * 			(
 * 				attributes?:BASE_CONSTRUCTOR['observedAttributes'] extends readonly string[]
 * 					? Partial<
 * 							Record<ArrayToKeys<BASE_CONSTRUCTOR['observedAttributes']>, string>
 * 						>
 * 					: undefined,
 * 				childrenData?:(slotName:Record<ArrayToKeys<BASE_CONSTRUCTOR['namedSlots']>, string>)=>TemplateResult,
 * 			)=>TemplateResult
 * 	}
 * }
 * @example
 * // webcomponent context via `WC_extends`
 * static createElement = this.define(...args);
 * //
 */
export function WC_createElement_bind({ tagName, extendIs, namedSlots = [] }) {
	/**
	 * @type {Record<string, string>|undefined}
	 */
	let childrenDataArgsPlaceholder;
	return {
		dom: (attributes, childrenData, renderOptions) => {
			/**
			 * @type {InstanceType<BASE_CONSTRUCTOR>}
			 */
			let element;
			if (!extendIs) {
				// @ts-expect-error
				element = document.createElement(tagName);
			} else {
				// @ts-expect-error
				element = document.createElement(tagName, {
					is: extendIs,
				});
			}
			if (attributes) {
				ForInSync(attributes, (key, value) => {
					element.setAttribute(key.toString(), value ?? '');
				});
			}
			if (childrenData) {
				const trueChildrenData = childrenData(
					getChildrenData(namedSlots, childrenDataArgsPlaceholder),
				);
				render(trueChildrenData, element, renderOptions);
			}
			return element;
		},
		template(attributes, childrenData) {
			/**
			 * @type {string[]}
			 */
			let attrs = [];
			if (attributes) {
				ForInSync(attributes, (key, value) => {
					attrs.push(`${key.toString()}="${value}"`);
				});
			}
			const tag = unsafeStatic(tagName);
			let attrsString = unsafeStatic(attrs.join(' '));
			/**
			 * @type {TemplateResult}
			 */
			let trueChildrenData;
			if (!childrenData) {
				trueChildrenData = html``;
			} else {
				trueChildrenData = childrenData(getChildrenData(namedSlots, childrenDataArgsPlaceholder));
			}
			return htmlStatic`<${tag} ${attrsString}>${trueChildrenData}</${tag}>`;
		},
	};
}
