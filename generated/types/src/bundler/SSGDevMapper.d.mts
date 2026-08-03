import type { VivthCleanup } from '../typehints/VivthCleanup.mjs';
/**
 * @import {Stats} from 'node:fs'
 * @import {VivthCleanup} from '../typehints/VivthCleanup.mjs'
 */
/**
 * @description
 * - class helper to map files into SSG software that:
 * >- have its own dev server;
 * >- have `Open file with` to be edited via external application;
 * - `js` extensions supports:
 * >- `.mjs`;
 * >- `.cjs`;
 * >- `.js`;
 * - `.html` parse `script` elements to be:
 * >- `minifed` if has `[minify="true"]`;
 * >- use `esm` if has `[type="module"]`;
 * - `.scss`|`.sass` write compiled `.css`;
 * - every other extension will be copied to `targetpath` as is(without `targetpath` as string);
 * - look for [FileSelfMapper](#fileselfmapper) on how to add `targetpath`;
 * @implements {VivthCleanup}
 */
export declare class SSGDevMapper implements VivthCleanup {
    #private;
    /**
     * @description
     * @param {Object} options
     * @param {string} options.sourcePath
     * @param {(normalizedAbsolutePath:string)=>boolean} [options.pathFilter]
     * - filterOut paths;
     * @param {import('esbuild').WatchOptions} [options.esbuildWatchOptions]
     * @param {Omit<Parameters<typeof import('esbuild')["context"]>[0], "write"|"minify"|"format"|"platform"|"mainFields"|"outfile"|"bundle"|"entryPoints">} [options.esbuild]
     * - `logLimit`: default = `3`;
     * - `outFile`: auto determined by comment line on top level of each files;
     * - `minify`: determined by file `relativePath`(to dirname of `watchpath`) name included `.min.`;
     * - `format`: determined by file `relativePath`(to dirname of `watchpath`) name included `.esm.` or `.iife.`;
     * - `mainFields`: `module,main`;
     * - `bundle`: automatically added by `vivth.SSGDevMapper`;
     * - `write`: automatically added by `vivth.SSGDevMapper`;
     * @param {(path:{mapTo:string, src:string}, content:string)=>(string|false)} [options.postProcessDirectCopy]
     * - works for:
     * >- `.js`;
     * >- anything that are not `sass` and `module js/ts`;
     * - return `false` to exclude `target` from mapping;
     * @param {number} [options.delay]
     * - `EsWatcher` delay argument;
     * >- on `SSG` software, there are possiblity that their sync mechanism have debounce/throttle,
     * >- therefore timeout might necessary;
     * - default `100`;
     * @example
     * import { Paths } from 'vivth/neutral';
     * import { SafeExit, SSGDevMapper } from 'vivth/node';
     *
     * new Paths({
     * 	root: process.env.INIT_CWD ?? process.cwd(),
     * });
     *
     * new SafeExit('SIGINT', 'SIGTERM');
     *
     * new SSGDevMapper({
     * 	sourcePath: '/test/ssgDevMapper/dev/',
     * 	timeout: 372,
     * });
     */
    constructor({ pathFilter, sourcePath, esbuild, esbuildWatchOptions, postProcessDirectCopy, delay, }: {
        sourcePath: string;
        pathFilter?: (normalizedAbsolutePath: string) => boolean;
        esbuildWatchOptions?: import('esbuild').WatchOptions;
        esbuild?: Omit<Parameters<typeof import('esbuild')["context"]>[0], "write" | "minify" | "format" | "platform" | "mainFields" | "outfile" | "bundle" | "entryPoints">;
        postProcessDirectCopy?: (path: {
            mapTo: string;
            src: string;
        }, content: string) => (string | false);
        delay?: number;
    });
    vivthCleanup: () => Promise<void>;
}
