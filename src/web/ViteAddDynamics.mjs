// @ts-check

import { NewDynamicsExport } from '../function/NewDynamicsExport.mjs';

/**
 * @description
 * - `vite.rollup/down` plugin abstraction for [NewDynamicsExport](#newdynamicsexport);
 * @param {Parameters<typeof NewDynamicsExport>} args
 * @returns {import('vite').PluginOption}
 */
export function ViteAddDynamics(...args) {
	/**
	 * @type {boolean|undefined}
	 */
	let started;
	return {
		name: 'vivth/web:AddDynamics',
		apply: 'serve', // <-- only applies in dev server
		async configureServer(devServer) {
			if (started) {
				return;
			}
			started = true;
			args[0].useFetchForAssets = false;
			const [dynamicExports, errorCreatingDynamicExport] = await NewDynamicsExport(...args);
			if (errorCreatingDynamicExport) {
				return;
			}
			devServer.httpServer?.on('close', () => {
				dynamicExports.vivthCleanup();
			});
		},
	};
}
