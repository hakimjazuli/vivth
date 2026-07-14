import type { ArrayToKeys } from '../../typehints/ArrayToKeys.mjs';
import type { TemplateResult, RenderOptions } from 'lit-html';
export type TypeMap = typeof import('../../function/IsTypeOf.mjs').TypeMap;
/**
 * @description
 * Typesafe factory generator for creating element of `WC_extendsA`/`WC_extendsB` class;
 * Uses `lit-html` under the hood.
 *
 * @template {(new (...args: any[]) => HTMLElement) & {
 *   tagName: string;
 *   extendIsValue: string;
 *   observedAttributes?: readonly string[];
 *   namedSlots?: readonly string[];
 *   props?: Record<
 *     string,
 *     keyof TypeMap | (abstract new (...args: any[]) => any)
 *   >;
 * }} BASE_CONSTRUCTOR
 *
 * @param {BASE_CONSTRUCTOR} arg0
 * @returns {(
 *   param?: {
 *     attrs?: BASE_CONSTRUCTOR['observedAttributes'] extends readonly string[]
 *       ? Partial<Record<ArrayToKeys<BASE_CONSTRUCTOR['observedAttributes']>, string>>
 *       : undefined;
 *     props?: {
 *       [K in keyof NonNullable<BASE_CONSTRUCTOR["props"]>]:
 *         NonNullable<BASE_CONSTRUCTOR["props"]>[K] extends keyof TypeMap
 *           ? TypeMap[NonNullable<BASE_CONSTRUCTOR["props"]>[K]]
 *           : NonNullable<BASE_CONSTRUCTOR["props"]>[K] extends abstract new (...args:any[]) => any
 *             ? InstanceType<NonNullable<BASE_CONSTRUCTOR["props"]>[K]>
 *             : never
 *     };
 *     children?: BASE_CONSTRUCTOR['namedSlots'] extends readonly string[]
 *       ? (slotName: Record<ArrayToKeys<BASE_CONSTRUCTOR['namedSlots']>, string>) => TemplateResult
 *       : undefined;
 *     renderOptions?: RenderOptions;
 *   }
 * ) => InstanceType<BASE_CONSTRUCTOR>}
 */
export declare function WC_createElement_bind<BASE_CONSTRUCTOR extends (new (...args: any[]) => HTMLElement) & {
    tagName: string;
    extendIsValue: string;
    observedAttributes?: readonly string[];
    namedSlots?: readonly string[];
    props?: Record<string, keyof TypeMap | (abstract new (...args: any[]) => any)>;
}>({ tagName, extendIsValue, namedSlots }: BASE_CONSTRUCTOR): (param?: {
    attrs?: BASE_CONSTRUCTOR['observedAttributes'] extends readonly string[] ? Partial<Record<ArrayToKeys<BASE_CONSTRUCTOR['observedAttributes']>, string>> : undefined;
    props?: { [K in keyof NonNullable<BASE_CONSTRUCTOR["props"]>]: NonNullable<BASE_CONSTRUCTOR["props"]>[K] extends keyof TypeMap ? TypeMap[NonNullable<BASE_CONSTRUCTOR["props"]>[K]] : NonNullable<BASE_CONSTRUCTOR["props"]>[K] extends abstract new (...args: any[]) => any ? InstanceType<NonNullable<BASE_CONSTRUCTOR["props"]>[K]> : never; };
    children?: BASE_CONSTRUCTOR['namedSlots'] extends readonly string[] ? (slotName: Record<ArrayToKeys<BASE_CONSTRUCTOR['namedSlots']>, string>) => TemplateResult : undefined;
    renderOptions?: RenderOptions;
}) => InstanceType<BASE_CONSTRUCTOR>;
