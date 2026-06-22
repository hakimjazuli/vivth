/**
 * @description
 * - typesafe factory generator for creating element of `WC_extendsA`/`WC_extendsB` class;
 * - uses `lit-html` under the hood;
 * @template {(new (...args: any[]) => HTMLElement) & {
 *  tagName: string;
 * 	extendIsValue: string;
 *  observedAttributes?: readonly string[];
 *  namedSlots?: readonly string[];
 * 	props?: Record<string, keyof TypeMap|(new (...args:any[])=>any)>;
 * }} BASE_CONSTRUCTOR
 * @param {BASE_CONSTRUCTOR} arg0
 * @returns {(
 * 	param?:{
 * 		attrs?:BASE_CONSTRUCTOR['observedAttributes'] extends readonly string[]
 * 			? Partial<
 * 					Record<ArrayToKeys<BASE_CONSTRUCTOR['observedAttributes']>, string>
 * 				>
 * 			: undefined;
 * 		props?: {[K in keyof NonNullable<BASE_CONSTRUCTOR["props"]>]:
 * 			NonNullable<BASE_CONSTRUCTOR["props"]>[K] extends keyof TypeMap
 * 				? TypeMap[NonNullable<BASE_CONSTRUCTOR["props"]>[K]]
 * 				: InstanceType<NonNullable<BASE_CONSTRUCTOR["props"]>[K]>
 * 		};
 * 		children?:(slotName:Record<ArrayToKeys<BASE_CONSTRUCTOR['namedSlots']>, string>)=>TemplateResult;
 * 		renderOptions?:RenderOptions;
 * 	},
 * )=>InstanceType<BASE_CONSTRUCTOR>}
 * @example
 */
export function WC_createElement_bind<BASE_CONSTRUCTOR extends (new (...args: any[]) => HTMLElement) & {
    tagName: string;
    extendIsValue: string;
    observedAttributes?: readonly string[];
    namedSlots?: readonly string[];
    props?: Record<string, keyof TypeMap | (new (...args: any[]) => any)>;
}>({ tagName, extendIsValue, namedSlots }: BASE_CONSTRUCTOR): (param?: {
    attrs?: BASE_CONSTRUCTOR["observedAttributes"] extends readonly string[] ? Partial<Record<ArrayToKeys<BASE_CONSTRUCTOR["observedAttributes"]>, string>> : undefined;
    props?: { [K in keyof NonNullable<BASE_CONSTRUCTOR["props"]>]: NonNullable<BASE_CONSTRUCTOR["props"]>[K] extends keyof TypeMap ? TypeMap[NonNullable<BASE_CONSTRUCTOR["props"]>[K]] : InstanceType<NonNullable<BASE_CONSTRUCTOR["props"]>[K]>; };
    children?: (slotName: Record<ArrayToKeys<BASE_CONSTRUCTOR["namedSlots"]>, string>) => TemplateResult;
    renderOptions?: RenderOptions;
}) => InstanceType<BASE_CONSTRUCTOR>;
export type TypeMap = typeof import("../../function/IsTypeOf.mjs").TypeMap;
import type { ArrayToKeys } from '../../typehints/ArrayToKeys.mjs';
import type { TemplateResult } from 'lit-html';
import type { RenderOptions } from 'lit-html';
