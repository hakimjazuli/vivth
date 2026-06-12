// @ts-check

import { html } from 'lit-html/static.js';

/**
 * @import {TemplateResult} from 'lit-html'
 * @import {ArrayToKeys} from '../../typehints/ArrayToKeys.mts'
 */

/**
 * @description
 * - typesafe factory generator for creating slot element of `WC_extendsA`/`WC_extendsB` class;
 * @template {{
 * 	namedSlots?: readonly string[]
 * }} NAMEDSLOTS
 * @param {ArrayToKeys<NAMEDSLOTS["namedSlots"] extends readonly string[]
 * 	? NAMEDSLOTS["namedSlots"]
 * 	: never
 * >} name
 * @param {TemplateResult} [defaultNode]
 * @returns {TemplateResult}
 * @example
 * // webcomponent context via `WC_extends`.callback props
 * this.createNamedSlot(...args);
 * //
 */
export function WC_createNamedSlot(name, defaultNode = html``) {
	return html`<slot name="${name}">${defaultNode}</slot>`;
}
