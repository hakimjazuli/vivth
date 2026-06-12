export type SafeImportReturnType<IMPORTTARGET extends unknown> = Awaited<ReturnType<typeof import("../function/SafeImport.mjs").SafeImport<IMPORTTARGET>>>;
