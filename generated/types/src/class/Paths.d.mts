/**
 * @description
 * - class helpers to define pathReference;
 * - is a singleton;
 * - most of functionality need to access `Paths.root`, if you get warning, you can instantiate `Paths` before running anything;
 */
export class Paths {
    /**
     * @type {Paths|undefined}
     */
    static #instance: Paths | undefined;
    /**
     * @description
     * - MIGHT THROW AN ERROR;
     * >- most `vivth` modules uses this value, so you need to instantiate Paths by all means before using them;
     * - reference for rootPath
     * - `Paths` needed to be instantiated via:
     * >- `Paths` constructor;
     * >- `Setup.paths` constructor;
     * @type {string}
     */
    static get root(): string;
    /**
     * @description
     * - replace path separator to forward slash `/`;
     * - remove repeating `./`;
     * @param {string} path
     * @returns {string}
     * @example
     * import { Paths } from 'vivth/neutral';
     *
     * Paths.normalize('file:\\D:\\myFile.mjs'); //  "file://D://myFile.mjs"
     */
    static normalize: (path: string) => string;
    /**
     * @description
     * - replace path separator to `sep`;
     * @param {string} path
     * @returns {string}
     * @example
     * import { Paths } from 'vivth/neutral';
     *
     * Paths.nativeSep('path//myFile.mjs'); //  "path\myFile.mjs" OR "path/myFile.mjs" depending on sep value;
     */
    static nativeSep: (path: string) => string;
    /**
     * @description
     * - normalized then starts with forward slash `/`;
     * @param {string} path
     * @returns {`/${string}`}
     * @example
     * import { Paths } from 'vivth/neutral';
     *
     * Paths.normalizesForRoot('path\\myFile.mjs'); //  "/path/myFile.mjs"
     */
    static normalizeForRoot: (path: string) => `/${string}`;
    /**
     * @description
     * - convert path to diskAbsolute and normalized to be using forward slash;
     * - usefull for arguments for `methods` OR `functions` that needs to be absolute disk path, regardles if path is relative to project root, or already absolute path;
     * @param {string} path
     * @returns {string}
     * @example
     * import { Paths } from 'vivth/neutral';
     *
     * Paths.normalizesForRoot('\\path\\myFile.mjs'); //  "D://something/path/myFile.mjs"
     */
    static diskAbsolute: (path: string) => string;
    /**
     * @description
     * @param {Object} options
     * @param {string} options.root
     * - browser:
     * ```js
     * location.origin
     * ```
     * - node/bun compatible:
     * ```js
     * import process from 'node:process';
     * process.env.INIT_CWD ?? process.cwd()
     * ```
     * - other: you need to check your JSRuntime for the rootPath reference;
     * @example
     * import { Paths } from 'vivth/neutral';
     *
     * new Paths({
     * 	// root: location.origin,
     * 	// root: process.env.INIT_CWD ?? process.cwd(),
     * })
     */
    constructor({ root }: {
        root: string;
    });
    #private;
}
