/**
 * - instantiate type helper;
 */
export type AssemblyScriptLoaderInstantiate<RESULTTYPE extends Record<string, unknown>> = typeof import("@assemblyscript/loader").instantiate<RESULTTYPE>;
