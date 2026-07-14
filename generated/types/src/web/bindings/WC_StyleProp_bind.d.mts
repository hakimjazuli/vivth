/**
 * @description
 * - type helper to create ref custom style `property`;
 */
export declare class WC_StyleProp_bind {
    #private;
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
    constructor(element: HTMLElement, name: string, { isGlobal }: {
        isGlobal: boolean;
    });
    /**
     * @type {string}
     */
    name: string;
    /**
     * @param  {import('../../typehints/ParametersFollowingN.mts').ParametersFollowingN<CSSStyleDeclaration["setProperty"], 1>} args
     */
    set: (...args: import('../../typehints/ParametersFollowingN.mts').ParametersFollowingN<CSSStyleDeclaration["setProperty"], 1>) => void;
    /**
     * @returns {string|void}
     */
    get value(): string | void;
    /**
     * @returns {string|void}
     */
    get priority(): string | void;
}
