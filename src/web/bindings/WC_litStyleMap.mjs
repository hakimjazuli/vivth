// @ts-check

import { styleMap } from 'lit-html/directives/style-map.js';

/**
 * @description
 * - type helper for `import { styleMap } from 'lit-html/directives/style-map.js';`, by typehinting the properties;
 * @param {Partial<CSSStyleProperties>} properties
 * @returns {import('lit-html/directive.js').DirectiveResult}
 */
export function WC_litStyleMap(properties) {
	// @ts-expect-error
	return styleMap(properties);
}
