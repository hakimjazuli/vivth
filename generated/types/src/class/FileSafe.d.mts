import { writeFile, mkdir, copyFile, rename, rm } from 'node:fs/promises';
import { TryAsync } from '../function/TryAsync.mjs';
/**
 * @description
 * - collection of static methods of file access with added safety to mkdir before proceeding;
 */
export declare class FileSafe {
    #private;
    /**
     * @description
     * - method to safely detects whether filePaths exist;
     * - uses `'node:fs/promises'.access` under the hood;
     * - also returning promise of result & error as value;
     * @param {string} filePath
     * @returns {Promise<boolean>}
     * @example
     * import { join } from 'node:path';
     * import { FileSafe } from 'vivth/node';
     * import { Paths } from 'vivth/neutral';
     *
     * const isExist = await FileSafe.exist(
     * 	join(Paths.root, '/some/path.mjs'),
     * );
     */
    static exist: (filePath: string) => Promise<boolean>;
    /**
     * @description
     * - method to create file safely by recursively mkdir the dirname of the outFile;
     * - also returning promise of result & error as value;
     * @param {Parameters<typeof writeFile>[0]} outFile
     * @param {Parameters<typeof writeFile>[1]} content
     * @param {Parameters<typeof writeFile>[2]} [options]
     * @param {boolean} [checkFuzySame]
     * - true: check while normalize consecutive whitespace into singel white space;
     * - false(default): check absolute value;
     * @returns {ReturnType<typeof TryAsync<void>>}
     * @example
     * import { join } from 'node:path';
     * import { FileSafe } from 'vivth/node';
     * import { Paths } from 'vivth/neutral';
     *
     * const [, errorWrite] = await FileSafe.write(
     * 	join(Paths.root, '/some/path.mjs'),
     * 	`console.log("hello-world!!");`,
     * 	{ encoding: 'utf-8' }
     * );
     */
    static write: (outFile: Parameters<typeof writeFile>[0], content: Parameters<typeof writeFile>[1], options?: Parameters<typeof writeFile>[2], checkFuzySame?: boolean) => ReturnType<typeof TryAsync<void>>;
    /**
     * @description
     * - method to copy file/dir safely by recursively mkdir the dirname of the dest;
     * - also returning promise of result & error as value;
     * @param {Parameters<typeof copyFile>[0]} sourceFile
     * @param {Parameters<typeof copyFile>[1]} destinationFile
     * @param {Parameters<typeof copyFile>[2]} [mode]
     * @returns {ReturnType<typeof TryAsync<void>>}
     * @example
     * import { join } from 'node:path';
     * import { FileSafe } from 'vivth/node';
     * import { Paths } from 'vivth/neutral';
     *
     * const [, errorWrite] = await FileSafe.copy(
     * 	join(Paths.root, '/some/path.mjs'),
     * 	join(Paths.root, '/other/path.copy.mjs'),
     * 	{ encoding: 'utf-8' }
     * );
     */
    static copy: (sourceFile: Parameters<typeof copyFile>[0], destinationFile: Parameters<typeof copyFile>[1], mode?: Parameters<typeof copyFile>[2]) => ReturnType<typeof TryAsync<void>>;
    /**
     * @description
     * - method to rename file/dir safely by recursively mkdir the dirname of the dest;
     * - also returning promise of result & error as value;
     * @param {Parameters<typeof rename>[0]} oldPath
     * @param {Parameters<typeof rename>[0]} newPath
     * @returns {ReturnType<typeof TryAsync<void>>}
     * @example
     * import { join } from 'node:path';
     * import { FileSafe} from 'vivth/node';
     * import { Paths } from 'vivth/neutral';
     *
     * const [, errorRename] = await FileSafe.rename(
     * 	join(Paths.root, 'some/path'),
     * 	join(Paths.root, 'other/path'),
     * );
     */
    static rename: (oldPath: Parameters<typeof rename>[0], newPath: Parameters<typeof rename>[0]) => ReturnType<typeof TryAsync<void>>;
    /**
     * @description
     * - function to remove dir and file;
     * - also returning promise of result & error as value;
     * @param {Parameters<typeof rm>[0]} path
     * @param {Parameters<typeof rm>[1]} [rmOptions]
     * @returns {ReturnType<typeof TryAsync<void>>}
     */
    static rm: (path: Parameters<typeof rm>[0], rmOptions?: Parameters<typeof rm>[1]) => ReturnType<typeof TryAsync<void>>;
    /**
     * @description
     * - create directory recursively;
     * - also returning promise of result & error as value;
     * @param {Parameters<typeof mkdir>[0]} outDir
     * - absolute path
     * @returns {ReturnType<typeof TryAsync<string|undefined>>}
     * @example
     * import { join } from 'node:path';
     * import { FileSafe } from 'vivth/node';
     * import { Paths } from 'vivth/neutral';
     *
     * const [str, errorMkDir] = await FileSafe.mkdir(join(Paths.root, '/some/path/example'));
     */
    static mkdir: (outDir: Parameters<typeof mkdir>[0]) => ReturnType<typeof TryAsync<string | undefined>>;
}
