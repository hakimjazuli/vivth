/**
 * @description
 * - helper function to get file from dir;
 * @param {string} dirAbsolutePath
 * @param {RegExp} pathRule
 * @param {Set<string>} [fileNames]
 * - fill manually to imediately add result to existing `Set` without expecting return;
 * @returns {Promise<Set<string>>}
 * @example
 * import { GetFilesFromDir } from 'vivth/node';
 *
 * const files = await GetFilesFromDir(join(Paths.root, '/dev/'), /[\s\S]\*[noblank]/); // without \[noblank]
 */
export function GetFilesFromDir(dirAbsolutePath: string, pathRule: RegExp, fileNames?: Set<string>): Promise<Set<string>>;
