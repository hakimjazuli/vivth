import { EsWatcher } from '../class/EsWatcher.mjs';
import { TsToMjs } from '../function/TsToMjs.mjs';
export type VivthCleanup = import('../typehints/VivthCleanup.mjs').VivthCleanup;
import type { EventName } from 'chokidar/handler.js';
import type { BuildOptions } from 'esbuild';
/**
 * @typedef {import('../typehints/VivthCleanup.mjs').VivthCleanup} VivthCleanup
 */
/**
 * @import {Stats} from 'node:fs'
 * @import {EventName} from 'chokidar/handler.js'
 * @import {Plugin,BuildOptions} from 'esbuild'
 */
/**
 * @description
 * - class helper for one to one Mapping JS files;
 * - only bundles `.mts` AND `.mjs` in the `path.watch` directory, extension restriction to module as to enforce:
 * >- `esm` style input;
 * >- to not confuse IDE and esbuild resolver of extensionless static import;
 * @template {BuildOptions} OPT
 * @implements {VivthCleanup}
 */
export declare class JSDirMapper<OPT extends BuildOptions> implements VivthCleanup {
    #private;
    /**
     * @description
     * @param {Object} path
     * - `relative`(to `Paths.root`) OR `absolute`, both are accepted;
     * - handles:
     * >- `.mts`,`.mjs`: bundled;
     * >- `.css`: minified;
     * >-`.scss`, `sass`: two step bundling;
     * >>- bundle to `.s.css` at source path;
     * >>- write to `.s.css` on target path;
     * >- `.as.ts` and it's companion `js` will be dealt accordingly based on `options.asTsToMjsHandler`;
     * >>- `.ts` and `.js` that are not `.wasm` related are ignored;
     * >- everything else will be copied as is;
     * @param {string} path.watch
     * - watch this path for changes;
     * @param {string} path.mapTo
     * - bundles to this path
     * @param {(
     * 		arg0:
     * 			{
     * 				source:string;
     * 				target:string;
     * 				eventName:EventName;
     * 			}
     * 	)=>Promise<{
     * 		shouldProcessDefault:
     * 			boolean|{selfCleanup:()=>Promise<void>};
     * 	}>
     * } [path.filter]
     * - handler trap before sending it to
     * @param {Object} options
     * @param {Object} options.esbuild
     * @param {Omit<ConstructorParameters<typeof EsWatcher<OPT>>[0],
     * 	"entryPoints"|
     * 	"outFile"|
     * 	"write"|
     * 	"format"|
     * 	"bundle"|
     * 	"logLevel"|
     * 	"mainFields"
     * >} options.esbuild.buildOptions
     * - `logLimit`: default = `3`;
     * - `entryPoints`: auto filled with `path.watch` + filepath;
     * - `outFile`: auto filled with `path.mapTo` + filepath(suffixed with `.mjs`);
     * - `write`: auto filled by `vivth.JSDirMapper`;
     * - `mainFields`: auto filled by `vivth.JSDirMapper`, ['module', 'main'];
     * - `format`: auto filled by `vivth.JSDirMapper`, always `esm`;
     * - `bundle`: auto filled by `vivth.JSDirMapper`, always `true`;
     * - `logLevel`: auto filled by `vivth.JSDirMapper`;
     * @param {ConstructorParameters<typeof EsWatcher<OPT>>[1]} [options.esbuild.watchOption]
     * @param {Parameters<typeof TsToMjs>[1]} [options.asTsToMjsHandler]
     * - argument[1] used for `.as.ts` extention(assemblyscript to `.wasm` + `.mjs` loader):
     * >- handled via `vivth.TsToMjs`;
     * >- preferably to be isolated on a single folder;
     * - when falsy -> ignore `.as.ts`;
     * @example
     * import process from 'node:process';
     *
     * import { SafeExit, Paths, JSDirMapper } from 'vivth/node';
     *
     * new Paths({
     * 	root: process.env.INIT_CWD ?? process.cwd(),
     * });
     *
     * new SafeExit('SIGINT', 'SIGTERM');
     *
     * new JSDirMapper(
     * 	{
     * 		mapTo: '/test/jsdirmapped/',
     * 		watch: '/test/jsdirmapper/',
     * 	},
     * 	{
     * 		esbuild: { buildOptions: { platform: 'browser' } },
     * 		asTsToMjsHandler: { assemblyScriptOptions: {} },
     * 	},
     * );
     *
     */
    constructor({ mapTo, watch, filter }: {
        watch: string;
        mapTo: string;
        filter?: (arg0: {
            source: string;
            target: string;
            eventName: EventName;
        }) => Promise<{
            shouldProcessDefault: boolean | {
                selfCleanup: () => Promise<void>;
            };
        }>;
    }, { esbuild, asTsToMjsHandler }: {
        esbuild: {
            buildOptions: Omit<ConstructorParameters<typeof EsWatcher<OPT>>[0], "entryPoints" | "outFile" | "write" | "format" | "bundle" | "logLevel" | "mainFields">;
            watchOption?: ConstructorParameters<typeof EsWatcher<OPT>>[1];
        };
        asTsToMjsHandler?: Parameters<typeof TsToMjs>[1];
    });
    vivthCleanup: () => Promise<void>;
}
