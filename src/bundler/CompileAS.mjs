// @ts-check

import { main as ascMain } from 'assemblyscript/asc';

/**
 * @description
 * - helper to compile `AssemblyScript`;
 * - file name should endswith `.as.ts`;
 * >- basename that starts with `-` are excluded, and to be used as sharable library OR code management/split;
 * - will generate:
 * >- `${fileBaseNameNoExt}_import.mjs`: setting for import input;
 * >>- also the only file that are editable;
 * >- `${fileBaseNameNoExt}.d.ts`: asc generated typehint;
 * >- `${fileBaseNameNoExt}.js`: asc generated esm binding;
 * >- `${fileBaseNameNoExt}.wasm`: asc compiled;
 * >- `${fileBaseNameNoExt}_ASUniversal.mjs`: able to be `JSautoDOC`ed, for universal runtime;
 * >- `${fileBaseNameNoExt}_ASasar.mjs`: able to be `JSautoDOC`ed, use as `vivth.FSasar` binding;
 * - generated file are on the same directory as the source, so make sure to isolate the source from other file(in a single different directory), as to not make it messy real fast;
 * - assuming `js/tsconfig.json` should already set this following value:
 * >- `compilerOptions.allowJs`: true;
 * >- `compilerOptions.checkJs`: false;
 * >- should excludes: `.js`, `.as.ts`, `.wasm`;
 * @param {Parameters<import('assemblyscript/asc')["main"]>} args
 * - as of `vivth@1.5.x`, `arg0` type `string[]` produce more stable results than `CompilerOptions`;
 * @returns {ReturnType<import('assemblyscript/asc')["main"]>}
 * @example
 * import { CompileAS } from 'vivth/node';
 *
 * const { error } = await CompileAS(
 * 	[inputABSPath, '--outFile', wasmABSPath, '--bindings', 'esm', ...ASArgv],
 * 	ASAPIOptions
 * );
 */
export async function CompileAS(...args) {
	return await ascMain(...args);
}
