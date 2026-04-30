// @ts-check

/**
 * @template {keyof HTMLElementTagNameMap} TAGNAME
 * @typedef {Object} VLifecycleCallbacks
 * @property {(this:HTMLElementTagNameMap[TAGNAME], defer:(onDisconnected:()=>void)=>void)=>void} [onConnected]
 * @property {(this:HTMLElementTagNameMap[TAGNAME])=>void} [onDisconnected]
 * @property {(this:HTMLElementTagNameMap[TAGNAME], defer:(onDisconnected:()=>void)=>void)=>void} [onAdopted]
 * @property {(this:HTMLElementTagNameMap[TAGNAME], name:string, oldValue:string, newValue:string)=>void} [onAttributeChanged]
 */
