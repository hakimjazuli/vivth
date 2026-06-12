/**
 * @description
 * - import while imediately call clearing require caches;
 * - `usecases`:
 * >- long running process that need to prevent memory leak from uncleanable `cached import`;
 * >- to simply import fresh everytime;
 * - the imported module can then just be treated like any other variable, to only lived and tracked by variable reference only;
 * - due to how `vivth/node.ClearRequireCache` works, parallel await (like using Promise.all, or not awaited until later) will be done squentially(if targetting the same path);
 * @template { any } T
 * - put the type
 * @param {string} path
 * - either absolute `diskAbsolutepath` or from `Paths.root`;
 * @returns {ReturnType<typeof import('./TryAsync.mjs').TryAsync<T>>}
 * @example
 * // Paths.root/myscript.mjs
 * import { SafeImport } from 'vivth/node';
 *
 * // add type with: import('vivth/neutral').SafeImportReturnType<import('./something.mjs')>
 * const [importedModule, errorSafeImport] = await SafeImport('/absolute/path/from/Paths.root/something.mjs');
 */
export function SafeImport<T extends unknown>(path: string): ReturnType<typeof import("./TryAsync.mjs").TryAsync<T>>;
