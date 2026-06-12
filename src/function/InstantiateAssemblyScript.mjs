// @ts-check

import { instantiate } from '@assemblyscript/loader';
import { FSasar } from '../bundler/FSasar.mjs';

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
 * import { PathFSFile, InstantiateAssemblyScript } from 'vivth/node';
 *
 * InstantiateAssemblyScript(PathFSFile.vivthFile('../function/myAsm.wasm'));;
 */
export async function InstantiateAssemblyScript(filePathFromProject, imports) {
	return await instantiate(Buffer.from(await FSasar.file(filePathFromProject)), imports);
}
