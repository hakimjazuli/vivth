// @ts-check

import { readFile } from 'node:fs/promises';
import { basename, dirname, extname, join } from 'node:path';

import { transform } from 'esbuild';

import { Console } from '../class/Console.mjs';
import { Paths } from '../class/Paths.mjs';
import { TryAsync } from './TryAsync.mjs';
import { FileSafe } from '../class/FileSafe.mjs';

/**
 * @description
 * - turn `.mts`||`.ts` file into `.mjs`, no bundling, just translation;
 * - on certain circumstance where `.mjs` result needed to be typed, you need to manually add `jsdoc`;
 * >- uses `"at"preserve` to register `jsdoc` inline;
 * @param {string} path_
 * - path from `Paths.root`;
 * @param {Object} [options]
 * @param {string} [options.overrideDir]
 * - default: write conversion to same directory;
 * - path are relative to project root;
 * @param {BufferEncoding} [options.encoding]
 * - default: `utf-8`;
 * @returns {Promise<void>}
 * @example
 * import { TsToMjs } from 'vivth';
 *
 * TsToMjs('./myFile.mts', { encoding: 'utf-8', overrideDir: './other/dir' });
 */
export async function TsToMjs(path_, { overrideDir = undefined, encoding = 'utf-8' } = {}) {
	if (Paths.root === undefined) {
		return;
	}
	const rootPath = Paths.normalize(Paths.root);
	if (Paths.normalize(path_).startsWith(rootPath) === false) {
		path_ = Paths.normalize(join(rootPath, path_));
	}
	const ext = extname(path_);
	if (ext !== '.ts' && ext !== '.mts') {
		return;
	}
	const [content, error] = await TryAsync(async () => {
		return await readFile(path_, { encoding });
	});
	if (error) {
		Console.error(error);
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
		Console.error(transformError);
		return;
	}
	const outputDir = overrideDir ? join(rootPath, overrideDir) : dirname(path_);
	const outputPath = join(outputDir, basename(path_).replace(ext, '.mjs'));
	const [, writeError] = await FileSafe.write(outputPath, result.code, { encoding });
	if (writeError === undefined) {
		return;
	}
	Console.error(writeError);
}
