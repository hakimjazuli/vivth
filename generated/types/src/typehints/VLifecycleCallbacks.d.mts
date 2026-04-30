export type VLifecycleCallbacks<TAGNAME extends keyof HTMLElementTagNameMap> = {
    onConnected?: ((this: HTMLElementTagNameMap[TAGNAME], defer: (onDisconnected: () => void) => void) => void) | undefined;
    onDisconnected?: ((this: HTMLElementTagNameMap[TAGNAME]) => void) | undefined;
    onAdopted?: ((this: HTMLElementTagNameMap[TAGNAME], defer: (onDisconnected: () => void) => void) => void) | undefined;
    onAttributeChanged?: ((this: HTMLElementTagNameMap[TAGNAME], name: string, oldValue: string, newValue: string) => void) | undefined;
};
