export type VLifecycleCallbacks<TAGNAME extends keyof HTMLElementTagNameMap> = {
    onConnected?: (this: HTMLElementTagNameMap[TAGNAME], defer: (onDisconnected: () => void) => void) => void;
    onDisconnected?: (this: HTMLElementTagNameMap[TAGNAME]) => void;
    onAdopted?: (this: HTMLElementTagNameMap[TAGNAME], defer: (onDisconnected: () => void) => void) => void;
    onAttributeChanged?: (this: HTMLElementTagNameMap[TAGNAME], name: string, oldValue: string, newValue: string) => void;
};
/**
 * @template {keyof HTMLElementTagNameMap} TAGNAME
 * @typedef {Object} VLifecycleCallbacks
 * @property {(this:HTMLElementTagNameMap[TAGNAME], defer:(onDisconnected:()=>void)=>void)=>void} [onConnected]
 * @property {(this:HTMLElementTagNameMap[TAGNAME])=>void} [onDisconnected]
 * @property {(this:HTMLElementTagNameMap[TAGNAME], defer:(onDisconnected:()=>void)=>void)=>void} [onAdopted]
 * @property {(this:HTMLElementTagNameMap[TAGNAME], name:string, oldValue:string, newValue:string)=>void} [onAttributeChanged]
 */
