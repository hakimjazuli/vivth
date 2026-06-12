import type { ThisParameterOfOrUnknown } from './DecoratorMonkeyPatch.mts';

/**
 * @preserve
 * @description
 * - type helper to create decorator;
 * >- matches argument with host method;
 * @template {(...args: any[]) => any} OriginalFn - The original method type;
 * @template {readonly unknown[]} DecoratorArgs - Tuple of custom decorator arguments;
 * @[blank]typedef {import('./Decorator.mts').Decorator<OriginalFn, DecoratorArgs>} Decorator
 */
export type Decorator<
	OriginalFn extends (this: any, ...args: any[]) => any,
	DecoratorArgs extends readonly unknown[] = [],
> = DecoratorArgs['length'] extends 0
	? // --- CASE 1: NO ARGS ---
		(
			target: OriginalFn,
			context: ClassMethodDecoratorContext<ThisParameterOfOrUnknown<OriginalFn>, OriginalFn>,
		) =>
			| ((this: ThisParameterOfOrUnknown<OriginalFn>, ...args: Parameters<OriginalFn>) => any)
			| void
	: // --- CASE 2: WITH ARGS ---
		(
			...args: DecoratorArgs
		) => (
			target: OriginalFn,
			context: ClassMethodDecoratorContext<ThisParameterOfOrUnknown<OriginalFn>, OriginalFn>,
		) =>
			| ((this: ThisParameterOfOrUnknown<OriginalFn>, ...args: Parameters<OriginalFn>) => any)
			| void;
