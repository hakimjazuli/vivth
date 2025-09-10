/**
 * @description
 * - class for auto documenting mjs package/project, using jsdoc;
 * - this autodocumenter uses [chokidar](https://npmjs.com/package/chokidar) under the hood;
 * - this class also is used to generate this `README.md`;
 * - behaviours:
 * >1) add `"at"noautodoc` to opt out from generating documentation on said file;
 * >>- auto export must follows the following rules, and there's no way to override;
 * >2) export all named exported 'const'|'function'|'async function'|'class', alphanumeric name, started with Capital letter, same name with fileName on `options.pahts.file`;
 * >3) declare typedef of existing typedef with alphanumeric name, started with Capital letter, same name with fileName, and have no valid export like on point <sup>1</sup> on `options.pahts.file`;
 * >4) create `README.md` based on, `options.paths.dir` and `README.src.md`;
 * >5) extract `"at"description` jsdoc:
 * >>- on static/prop that have depths, all of children should have `"at"static`/`"at"instance` `nameOfImmediateParent`, same block but before `"at"description` comment line;
 * >>- `"at"description` are treated as plain `markdown`;
 * >>- first `"at"${string}` after `"at"description` until `"at"example` will be treated as `javascript` comment block on the `markdown`;
 * >>- `"at"example` are treated as `javascript` block on the `markdown` file, and should be placed last on the same comment block;
 * >>- you can always look at `vivth/src` files to check how the source, and the `README.md` and `index.mjs` is documentation/generation results;
 */
export class JSautoDOC {
    /**
     * @type {JSautoDOC}
     */
    static #instance: JSautoDOC;
    /**
     * @description
     * @param {Object} [options]
     * @param {Object} [options.paths]
     * @param {string} [options.paths.file]
     * - entry point;
     * @param {string} [options.paths.readMe]
     * - readme target;
     * @param {string} [options.paths.dir]
     * - source directory;
     * @param {string} [options.copyright]
     * @param {string} [options.tableOfContentTitle]
     * @param {import('chokidar').ChokidarOptions} [options.option]
     * - ChokidarOptions;
     * @example
     * import { Console, Setup, JSautoDOC } from 'vivth';
     *
     * const { paths, safeExit } = Setup;
     *
     * new paths({
     * 	root: process?.env?.INIT_CWD ?? process?.cwd(),
     * });
     *
     * new safeExit({
     * 	exitEventNames: ['SIGINT', 'SIGTERM', 'exit'],
     * 	exitCallbackListeners: (eventName) => {
     * 		process.once(eventName, function () {
     * 			safeExit.instance.exiting.correction(true);
     * 			Console.log(`safe exit via "${eventName}"`);
     * 		});
     * 	},
     * });
     *
     * new JSautoDOC({
     * 	paths: { dir: 'src', file: 'index.mjs', readMe: 'README.md' },
     * 	copyright: 'this library is made and distributed under MIT license;',
     * 	tableOfContentTitle: 'list of exported API and typehelpers',
     * });
     *
     */
    constructor({ paths, tableOfContentTitle, copyright, option, }?: {
        paths?: {
            file?: string;
            readMe?: string;
            dir?: string;
        };
        copyright?: string;
        tableOfContentTitle?: string;
        option?: import("chokidar").ChokidarOptions;
    });
    #private;
}
export type Stats = import("fs").Stats;
