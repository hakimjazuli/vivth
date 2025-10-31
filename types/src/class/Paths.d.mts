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
     * - reference for rootPath
     * - `Paths` needed to be instantiated via:
     * >- `Paths` constructor;
     * >- `Setup.paths` constructor;
     * @type {string|undefined}
     */
    static get root(): string | undefined;
    /**
     * @description
     * - normalize path separator to forward slash `/`;
     * @param {string} path_
     * @returns {string}
     * @example
     * import { Paths } from 'vivth';
     *
     * Paths.normalize('file:\\D:\\myFile.mjs'); //  "file://D://myFile.mjs"
     */
    static normalize: (path_: string) => string;
    /**
     * @description
     * - normalize path separator to forward slash `/`;
     * - then starts with forward slash `/`;
     * @param {string} path_
     * @returns {`/${string}`}
     * @example
     * import { Paths } from 'vivth';
     *
     * Paths.normalizesForRoot('path\\myFile.mjs'); //  "/path/myFile.mjs"
     */
    static normalizesForRoot: (path_: string) => `/${string}`;
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
     * process?.env?.INIT_CWD ?? process?.cwd()
     * ```
     * - deno: need for `deno run --allow-env --allow-read your_script.ts`:
     * ```js
     * Deno.env.get("INIT_CWD") ?? Deno.cwd()
     * ```
     * - other: you need to check your JSRuntime for the rootPath reference;
     * @example
     * import { Paths } from 'vivth';
     *
     * new Paths({
     * 	root: location.origin,
     * })
     */
    constructor({ root }: {
        root: string;
    });
    #private;
}
