// @ts-check

import { WC_createElement_bind } from '../bindings/WC_createElement_bind.mjs';

/**
 * @import {WC_TagName_type} from '../common/WC_TagName_type.mjs'
 */
/**
 * @typedef {typeof import('../../function/IsTypeOf.mjs').TypeMap} TypeMap
 */
/**
 * @description
 * - helper funtion for wecomponent instantiator;
 * - it uses WC_createElement_bind, which uses `lit-html`;
 * - alternatively, if you want to create a baseline component that are not to be , you can just
 * @template {new (...args: any[]) => HTMLElement} BASE_CONSTRUCTOR
 * @template {{
 * 	class?:string;
 * 	style?:string;
 *  observedAttributes?: readonly string[];
 *  namedSlots?: readonly string[];
 * 	props?: Record<string, keyof TypeMap|(new (...args:any[])=>any)>;
 * }} STANDARD
 * @template {(BASE_CONSTRUCTOR) & {
 * 	tagName: string;
 * 	extendIsValue: string;
 * 	observedAttributes?: STANDARD["observedAttributes"];
 * 	namedSlots?: STANDARD["namedSlots"];
 * 	props?: STANDARD["props"];
 * }} CREATEARGS
 * @template {string} TAG
 * @param {WC_TagName_type<TAG>} tagName
 * @param {CREATEARGS} classRef
 * @param {ElementDefinitionOptions} elementDefinitionOptions
 * @returns {ReturnType<typeof WC_createElement_bind<CREATEARGS>>}
 */
export function WC_DefineCustomElement(tagName, classRef, elementDefinitionOptions) {
	if (elementDefinitionOptions && elementDefinitionOptions.extends) {
		classRef.tagName = elementDefinitionOptions.extends;
		classRef.extendIsValue = tagName;
	} else {
		classRef.tagName = tagName;
	}
	customElements.define(tagName, classRef, elementDefinitionOptions);
	return WC_createElement_bind(classRef);
}
