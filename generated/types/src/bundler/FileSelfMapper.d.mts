/**
 * @description
 * - this Class require `esbuild` to be installed, example using npm:
 * ```shell
 * npm install esbuild
 * ```
 * - each file can define it's own `targetPaths` inline by adding comment then fullpath on the begining of the file:
 * ```js
 * // D://my/path/something.mjs
 * // D://my/path/something-else.mjs
 *
 * console.log('hello');
 * ```
 * ```scss
 * /*[blank] D://my/path/something.css *[blank]/
 *
 * $somecolor: black;
 *
 * body {
 * 	background-color: $somecolor;
 * }
 * ```
 * -files extention:
 * >- `js`/`ts` files will compiled with esbuild cli, using `option.esbuild` as argument;
 * >- `sass`/`scss` it will be compiled to css first;
 * >- other than those files, they will just copied to `targetPaths`;
 */
export class FileSelfMapper {
    /**
     * @type { string }
     */
    static "__#private@#consoleID": string;
    /**
     * @type { Map<string, ()=>Promise<void>> }
     */
    static "__#private@#releaseCallbackPerPath": Map<string, () => Promise<void>>;
    /**
     * @param { string } path
     * @returns { boolean }
     */
    static "__#private@#hasReleaseCallback": (path: string) => boolean;
    /**
     * @param { string } path
     * @param { ()=>Promise<void> } callback
     * @param { boolean } registerToSafeExit
     * @returns { void }
     */
    static "__#private@#registerReleaseCallback": (path: string, callback: () => Promise<void>, registerToSafeExit?: boolean) => void;
    /**
     * @param { string } path
     * @returns { Promise<void> }
     */
    static "__#private@#runReleaseCallback": (path: string) => Promise<void>;
    /**
     * @type { Set<string> }
     */
    static "__#private@#tempPaths": Set<string>;
    /**
     * @type { ()=>Promise<void> }
     */
    static "__#private@#clearUpTempPath": () => Promise<void>;
    /**
     * @param { string } path
     * @returns { Promise<void> }
     */
    static "__#private@#writeCommon": (path: string) => Promise<void>;
    /**
     * @param { string } path
     * @returns { Promise<void> }
     */
    static "__#private@#bundleSCSS": (path: string) => Promise<void>;
    /**
     * @param {string[]} esbuildExternal
     * @returns {Set<string>}
     */
    static "__#private@#createBrowserExternals": (esbuildExternal: string[]) => Set<string>;
    /**
     * @param {string} tempPath
     * @param {string} path
     * @param {QChannel<string>} q
     * @returns {Promise<void>}
     */
    static "__#private@#onJSDependencyChanges": (tempPath: string, path: string, q: QChannel<string>) => Promise<void>;
    /**
     * @param { string } path
     * @returns { Promise<{
     * 	targetPaths: Set<string>,
     * 	content: string,
     * }> }
     */
    static "__#private@#getTargetPath": (path: string) => Promise<{
        targetPaths: Set<string>;
        content: string;
    }>;
    /**
     * @param {string} watcherFullPath
     * @param {string} path
     * @returns { string }
     */
    static "__#private@#getRelative": (watcherFullPath: string, path: string) => string;
    /**
     * @description
     * @param {string} relativeWatchPathToRoot
     * @param {Object} options
     * @param {Omit<Parameters<import('esbuild')["context"]>[0], "write"|"minify"|"format"|"mainFields"|"outfile"|"bundle">} [options.esbuild]
     * - `logLimit`: default = `3`;
     * - `outFile`: auto determined by comment line on top level of each files;
     * - `minify`: determined by file `relativePath`(to dirname of `watchpath`) name included `.min.`;
     * - `format`: determined by file `relativePath`(to dirname of `watchpath`) name included `.esm.` or `.iife.`;
     * - `mainFields`: determined by file externtion if `.cjs` -> `main,module` else `module,main`;
     * - `bundle`: automatically added by `vivth.FileSelfMapper`;
     * - `write`: automatically added by `vivth.FileSelfMapper`;
     * @param {boolean} [options.deleteTempFilesAfterExit]
     * @example
     * import { FileSelfMapper } from 'vivth';
     *
     * new FileSelfMapper('../ssg-assets/', {
     * 	esbuild: {},
     * 	// deleteTempFilesAfterExit: true,
     * });
     */
    constructor(relativeWatchPathToRoot: string, options: {
        esbuild?: Omit<import("esbuild").SameShape<import("esbuild").BuildOptions, import("esbuild").BuildOptions>, "bundle" | "outfile" | "mainFields" | "write" | "format" | "minify"> | undefined;
        deleteTempFilesAfterExit?: boolean | undefined;
    });
    #private;
}
import { QChannel } from '../class/QChannel.mjs';
