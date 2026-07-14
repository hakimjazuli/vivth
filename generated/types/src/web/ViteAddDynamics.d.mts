import { NewDynamicsExport } from '../function/NewDynamicsExport.mjs';
/**
 * @description
 * - `vite.rollup/down` plugin abstraction for [NewDynamicsExport](#newdynamicsexport);
 * @param {Parameters<typeof NewDynamicsExport>} args
 * @returns {import('vite').PluginOption}
 */
export declare function ViteAddDynamics(...args: Parameters<typeof NewDynamicsExport>): import('vite').PluginOption;
