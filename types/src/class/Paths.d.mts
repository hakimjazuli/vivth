/**
 * @description
 * - class helpers to define pathReference;
 * - is a singleton;
 */
export class Paths {
    /**
     * @type {Paths}
     */
    static "__#13337@#instance": Paths;
    /**
     * @description
     * - reference for rootPath
     * - `Paths` needed to be instantiated via:
     * >- `Paths` constructor;
     * >- `Setup.paths` constructor;
     * @type {string}
     */
    static get root(): string;
    /**
     * @description
     * - normalize path separator to forward slash `/`;
     * @param {string} path_
     * @returns {string}
     * @example
     * import { Paths } from 'vivth';
     *
     * Paths.normalize('file:\\D:\\myFile.mjs'); // return 'file://D://myFile.mjs'
     */
    static normalize: (path_: string) => string;
    /**
     * @description
     * @param {Object} options
     * @param {string} options.root
     * - browser: location.origin
     * - node/bun compatible: process?.env?.INIT_CWD ?? process?.cwd();
     * - deno: Deno.env.get("INIT_CWD") ?? Deno.cwd(); need for `deno run --allow-env --allow-read your_script.ts`
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
