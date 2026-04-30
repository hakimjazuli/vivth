declare const ChainableProxy_base: ProxyConstructor;
/**
 * @description
 * `ChainableProxy` description placeholder;
 * @template {any} T
 */
export class ChainableProxy<T extends unknown> extends ChainableProxy_base {
    [x: string]: any;
    /**
     * @param {T} ctx
     */
    constructor(ctx: T);
}
export {};
