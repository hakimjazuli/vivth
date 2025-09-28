// @ts-check

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
export function CreateESPlugin(name, setup) {
	return {
		name: JSON.stringify({ 'vivth:CustomESBuildPlugin': name }),
		setup,
	};
}
