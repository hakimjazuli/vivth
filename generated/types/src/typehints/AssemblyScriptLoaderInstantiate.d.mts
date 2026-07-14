export type AssemblyScriptLoaderInstantiate<RESULTTYPE extends Record<string, unknown>> = typeof import('@assemblyscript/loader').instantiate<RESULTTYPE>;
/**
 * - instantiate type helper;
 * @template {Record<string, unknown>} RESULTTYPE
 * @typedef {typeof import('@assemblyscript/loader').instantiate<RESULTTYPE>} AssemblyScriptLoaderInstantiate
 */
