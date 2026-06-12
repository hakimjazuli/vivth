// @ts-check

import { resolve, relative } from 'node:path';

import { Paths } from '../../class/Paths.mjs';
import { CreateESPlugin } from '../CreateESPlugin.mjs';
import { onEndEsBuildErrorLogger } from './onEndEsBuildErrorLogger.mjs';
import { LastEditedUnix } from './LastEditedUnix.mjs';
import { Console } from '../../class/Console.mjs';
import { ForOfSync } from '../../function/ForOfSync.mjs';
import { FileSafe } from '../../class/FileSafe.mjs';
import { resolveJSDependencyPath } from './resolveJSDependencyPath.mjs';

/**
 * @import {Plugin} from 'esbuild'
 */

/**
 * @param {string} path
 * @param {string} targetPath
 * @param {string} watchPath
 * @param {string} mapToPath
 * @param {Map<string, Set<string>>} depMap
 * @param {Map<string, () => Promise<any>>} esbuildPathRebuild
 * @returns {Plugin}
 */
export const autoExternalize = (
	path,
	targetPath,
	watchPath,
	mapToPath,
	depMap,
	esbuildPathRebuild,
) => {
	return CreateESPlugin('JSDirMapper:auto-externalize', ({ onResolve, onEnd }) => {
		onResolve({ filter: /^\.{1,2}\// }, async ({ resolveDir, path: pathSpecifier }) => {
			const fullPath = Paths.normalize(resolve(resolveDir, pathSpecifier));
			if (await resolveJSDependencyPath(fullPath)) {
				return null;
			}
			const runtimePath = fullPath.replace(watchPath, mapToPath);
			const transpiledModuleRuntimePath = await FileSafe.exist(`${runtimePath}.mjs`);
			if (!fullPath.endsWith('.mjs') && transpiledModuleRuntimePath) {
				pathSpecifier = `${pathSpecifier}.mjs`;
			}
			const rel = Paths.normalize(relative(watchPath, fullPath));
			if (rel.startsWith('../')) {
				return null;
			}
			if (!depMap.has(fullPath)) {
				depMap.set(fullPath, new Set());
			}
			depMap.get(fullPath)?.add(path);
			const resolvedPath = `${pathSpecifier}?t=${await LastEditedUnix(fullPath)}`;
			return { external: true, path: resolvedPath };
		});
		onEnd(async ({ errors: errorsBuild }) => {
			if (errorsBuild.length) {
				onEndEsBuildErrorLogger(errorsBuild);
				return;
			}
			Console.info(
				{
					JSDirMapper: `✅ Successfully Bundle'${path}' 👉 '${targetPath}'`,
				},
				{
					now: true,
				},
			);
			const importers = depMap.get(path);
			if (!importers) {
				return;
			}
			await Promise.all(
				ForOfSync(importers, async (importer) => {
					await esbuildPathRebuild.get(importer)?.();
				})[0],
			);
		});
	});
};
