/**
 * @description
 * - typed esbuild Plugin generator;
 * @param {string} name
 * @param {import('esbuild').Plugin["setup"]} setup
 * @returns {import('esbuild').Plugin}
 * @example
 * import { CreateESPlugin } from 'vivth/neutral';
 *
 * export const pluginAddCopyRight = CreateESPlugin(
 * 	'MyCopyrightDeclaration',
 * 	async (build) => {
 * 		// build script;
 * 	}
 * );
 */
export declare function CreateESPlugin(name: string, setup: import('esbuild').Plugin["setup"]): import('esbuild').Plugin;
