// @ts-check

import { NodeModuleList } from './NodeModuleList.mjs';

const vivthNonBrowserDependencies = [
	'esbuild',
	'../prelude/bootstrap.js',
	'./common',
	'../prelude/diagnostic.js',
	'assemblyscript/asc',
	'./adds/asarPath.mjs',
	'assemblyscript',
	'pkg',
	'@electron/asar',
	'mime-types',
];

/**
 * @description
 * - esbuild external Set for browser platform;
 * - this Set is automatically applied to [FileSelfMapper](#fileselfmapper) and [EsBundler](#esbundler) if platform is equal to browser;
 * @type {Set<string>}
 */
export const BrowserExternals = new Set(vivthNonBrowserDependencies).union(NodeModuleList());
