/**
 * @description
 * - generate unique full path name to temp directory + 'vivth/${uniqueName}.tmp';
 * - filename length already calibrated for each os;
 * @param {string} path
 * @param {string} [fileExtention]
 * @returns {string}
 */
export declare function UniqueFSTempName(path: string, fileExtention?: string): string;
