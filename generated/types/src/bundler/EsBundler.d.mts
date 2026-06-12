/**
 * @description
 * - opinionated bundler for limited extensions using esbuild;
 * - bundles all imports into a single output string;
 * @param {Object} options
 * @param {string} options.content
 * - the code can also uses composites from the result from multiple readFiles;
 * @param {string} options.root
 * - use dirname of said fileString path;
 * @param {'.mts'|'.ts'|'.mjs'} options.extension
 * - supported extension;
 * @param {boolean} [options.withBinHeader]
 * @param {Omit<Parameters<build>[0],
 * 'entryPoints'|'bundle'|'write'|'sourcemap'|'outdir'|'splitting'|'format'>
 * } [esbuildOptions]
 * - assume `esm`;
 * @returns {ReturnType<typeof TryAsync<string>>}
 * @example
 * import { EsBundler } from 'vivth/node';
 *
 * const [bundledString, errorBundling] = EsBundler(
 * 	{
 * 		content: ``,
 * 		extension: '.mts',
 * 		...options
 * 	},
 * 	{
 * 	...esbuildOptions,
 * });
 */
export function EsBundler({ content, extension, root, withBinHeader }: {
    content: string;
    root: string;
    extension: ".mts" | ".ts" | ".mjs";
    withBinHeader?: boolean | undefined;
}, esbuildOptions?: Omit<Parameters<typeof build>[0], "entryPoints" | "bundle" | "write" | "sourcemap" | "outdir" | "splitting" | "format">): ReturnType<typeof TryAsync<string>>;
import { build } from 'esbuild';
import { TryAsync } from '../function/TryAsync.mjs';
