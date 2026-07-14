/**
 * @description
 * - regex helper for:
 * >- get named import; OR
 * >- alias of named import;
 * @param {string} content
 * @param {string} moduleName
 * @param {string} packageName
 * @returns {string|undefined}
 * @example
 * import { GetNamedImportAlias } from 'vivth/neutral';
 *
 * const checkNoAlias = `
 * import { something } from 'packageName';
 * `
 * const checkAlias = `
 * import { something as somethingElse } from 'packageName';
 * `
 * GetNamedImportAlias(checkNoAlias, 'something', 'packageName'); // 'something'
 * GetNamedImportAlias(checkAlias, 'something', 'packageName'); // 'somethingElse'
 */
export declare function GetNamedImportAlias(content: string, moduleName: string, packageName: string): string | undefined;
