export type AssemblyScriptExportsType<RESULTTYPE extends Record<string, unknown>> = Awaited<ReturnType<typeof import('@assemblyscript/loader').instantiate<RESULTTYPE>>>;
/**
 * - `AssemblyScript` `exports` type helper;
 * @template {Record<string, unknown>} RESULTTYPE
 * @typedef {Awaited<ReturnType<typeof import('@assemblyscript/loader').instantiate<RESULTTYPE>>>} AssemblyScriptExportsType
 */
