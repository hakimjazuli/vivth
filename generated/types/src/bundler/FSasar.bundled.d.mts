export class FSasar {
    /**
     * @typedef {import('./adds/PathFSDir.mjs').PathFSDir} PathFSDir
     */
    /**
     * @param {PathFSFile} filePathFromProject
     * @returns {Promise<undefined|Buffer<ArrayBufferLike>>}
     */
    static file: (filePathFromProject: PathFSFile) => Promise<undefined | Buffer<ArrayBufferLike>>;
    /**
     * @description
     * - helper function for asar dir;
     * @param {PathFSDir} pathFSDirInstance
     * @returns {{
     * forEachFiles:(loopCallback:(pathDetail:{inputRelative:string, asar:string})=>void)=>void,
     * getFile:(relativeFromDir:string)=> ReturnType<typeof FSasar["file"]>
     * }}
     * - forEachFiles are looped async without awaiting any iterations;
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
