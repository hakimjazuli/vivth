export type ComponentDecorator_Constructor<BASE extends new (...args: any[]) => HTMLElement, ATTRS extends readonly string[]> = BASE & {
    readonly observedAttributes: ATTRS;
};
