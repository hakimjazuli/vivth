/**
 * @typedef {import('../typehints/VivthCleanup.mjs').VivthCleanup} VivthCleanup
 */
/**
 * @description
 * - each file can define it's own `targetPaths` inline by adding comment then fullpath on the begining of the file:
 * >- `mjs`;
 * ```js
 * // D://my/path/something.mjs
 * // D://my/path/something-else.mjs
 *
 * console.log('hello');
 * ```
 * >- `scss`;
 * ```scss
 * /*[blank] D://my/path/something.css *[blank]/
 *
 * $somecolor: black;
 *
 * body {
 * 	background-color: $somecolor;
 * }
 * ```
 * >- `.ignore`;
 * ```.ignore
 * # D:/my/project/root/.gitignore
 * # D:/my/project/root/.npmignore
 *
 * /dev/
 * ```
 * - files extention:
 * >- `js`/`ts` files will be compiled with `vivth/node.EsWathcer`, using `option.esbuild` as argument;
 * >- `sass`/`scss` it will be compiled to `css` first;
 * >- `html` will be checked for `script`;
 * >>- has `[type="module]"`: will be processed as `esm`;
 * >>- has `[minify="true"]`: will be minified;
 * >- other than those files, they will be just copied to `targetPaths`;
 * - for runtime example see file `/dev/auto/` on source code;
 * @implements {VivthCleanup}
 */
export class FileSelfMapper implements VivthCleanup {
    /**
     * @param { string } path
     * @param { (path:{mapTo:string, src:string}, content:string)=>(string|false) } [postprosess]
     * @returns { Promise<void> }
     */
    static #writeHTML: (path: string, postprosess?: (path: {
        mapTo: string;
        src: string;
    }, content: string) => (string | false)) => Promise<void>;
    /**
     * @param { string } path
     * @param { (path:{mapTo:string, src:string}, content:string)=>(string|false) } [postprosess]
     * @returns { Promise<void> }
     */
    static #writeCommon: (path: string, postprosess?: (path: {
        mapTo: string;
        src: string;
    }, content: string) => (string | false)) => Promise<void>;
    /**
     * @param { string } path
     * @returns { Promise<void> }
     */
    static #bundleSCSS: (path: string) => Promise<void>;
    /**
     * @param {string[]} esbuildExternal
     * @returns {Set<string>}
     */
    static #createBrowserExternals: (esbuildExternal: string[]) => Set<string>;
    /**
     * @param {()=>boolean} isLastOnQ
     * @param {string} path
     * @param {string} tempPath
     * @param {string} target
     * @returns {Promise<void>}
     */
    static #onJSDependencyChanges1: (isLastOnQ: () => boolean, path: string, tempPath: string, target: string) => Promise<void>;
    /**
     * @param {()=>boolean} isLastOnQ
     * @param {string} path
     * @param {string} tempPath
     * @param {QChannel<string>} q
     * @returns {Promise<void>}
     */
    static #onJSDependencyChanges0: (isLastOnQ: () => boolean, path: string, tempPath: string, q: QChannel<string>) => Promise<void>;
    /**
     * @param {string} tempPath
     * @param {string} path
     * @param {QChannel<string>} q
     * @returns {Promise<void>}
     */
    static #onJSDependencyChanges: (tempPath: string, path: string, q: QChannel<string>) => Promise<void>;
    /**
     * @param { string } path
     * @returns { Promise<{
     * 	targetPaths: Set<string>,
     * 	content: string,
     * }> }
     */
    static #getTargetPath: (path: string) => Promise<{
        targetPaths: Set<string>;
        content: string;
    }>;
    /**
     * @param {string} watcherFullPath
     * @param {string} path
     * @returns { string }
     */
    static #getRelative: (watcherFullPath: string, path: string) => string;
    /**
     * @description
     * @param {string} watchPath
     * - `relative`(to `Paths.root`) OR `absolute`, both are accepted;
     * @param {Object} options
     * @param {Omit<Parameters<import('esbuild')["context"]>[0], "write"|"minify"|"format"|"mainFields"|"outfile"|"bundle">} [options.esbuild]
     * - `logLimit`: default = `3`;
     * - `outFile`: auto determined by comment line on top level of each files;
     * - `minify`: determined by file `relativePath`(to dirname of `watchpath`) name included `.min.`;
     * - `format`: determined by file `relativePath`(to dirname of `watchpath`) name included `.esm.` or `.iife.`;
     * - `mainFields`: `module,main`;
     * - `bundle`: automatically added by `vivth.FileSelfMapper`;
     * - `write`: automatically added by `vivth.FileSelfMapper`;
     * @param {boolean} [options.deleteTempFilesAfterExit]
     * @param {(path:{mapTo:string, src:string}, content:string)=>(string|false)} [options.postProcessDirectCopy]
     * - works for:
     * >- `.js`;
     * >- anything that are not `sass` and `module js/ts`;
     * - return `false` to exclude `target` from mapping;
     * @example
     * import { FileSelfMapper } from 'vivth/node';
     *
     * new FileSelfMapper('../ssg-assets/', {
     * 	esbuild: {},
     * 	// deleteTempFilesAfterExit: true,
     * });
     */
    constructor(watchPath: string, options: {
        esbuild?: Omit<import("esbuild").SameShape<import("esbuild").BuildOptions, import("esbuild").BuildOptions>, "bundle" | "outfile" | "mainFields" | "write" | "format" | "minify"> | undefined;
        deleteTempFilesAfterExit?: boolean | undefined;
        postProcessDirectCopy?: ((path: {
            mapTo: string;
            src: string;
        }, content: string) => (string | false)) | undefined;
    });
    vivthCleanup: () => Promise<void>;
    #private;
}
export type VivthCleanup = import("../typehints/VivthCleanup.mjs").VivthCleanup;
import { QChannel } from '../class/QChannel.mjs';
