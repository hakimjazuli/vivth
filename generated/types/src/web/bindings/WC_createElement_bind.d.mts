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
export function WC_createElement_bind<BASE_CONSTRUCTOR extends (new (...args: any[]) => HTMLElement) & {
    tagName: string;
    extendIs: string;
    observedAttributes?: readonly string[];
    namedSlots?: readonly string[];
}>({ tagName, extendIs, namedSlots }: BASE_CONSTRUCTOR): {
    dom: (attributes?: BASE_CONSTRUCTOR["observedAttributes"] extends readonly string[] ? Partial<Record<ArrayToKeys<BASE_CONSTRUCTOR["observedAttributes"]>, string>> : undefined, childrenData?: (slotName: Record<ArrayToKeys<BASE_CONSTRUCTOR["namedSlots"]>, string>) => TemplateResult, renderOptions?: RenderOptions) => InstanceType<BASE_CONSTRUCTOR>;
    template: (attributes?: BASE_CONSTRUCTOR["observedAttributes"] extends readonly string[] ? Partial<Record<ArrayToKeys<BASE_CONSTRUCTOR["observedAttributes"]>, string>> : undefined, childrenData?: (slotName: Record<ArrayToKeys<BASE_CONSTRUCTOR["namedSlots"]>, string>) => TemplateResult) => TemplateResult;
};
import type { ArrayToKeys } from '../../typehints/ArrayToKeys.mjs';
import type { TemplateResult } from 'lit-html';
import type { RenderOptions } from 'lit-html';
