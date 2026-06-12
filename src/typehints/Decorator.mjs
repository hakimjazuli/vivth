/**
 * @preserve
 * @description
 * - type helper to create decorator;
 * >- matches argument with host method;
 * @template {(...args: any[]) => any} OriginalFn - The original method type;
 * @template {readonly unknown[]} DecoratorArgs - Tuple of custom decorator arguments;
 * @typedef {import('./Decorator.mts').Decorator<OriginalFn, DecoratorArgs>} Decorator
 */
