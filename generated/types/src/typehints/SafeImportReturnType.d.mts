export type SafeImportReturnType<IMPORTTARGET extends any> = Awaited<ReturnType<typeof import('../function/SafeImport.mjs').SafeImport<IMPORTTARGET>>>;
/**
 * @template {any} IMPORTTARGET
 * @typedef {Awaited<ReturnType<typeof import('../function/SafeImport.mjs').SafeImport<IMPORTTARGET>>>} SafeImportReturnType
 */
