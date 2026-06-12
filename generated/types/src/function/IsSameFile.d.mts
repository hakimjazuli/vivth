/**
 * @description
 * - check if two path is the same file;
 * @param {string} pathA
 * @param {string} pathB
 * @returns {boolean}
 * @example
 * // `D://myFile.mjs` cwd at `D://`
 * import { IsSameFile } from "vivth/node";
 *
 * IsSameFile('D:\\mFile.mjs', 'D://mFile.mjs') // true;
 * IsSameFile('//mFile.mjs', 'D://mFile.mjs') // true;
 * // both path are auto resolved to Paths.root;
 * IsSameFile('D:\\mFile.mjs', 'D:\\notmfile.mjs') // false;
 */
export function IsSameFile(pathA: string, pathB: string): boolean;
