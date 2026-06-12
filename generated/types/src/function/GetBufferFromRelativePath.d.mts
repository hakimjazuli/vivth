/**
 * @description
 * - get content from relativePath;
 * - only usefull to unbundled environtment;
 * - if your goal is to include on the `.asar`, use [FSasar](#fsasar) instead;
 * @param {string} relativePath
 * - relative path from the caller;
 * @returns {ReturnType<typeof FSasar.file>}
 * @example
 * import { GetContentFromRelativePath } from 'vivth/node';
 *
 * await GetContentFromRelativePath('../doc/parsedFile.mjs', 'utf-8');
 */
export function GetBufferFromRelativePath(relativePath: string): ReturnType<typeof FSasar.file>;
import { FSasar } from '../bundler/FSasar.mjs';
