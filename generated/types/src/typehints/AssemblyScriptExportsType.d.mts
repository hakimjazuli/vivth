/**
 * - `AssemblyScript` `exports` type helper;
 */
export type AssemblyScriptExportsType<RESULTTYPE extends Record<string, unknown>> = Awaited<ReturnType<typeof import("@assemblyscript/loader").instantiate<RESULTTYPE>>>;
