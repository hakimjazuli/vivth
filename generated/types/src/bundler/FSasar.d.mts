import { PathFSFile } from './adds/PathFSFile.mjs';
export type PathFSDir = import('./adds/PathFSDir.mjs').PathFSDir;
/**
 * @description
 * - class helper to bundle assets files as `.asar`;
 * >- as `type: "buffer"`;
 * >- uses `[at]electron/asar` under the hood;
 * - use only if you are planning to use [CompileJS](#compilejs);
 * >- the class static methods don't obfuscate target file;
 * >- don't embed any sensitive content using this methods of `CompileJS`;
 * >- it's better to place it on `.env`;
 */
export declare class FSasar {
    /**
     * @typedef {import('./adds/PathFSDir.mjs').PathFSDir} PathFSDir
     */
    /**
     * @description
     * @param {PathFSFile} pathFSFPathFSFileInstance
     * @returns {Promise<Buffer<ArrayBufferLike>>}
     * @example
     * import { FSasar, PathFSFile } from 'vivth/node';
     *
     * const fileBuffer = await FSasar.file(PathFSFile.vivth[blank]File('../function/myModule.mjs'));
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
     * import { FSasar, PathFSDir } from 'vivth/node';
     *
     * const { forEachFiles, getFile } = FSasar.dir(PathFSDir.vivthDir('../function/', /[\s\S]\*[noblank]/)); // without `[noblank]`;
     * forEachFiles(async ({ inputRelative, asar }) => {
     * 	// handle `inputRelative` with getFile; OR
     * 	// handle `asar` with FSasar.file
     * });
     */
    static dir: (pathFSDirInstance: PathFSDir) => {
        forEachFiles: (loopCallback: (pathDetail: {
            inputRelative: string;
            asar: string;
        }) => void) => void;
        getFile: (relativeFromDir: string) => ReturnType<typeof FSasar["file"]>;
    };
}
