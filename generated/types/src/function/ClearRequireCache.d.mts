/**
 * @description
 * - safely clear `import`/`require` `caches`;
 * @type {(path:string)=>void}
 * @example
 * import { ClearRequireCache } from 'vivth/node';
 *
 * ClearRequireCache('D://path/to.mjs');
 */
export declare function ClearRequireCache(keysOfCache: string): void;
