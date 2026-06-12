// @ts-check

/**
 * @description
 * - type helper to create ref custom style `property`;
 */
export class WC_StyleProp_bind {
	/**
	 * @description
	 * @param {HTMLElement} element
	 * @param {string} name
	 * - automatically prefixed with `--`;
	 * @param {Object} options
	 * @param {boolean} options.isGlobal
	 * - `false`: target scoped `property` on that component, and that component instance alone;
	 * >- will not even bleed to other instance with same constructor;
	 * - `true`: target style variable defined in global scope(loaded on document `styles` | `link[rel="stylesheet"]`);
	 * @example
	 * @example
	 * // webcomponent context via `WC_extends`
	 * #myStyle = new WC_StyleProp_bind(this, 'my-theme', {isGlobal:false});
	 * //
	 */
	constructor(element, name, { isGlobal }) {
		if (!name.startsWith('--')) {
			name = `--${name}`;
		}
		this.name = name;
		if (isGlobal) {
			this.#style = document.documentElement.style;
		} else {
			this.#style = element.style;
		}
	}
	/**
	 * @type {string}
	 */
	name;
	/**
	 * @type {CSSStyleDeclaration}
	 */
	#style;
	/**
	 * @param  {import('../../typehints/ParametersFollowingN.mts').ParametersFollowingN<CSSStyleDeclaration["setProperty"], 1>} args
	 */
	set = (...args) => {
		if (!this.name) {
			return;
		}
		this.#style.setProperty(this.name, ...args);
	};
	/**
	 * @returns {string|void}
	 */
	get value() {
		if (!this.name) {
			return;
		}
		return this.#style.getPropertyValue(this.name);
	}
	/**
	 * @returns {string|void}
	 */
	get priority() {
		if (!this.name) {
			return;
		}
		return this.#style.getPropertyPriority(this.name);
	}
}
