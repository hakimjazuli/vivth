// @ts-check

import { readFile } from 'node:fs/promises';
import { basename, dirname, extname, join, relative } from 'node:path';

import { transform } from 'esbuild';

import { Console } from '../class/Console.mjs';
import { Paths } from '../class/Paths.mjs';
import { TryAsync } from './TryAsync.mjs';
import { FileSafe } from '../class/FileSafe.mjs';
import { Preferrence } from '../common/Preferrence.mjs';
import { CompileAS } from '../bundler/CompileAS.mjs';
import { ForOfSync } from './ForOfSync.mjs';
import { PipeSync } from './PipeSync.mjs';

const suffixFor_asar = '_ASasar';
const suffixForUniversal = '_ASUniversal';

/**
 * @description
 * - turn `.mts`||`.ts` file into `.mjs`, no bundling, just traspilation;
 * - on certain circumstance where `.mjs` result needed to be typed, you need to manually add `jsdoc`;
 * >- uses `"at"preserve` to register `jsdoc`;
 * >- at [at]\[blank\]typedef, import itself.mts pointing to the same exported object to fully type it in mjs(which `vivth` used to generate exports);
 * - auto compile and typehint `.as.ts` to `.wasm`;
 * @param {string} path
 * - `relative`(to `Paths.root`) OR `absolute`, both are accepted;
 * @param {Object} [options]
 * @param {string} [options.overrideOutputDir]
 * - default: write conversion to same directory;
 * - path are relative to project root;
 * @param {BufferEncoding} [options.encoding]
 * - default: `utf-8`;
 * @param {import('../typehints/AutoDocASOptions.mjs').AutoDocASOptions} [options.assemblyScriptOptions]
 * @returns {Promise<void>}
 * @example
 * import { TsToMjs } from 'vivth/node';
 *
 * await TsToMjs('./myFile.mts', { encoding: 'utf-8', overrideOutputDir: './other/dir' });
 */
export async function TsToMjs(
	path,
	{
		overrideOutputDir = undefined,
		encoding = Preferrence.encoding,
		assemblyScriptOptions = undefined,
	} = {},
) {
	path = Paths.diskAbsolute(path);
	if (path.endsWith('.as.ts')) {
		if (basename(path).startsWith('-') || !assemblyScriptOptions) {
			return;
		}

		const [, errorCompilingAssemblyScript] = await TryAsync(async () => {
			let {
				ASArgv = [],
				ASAPIOptions = undefined,
				generateFSasarImporter = false,
			} = assemblyScriptOptions;
			path = Paths.normalize(path);
			const pathNoExt = path.replace(/.as.ts$/, '');
			const wasmPath = `${pathNoExt}.wasm`;
			const { error: errorCompileAS } = await CompileAS(
				[path, '--outFile', wasmPath, '--bindings', 'esm', ...ASArgv],
				ASAPIOptions,
			);
			if (errorCompileAS) {
				throw { errorCompileAS };
			}
			if (generateFSasarImporter) {
				const handler = [
					/**
					 * @param {string} path
					 * @returns {string}
					 */
					(path) => relative(dirname(path), path),
					/**
					 * @param {string} path
					 * @returns {string}
					 */
					(path) => {
						if (!pathNoExt.includes('/vivth/src/')) {
							return 'vivth/all';
						}
						if (path.startsWith('.')) {
							return Paths.normalize(path);
						}
						return Paths.normalize(`./${path}`);
					},
				];
				const paths__ = [
					'/src/function/InstantiateAssemblyScript.mjs',
					'/src/bundler/adds/PathFSFile.mjs',
				];
				const res = [];
				for (let i = 0; i < paths__.length; i++) {
					const path_ = paths__[i];
					if (!path_) {
						continue;
					}
					res.push(PipeSync(join(Paths.root, path_), ...handler));
				}
				const [importInstantiateAssemblyScriptFrom = '', importPathFSFrom = ''] = res;
				const baseNameNoExt = basename(pathNoExt);
				const mjsNoExt = `${baseNameNoExt}${suffixFor_asar}`;
				const mjsPath = `${mjsNoExt}.mjs`;
				const [, errorWrite] = await FileSafe.write(
					`${pathNoExt}${suffixFor_asar}.mjs`,
					`// @ts-check
import { InstantiateAssemblyScript } from '${Paths.normalize(importInstantiateAssemblyScriptFrom)}';
import { PathFSFile } from '${Paths.normalize(importPathFSFrom)}';

/**
 * @-description-
 * - \`typehinted\` WASM of AssemblyScript binding;
 * >- can only be used for \`nodeJS\` compatible runtime;
 * >- DO NOT USE ON BROWSER RUNTIME;
 * - used for integration with \`vivth.FSasar\`;
 * >- able to be bundled inline;
 * @param {Parameters<typeof InstantiateAssemblyScript<import('./fib.js')>>[1]} [import_]
 * @returns {ReturnType<typeof InstantiateAssemblyScript<import('./fib.js')>>}
 */
export const ${mjsNoExt} = ( import_ = {} ) => InstantiateAssemblyScript(PathFSFile.vivthFile('./${baseNameNoExt}.wasm'), import_);
`.replace('-description-', 'description'),
					{ encoding: Preferrence.encoding },
				);
				if (errorWrite) {
					Console.error(
						{
							[TsToMjs.name]: `❌error generate FSInline Importer '${mjsPath}'`,
							errorWrite,
						},
						{
							now: true,
						},
					);
					return;
				}
				Console.info(
					{
						[TsToMjs.name]: `✅successfully generate FSInline Importer '${mjsPath}'`,
					},
					{
						now: true,
					},
				);
			}
			Console.info(
				{
					[TsToMjs.name]: `✅successfully compiles '${path}'`,
				},
				{
					now: true,
				},
			);
		});
		if (errorCompilingAssemblyScript) {
			Console.error({ errorCompilingAssemblyScript }, { now: true });
		}
		return;
	}
	const ext = extname(path);
	if (
		/** */
		ext === '.js' &&
		(await FileSafe.exist(path.replace(/.js$/, '.as.ts')))
	) {
		const [content, errorReadFile] = await TryAsync(async () => {
			return (await readFile(path)).toString(Preferrence.encoding);
		});
		if (errorReadFile) {
			Console.error({ errorReadFile }, { now: true });
			return;
		}
		const regex = /export\s+const\s+({[\s\S]*?})\s*=\s*await/g;
		const matches = content.matchAll(regex).toArray();
		await Promise.all(
			ForOfSync(matches, async (match) => {
				const match1 = match[1];
				const trueContent = `// @ts-check

import ${match1} from './${basename(path)}';

/**
 * @-description-
 * - \`typehinted\` WASM of AssemblyScript binding, can be used for:
 * >- \`browser\` runtime;
 * >- \`nodeJS\` compatible runtime;
 */
export const ${basename(path.replace(/.js$/, suffixForUniversal))} = ${match1};
`.replace('-description-', 'description');
				await FileSafe.write(path.replace(/.js$/, `${suffixForUniversal}.mjs`), trueContent, {
					encoding: Preferrence.encoding,
				});
			})[0],
		);
		return;
	}
	if (
		(ext === '.ts' && (await FileSafe.exist(path.replace(/.ts$/, '.as.ts')))) ||
		(ext !== '.ts' && ext !== '.mts')
	) {
		return;
	}
	const [content, errorReadFile] = await TryAsync(async () => {
		return await readFile(path, { encoding });
	});
	if (errorReadFile) {
		Console.error({ errorReadFile }, { now: true });
		return;
	}
	const [result, transformError] = await TryAsync(async () => {
		return await transform(content, {
			loader: 'ts',
			format: 'esm',
			sourcemap: false,
			target: 'esnext',
			legalComments: 'inline',
		});
	});
	if (transformError || result === undefined) {
		Console.error({ transformError }, { now: true });
		return;
	}
	const outputDir = !!overrideOutputDir ? Paths.diskAbsolute(overrideOutputDir) : dirname(path);
	const outputPath = join(outputDir, basename(path).replace(new RegExp(`${ext}$`), '.mjs'));
	const [, writeError] = await FileSafe.write(outputPath, result.code, { encoding });
	if (writeError === undefined) {
		return;
	}
	Console.error({ writeError }, { now: true });
}
