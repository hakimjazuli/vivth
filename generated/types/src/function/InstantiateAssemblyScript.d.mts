/**
 * @description
 * - function wrapper for `.asar` `.wasm` from `AssemblyScript` asset;
 * - conventions for using this class in conjuction with `JSautoDOC`:
 * @template {Record<string, unknown>} RESULTTYPE
 * @param {import('../bundler/adds/PathFSFile.mjs').PathFSFile} filePathFromProject
 * - call `PathFSFile.vivthFile`;
 * @param {Parameters<import('../typehints/AssemblyScriptLoaderInstantiate.mjs').AssemblyScriptLoaderInstantiate<RESULTTYPE>>[1]} [imports]
 * @returns {Promise<import('../typehints/AssemblyScriptExportsType.mjs').AssemblyScriptExportsType<RESULTTYPE>>}
 * @example
 * import { PathFSFile, InstantiateAssemblyScript } from "vivth";
 *
 * InstantiateAssemblyScript(PathFSFile.vivthFile('../function/myAsm.wasm'));;
 */
export function InstantiateAssemblyScript<RESULTTYPE extends Record<string, unknown>>(filePathFromProject: import("../bundler/adds/PathFSFile.mjs").PathFSFile, imports?: Parameters<import("../typehints/AssemblyScriptLoaderInstantiate.mjs").AssemblyScriptLoaderInstantiate<RESULTTYPE>>[1]): Promise<import("../typehints/AssemblyScriptExportsType.mjs").AssemblyScriptExportsType<RESULTTYPE>>;
