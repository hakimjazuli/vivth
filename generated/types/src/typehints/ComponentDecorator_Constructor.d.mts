export type ComponentDecorator_Constructor<BASE extends new (...args: any[]) => HTMLElement, ATTRS extends readonly string[]> = BASE & {
    readonly observedAttributes: ATTRS;
};
/**
 * @description Creates a constructor structure with custom static members added.
 * @template {new (...args: any[]) => HTMLElement} BASE
 * @template {readonly string[]} ATTRS
 * @typedef {BASE & {
 *   readonly observedAttributes: ATTRS;
 * }} ComponentDecorator_Constructor
 */
