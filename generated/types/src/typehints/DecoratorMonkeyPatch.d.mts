/**
 * Utility to extract the 'this' context from a function, defaulting to unknown.
 */
export type ThisParameterOfOrUnknown<T> = T extends (this: infer U, ...args: any[]) => any ? U : unknown;
/**
 * @preserve
 * @description
 * - type helper to create decorator for monkeypatching class/instance method;
 * >- matches argument with host method;
 * >- matches return type with host method;
 * @template {(...args: any[]) => any} OriginalFn - The original method type;
 * @template {readonly unknown[]} DecoratorArgs - Tuple of custom decorator arguments;
 * @[blank]typedef {import('./DecoratorMonkeyPatch.mts').DecoratorMonkeyPatch<OriginalFn, DecoratorArgs>} DecoratorMonkeyPatch
 */
export type DecoratorMonkeyPatch<OriginalFn extends (this: any, ...args: any[]) => any, DecoratorArgs extends readonly unknown[] = []> = DecoratorArgs['length'] extends 0 ? (target: OriginalFn, context: ClassMethodDecoratorContext<ThisParameterOfOrUnknown<OriginalFn>, OriginalFn>) => ((this: ThisParameterOfOrUnknown<OriginalFn>, ...args: Parameters<OriginalFn>) => ReturnType<OriginalFn>) | void : (...args: DecoratorArgs) => (target: OriginalFn, context: ClassMethodDecoratorContext<ThisParameterOfOrUnknown<OriginalFn>, OriginalFn>) => ((this: ThisParameterOfOrUnknown<OriginalFn>, ...args: Parameters<OriginalFn>) => ReturnType<OriginalFn>) | void;
