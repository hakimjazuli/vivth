/**
 * @description
 * - class helper for one to one Mapping JS files;
 * - only bundles `.mts` AND `.mjs` in the `path.watch` directory, extension restriction to module as to enforce:
 * >- `esm` style input;
 * >- to not confuse IDE and esbuild resolver of extensionless static import;
 * @template {import('esbuild').BuildOptions} O
 */
export class JSDirMapper<O extends import("esbuild").BuildOptions> {
    static "__#private@#consoleID": string;
    /**
     * @param {string} path
     * @returns {string}
     */
    static "__#private@#correctEndpointExt": (path: string) => string;
    /**
     * @description
     * @param {Object} path
     * - relative from project root;
     * - only bundles `.mts` AND `.mjs`:
     * >- `.wasm`: will be copied as is;
     * >- `.as.ts` will be dealt accordingly based on `options.asTsToMjsHandler`;
     * @param {string} path.watch
     * - watch this path for changes;
     * @param {string} path.mapTo
     * - bundles to this path
     * @param {Object} options
     * @param {Object} options.esbuild
     * @param {Omit<ConstructorParameters<typeof EsWatcher<O>>[0],
     * 	"entryPoints"|
     * 	"outFile"|
     * 	"write"|
     * 	"loader"|
     * 	"format"|
     * 	"bundle"|
     * 	"logLevel"|
     * 	"mainFields"
     * >} options.esbuild.buildOptions
     * - `logLimit`: default = `3`;
     * - `entryPoints`: auto filled with `path.watch` + filepath;
     * - `outFile`: auto filled with `path.mapTo` + filepath(suffixed with `.mjs`);
     * - `write`: auto filled by `vivth.JSDirMapper`;
     * - `loader`: auto filled by `vivth.JSDirMapper` depended on file extname;
     * - `mainFields`: auto filled by `vivth.JSDirMapper`, ['module', 'main'];
     * - `format`: auto filled by `vivth.JSDirMapper`, always `esm`;
     * - `bundle`: auto filled by `vivth.JSDirMapper`, always `true`;
     * - `logLevel`: auto filled by `vivth.JSDirMapper`;
     * @param {ConstructorParameters<typeof EsWatcher<O>>[1]} [options.esbuild.watchOption]
     * @param {Parameters<typeof TsToMjs>[1]} [options.asTsToMjsHandler]
     * - argument[1] used for `.as.ts` extention(assemblyscript to `.wasm` + `.mjs` loader):
     * >- handled via `vivth.TsToMjs`;
     * >- preferably to be isolated on a single folder;
     * @example
     * import process from 'node:process';
     *
     * import { SafeExit, Paths, JSDirMapper } from '../index.mjs';
     *
     * new Paths({
     * 	root: process.env.INIT_CWD ?? process.cwd(),
     * });
     *
     * new SafeExit({
     * 	eventNames: ['SIGINT', 'SIGTERM'],
     * 	terminator: () => process.exit(0),
     * });
     *
     * new JSDirMapper(
     * 	{
     * 		mapTo: '/test/jsdirmapped/',
     * 		watch: '/test/jsdirmapper/',
     * 	},
     * 	{
     * 		esbuild: { buildOptions: { platform: 'browser' } },
     * 		asTsToMjsHandler: { assemblyScriptOptions: {} },
     * 		// `assemblyScriptOptions` must be truthy to handle `.as.ts`
     * 	},
     * );
     *
     */
    constructor({ mapTo, watch }: {
        watch: string;
        mapTo: string;
    }, { esbuild, asTsToMjsHandler }: {
        esbuild: {
            buildOptions: Omit<ConstructorParameters<typeof EsWatcher<O>>[0], "entryPoints" | "outFile" | "write" | "loader" | "format" | "bundle" | "logLevel" | "mainFields">;
            watchOption?: ConstructorParameters<typeof EsWatcher<O>>[1];
        };
        asTsToMjsHandler?: Parameters<typeof TsToMjs>[1];
    });
    #private;
}
import { EsWatcher } from '../class/EsWatcher.mjs';
import { TsToMjs } from '../function/TsToMjs.mjs';
