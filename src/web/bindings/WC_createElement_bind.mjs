// @ts-check

import { render } from 'lit-html';

import { ForInSync } from '../../function/ForInSync.mjs';
import { ForOfSync } from '../../function/ForOfSync.mjs';

/**
 * @import {ArrayToKeys} from '../../typehints/ArrayToKeys.mjs'
 * @import {TemplateResult, RenderOptions} from 'lit-html'
 */
/**
 * @typedef {typeof import('../../function/IsTypeOf.mjs').TypeMap} TypeMap
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

export function WC_createElement_bind({ tagName, extendIsValue, namedSlots = [] }) {
	/**
	 * @type {Record<string, string>|undefined}
	 */
	let childrenDataArgsPlaceholder;
	return ({ attrs, children, renderOptions, props } = {}) => {
		/**
		 * @type {InstanceType<BASE_CONSTRUCTOR>}
		 */
		let element;
		if (!extendIsValue) {
			// @ts-expect-error
			element = document.createElement(tagName);
		} else {
			// @ts-expect-error
			element = document.createElement(tagName, {
				is: extendIsValue,
			});
		}
		if (attrs) {
			ForInSync(attrs, (key, value) => {
				element.setAttribute(key.toString(), value ?? '');
			});
		}
		if (children) {
			const trueChildrenData = children(getChildrenData(namedSlots, childrenDataArgsPlaceholder));
			render(trueChildrenData, element, renderOptions);
		}
		return Object.assign(element, { props });
	};
}
