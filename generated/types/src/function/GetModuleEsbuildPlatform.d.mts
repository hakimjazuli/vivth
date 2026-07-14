/**
 * @description
 * - get valid esbuild platform name for a module path;
 * @param { string } path
 * @returns { Promise<'browser'|'node'|'neutral'|'unsupported'> }
 * @example
 * // D://lib-root/myModule.mjs
 * import process from 'node:process'; // lookupA;
 * import { GetModuleEsbuildPlatform } from "vivth/node";
 *
 * await GetModuleEsbuildPlatform('./myModule.mjs'); // 'node'; caused of lookupA;
 */
export declare function GetModuleEsbuildPlatform(path: string): Promise<'browser' | 'node' | 'neutral' | 'unsupported'>;
