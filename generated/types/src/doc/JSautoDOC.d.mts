export const multiExportEntryPointsPath: "./generated/vivth/exports/";
/**
 * @typedef {import('../typehints/VivthCleanup.mjs').VivthCleanup} VivthCleanup
 */
/**
 * @description
 * - class for auto documenting mjs package/project, using jsdoc;
 * - this autodocumenter uses [chokidar](https://npmjs.com/package/chokidar) under the hood;
 * - this class also is used to generate this `README.md`;
 * - behaviours:
 * >- auto export must follows the following rules;
 * >1) add `"at"noautodoc` on self closing jsdoc comment to opt out from generating documentation on said file;
 * >2) will (generate) export all named exported 'const'|'function'|'async function'|'class', alphanumeric name, started with Capital letter, same name with fileName on `options.paths.file`;
 * >3) will (generate) declare typedef of existing typedef with alphanumeric name, started with Capital letter, same name with fileName, and have no valid export like on point <sup>1</sup> on `options.paths.file`;
 * >4) will (generate) create `README.md` based on, `options.paths.dir` and `README.src.md`;
 * >5) extract `"at"description` jsdoc:
 * >>- on static/prop that have depths, all of children should have `"at"static`/`"at"instance` `nameOfImmediateParent`, same block but before `"at"description` comment line;
 * >>- `"at"description` are treated as plain `markdown`;
 * >>- first `"at"${string}` after `"at"description` until `"at"example` will be treated as `javascript` comment block on the `markdown`;
 * >>- `"at"example` are treated as `javascript` block on the `markdown` file, and should be placed last on the same comment block;
 * >>- you can always look at `vivth/src` files to check how the source, and the `README.md` and `index.mjs` documentation/generation results;
 * >6) this types of arrow functions will be converted to regullar function, for concise type emition, includes:
 * >>- validly exported function;
 * >>- static/instance method with generic template;
 * >7) transpile `.ts` and `.mts` to `.mjs` with same name and directory;
 * >>- use `"at"preserve` to preserve tsdoc comment section;
 * >8) integrated with assembly script to wasm compiler on the doc;
 * >>- see [AssemblyScript](#assemblyscript);
 * >9) modify following root json files:
 * >>- `package.json`: assign `exports`, `main`, `module`;
 * >>- `tsconfig.json`: assign `includes`, anything passed on `options.jstsconfigs`;
 * >>- `jsconfig.json`: assign `includes`, anything passed on `options.jstsconfigs`;
 * >10) generates files to `/generated/vivth/exports/`:
 * >>- `./browser.mjs`: able to be called on `browser` platform;
 * >>- `./node.mjs`:  able to be called on `node` platform;
 * >>- `./neutral.mjs`: able to be called on `node` and `browser` platform;
 * >>- `./unsupported.mjs`: most likely will throw error when called, it is more of a logged error to be managed;
 * >>- `./all.mjs`: collections of all platform;
 * >11) doesn't support accessor;
 * >>- due to how TLS way accessor type not casting its getter and setter working around accessor requires ignoring this specific error, and it might become ugly real quick;
 * >>- we recomend to stick with getter and setter;
 * - for runtime example see file `/dev/auto-doc.mjs` on source code;
 * @implements {VivthCleanup}
 */
export class JSautoDOC implements VivthCleanup {
    /**
     * @typedef {'readme' |
     *  'handledJS'
     * } returnTypeStringType
     */
    /**
     * @typedef {FSDirArchWatcher<{
     *     path: string;
     *     parsed: undefined;
     *     ext: `.${string}`;
     *     type: returnTypeStringType;
     *     readme?:string;
     * } | {
     *     path: string;
     *     parsed: parsedFileForDOC;
     *     ext: string;
     *     type: returnTypeStringType;
     *     readme?:string;
     * }>} FSDirArchWatcher__
     */
    /**
     * @type {JSautoDOC|undefined}
     */
    static #instance: JSautoDOC | undefined;
    /**
     * @description
     * @param {Object} options
     * @param {string} options.src
     * - source directory;
     * @param {string} [options.copyright]
     * @param {string} [options.tableOfContentTitle]
     * @param {number} [options.maxDebounceForGeneratingDocAndExport]
     * - default `1_000`;
     * @param {import('chokidar').ChokidarOptions} [options.chokidarOptions]
     * - ChokidarOptions;
     * @param {import('../typehints/AutoDocASOptions.mjs').AutoDocASOptions} [options.assemblyScriptOptions]
     * - abstracted details to handle `.as.ts` file;
     * @param {(arg0:{map:Map<string, {
     *     path: string;
     *     parsed: undefined;
     *     ext: `.${string}`;
     *     type: returnTypeStringType;
     *     readme?:string;
     * } | {
     *     path: string;
     *     parsed: parsedFileForDOC;
     *     ext: string;
     *     type: returnTypeStringType;
     *     readme?:string;
     * }>})=>Promise<void>} [options.onLastGeneratedCallback]
     * - callback to be run on finishing generating document AND exports;
     * - only handle that marked as `isLastCalled`;
     * @param { import('typescript').CompilerOptions |
     * 	import('typescript').ParsedCommandLine
     * } [options.jstsconfigs]
     * - type of `ts/jsconfig` to be assigned to existing respective `.json` file;
     * @example
     * import { JSautoDOC } from 'vivth/node';
     *
     * new JSautoDOC({
     * 	src: '/src',
     * 	copyright: 'this library is made and distributed under MIT license;',
     * 	tableOfContentTitle: 'list of exported API and typehelpers',
     * 	// assemblyScriptOptions: {},
     * 	// onLastGeneratedCallback: async (options) => {
     * 	// 	Console.log(options);
     * 	// },
     * });
     */
    constructor({ src, onLastGeneratedCallback, tableOfContentTitle, copyright, maxDebounceForGeneratingDocAndExport, assemblyScriptOptions, chokidarOptions, jstsconfigs, }: {
        src: string;
        copyright?: string | undefined;
        tableOfContentTitle?: string | undefined;
        maxDebounceForGeneratingDocAndExport?: number | undefined;
        chokidarOptions?: Partial<{
            persistent: boolean;
            ignoreInitial: boolean;
            followSymlinks: boolean;
            cwd?: string;
            usePolling: boolean;
            interval: number;
            binaryInterval: number;
            alwaysStat?: boolean;
            depth?: number;
            ignorePermissionErrors: boolean;
            atomic: boolean | number;
        } & {
            ignored: import("chokidar").Matcher | import("chokidar").Matcher[];
            awaitWriteFinish: boolean | Partial<import("chokidar").AWF>;
        }> | undefined;
        assemblyScriptOptions?: import("../typehints/AutoDocASOptions.mjs").AutoDocASOptions | undefined;
        onLastGeneratedCallback?: ((arg0: {
            map: Map<string, {
                path: string;
                parsed: undefined;
                ext: `.${string}`;
                type: "readme" | "handledJS";
                readme?: string;
            } | {
                path: string;
                parsed: parsedFileForDOC;
                ext: string;
                type: "readme" | "handledJS";
                readme?: string;
            }>;
        }) => Promise<void>) | undefined;
        jstsconfigs?: import("typescript").CompilerOptions | import("typescript").ParsedCommandLine | undefined;
    });
    vivthCleanup: () => Promise<void>;
    /**
     * @type { FSDirArchWatcher<any>|undefined }
     */
    watcher: FSDirArchWatcher<any> | undefined;
    /**
     * @param {string} path
     * @returns {Promise<{isBeingHandled:boolean, content?: string}>}
     * - is being handled;
     */
    checkReadmeFile: (path: string) => Promise<{
        isBeingHandled: boolean;
        content?: string;
    }>;
    #private;
}
export type VivthCleanup = import("../typehints/VivthCleanup.mjs").VivthCleanup;
import { FSDirArchWatcher } from '../class/FSDirArchWatcher.mjs';
import { parsedFileForDOC } from './parsedFileForDOC.mjs';
