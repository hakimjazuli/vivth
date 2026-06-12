// @ts-check

/**
 * @description Creates a constructor structure with custom static members added.
 * @template {new (...args: any[]) => HTMLElement} BASE
 * @template {readonly string[]} ATTRS
 * @typedef {BASE & {
 *   readonly observedAttributes: ATTRS;
 * }} ComponentDecorator_Constructor
 */
