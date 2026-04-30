/**
 * @description
 * - typed esbuild Plugin generator;
 * @param {string} name
 * @param {import('esbuild').Plugin["setup"]} setup
 * @returns {import('esbuild').Plugin}
 * @example
 * import { CreateESPlugin } from 'vivth';
 *
 * export const pluginAddCopyRight = CreateESPlugin(
 * 	'MyCopyrightDeclaration',
 * 	async (build) => {
 * 		// build script;
 * 	}
 * );
 */
export function CreateESPlugin(name: string, setup: import("esbuild").Plugin["setup"]): import("esbuild").Plugin;
