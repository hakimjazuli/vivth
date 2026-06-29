/**
 * @description
 * - type helper to create decorator for monkeypatching class/instance method;
 * >- matches argument with host method;
 * >- matches return type with host method;
 * @template {(...args: any[]) => any} OriginalFn - The original method type;
 * @template {readonly unknown[]} DecoratorArgs - Tuple of custom decorator arguments;
 * @typedef {import('./DecoratorMonkeyPatch.mts').DecoratorMonkeyPatch<OriginalFn, DecoratorArgs>} DecoratorMonkeyPatch
 */
