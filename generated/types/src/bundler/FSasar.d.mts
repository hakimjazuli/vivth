/**
 * @description
 * - class helper to bundle assets files as `.asar`;
 * >- as `type: "buffer"`;
 * >- uses `[at]electron/asar` under the hood;
 * - use only if you are planning to use [CompileJS](#compilejs);
 * >- the class static methods don't obfuscate target file;
 * >- don't embed any sensitive content using this methods of `CompileJS`;
 */
export class FSasar {
    /**
     * @typedef {import('./adds/PathFSDir.mjs').PathFSDir} PathFSDir
     */
    /**
     * @description
     * - get file buffer from relative path;
     * @param {PathFSFile} pathFSFPathFSFileInstance
     * @returns {Promise<Buffer<ArrayBufferLike>>}
     * @example
     * import { FSasar, PathFSFile } from "vivth";
     *
     * const fileBuffer = await FSasar.file(PathFSFile.vivthFile('../function/myModule.mjs'));
     */
    static file(pathFSFPathFSFileInstance: PathFSFile): Promise<Buffer<ArrayBufferLike>>;
    /**
     * @description
     * - helper function for asar dir;
     * @param {PathFSDir} pathFSDirInstance
     * @returns {{
     * forEachFiles:(loopCallback:(pathDetail:{inputRelative:string, asar:string})=>void)=>void,
     * getFile:(relativeFromDir:string)=> ReturnType<typeof FSasar["file"]>
     * }}
     * - forEachFiles are looped async without awaiting any iterations;
     * @example
     * import { FSasar, PathFSDir } from "vivth";
     *
     * const { forEachFiles, getFile } = FSasar.dir(PathFSDir.vivthDir('../function/', /[\s\S]\*[noblank]/)); // without `[noblank]`;
     * forEachFiles(async ({ inputRelative, asar }) => {
     * 	// handle `inputRelative` with getFile; OR
     * 	// handle `asar` with FSasar.file
     * });
     */
    static dir: (pathFSDirInstance: import("./adds/PathFSDir.mjs").PathFSDir) => {
        forEachFiles: (loopCallback: (pathDetail: {
            inputRelative: string;
            asar: string;
        }) => void) => void;
        getFile: (relativeFromDir: string) => ReturnType<(typeof FSasar)["file"]>;
    };
}
import { PathFSFile } from './adds/PathFSFile.mjs';
