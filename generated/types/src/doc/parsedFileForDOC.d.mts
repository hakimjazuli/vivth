export class parsedFileForDOC {
    /**
     * @param {string} exportName
     * @returns {boolean}
     */
    static #isExportNameValid: (exportName: string) => boolean;
    /**
     * @param {string} content
     * @returns { RegExpExecArray[] }
     */
    static getDescription: (content: string) => RegExpExecArray[];
    /**
     * @typedef {{
     *	instanceOrStatic:{parent:string, type:string},
     *	fullDescription:string,
     *	parsedFullDescription:{description:string, jsPreview:string},
     *	isExport:boolean,
     *	typeOfVar:string,
     *	namedVar:string,
     *	reference:string,
     * }} refType
     */
    /**
     * @param {string} path
     * - `relative`(to `Paths.root`) OR `absolute`, both are accepted;
     * @param {import('fs').Stats} [stats]
     * @param {BufferEncoding} [encoding]
     */
    constructor(path: string, stats?: import("fs").Stats, encoding?: BufferEncoding);
    /**
     * @type {Promise<"browser" | "node" | "neutral" | "unsupported">}
     */
    platform: Promise<"browser" | "node" | "neutral" | "unsupported">;
    parse: () => Promise<void>;
    documented: {
        /**
         *
         * @returns {Promise<{
         * 	module: string;
         * 	readme: string;
         * } | undefined>}
         */
        typedef: () => Promise<{
            module: string;
            readme: string;
        } | undefined>;
        /**
         * @type {Set<refType>}
         */
        readme: Set<{
            instanceOrStatic: {
                parent: string;
                type: string;
            };
            fullDescription: string;
            parsedFullDescription: {
                description: string;
                jsPreview: string;
            };
            isExport: boolean;
            typeOfVar: string;
            namedVar: string;
            reference: string;
        }>;
    } & {
        [x: symbol]: {
            /**
             *
             * @returns {Promise<{
             * 	module: string;
             * 	readme: string;
             * } | undefined>}
             */
            typedef: () => Promise<{
                module: string;
                readme: string;
            } | undefined>;
            /**
             * @type {Set<refType>}
             */
            readme: Set<{
                instanceOrStatic: {
                    parent: string;
                    type: string;
                };
                fullDescription: string;
                parsedFullDescription: {
                    description: string;
                    jsPreview: string;
                };
                isExport: boolean;
                typeOfVar: string;
                namedVar: string;
                reference: string;
            }>;
        };
    };
    /**
     * @type {undefined|{module:string, readme:string}}
     */
    parsedType: undefined | {
        module: string;
        readme: string;
    };
    hasValidExportObject: boolean;
    /**
     * @returns {boolean|undefined}
     */
    get isFile(): boolean | undefined;
    /**
     * @returns {boolean|undefined}
     */
    get isDirectory(): boolean | undefined;
    baseName: {
        /**
         * @returns {string}
         */
        withExt: string;
        /**
         * @returns {string}
         */
        noExt: string;
    } & {
        [x: symbol]: {
            /**
             * @returns {string}
             */
            withExt: string;
            /**
             * @returns {string}
             */
            noExt: string;
        };
    };
    path: {
        /**
         * @returns {string}
         */
        readonly relative: string;
        /**
         * @returns {string}
         */
        readonly full: string;
    } & {
        [x: symbol]: {
            /**
             * @returns {string}
             */
            readonly relative: string;
            /**
             * @returns {string}
             */
            readonly full: string;
        };
    };
    get dirName(): {
        /**
         * @returns {string}
         */
        relative: string;
        /**
         * @returns {string}
         */
        full: string;
    };
    get ext(): {
        /**
         * @returns {string|undefined}
         */
        withDot: string;
        /**
         * @returns {string|undefined}
         */
        noDot: string;
    };
    get timeStamp(): {
        /**
         * @returns {Promise<number|undefined>}
         */
        lastModified: () => Promise<number | undefined>;
        /**
         * @returns {Promise<number|undefined>}
         */
        createdAt: () => Promise<number | undefined>;
    };
    content: {
        /**
         * @return {Promise<string|undefined>}
         */
        string: () => Promise<string | undefined>;
        /**
         *
         * @returns {Promise<{exportName:undefined, details:undefined, error:{fullpath:string, message:string}}|
         *  {exportName:string|undefined, details:ReturnType<typeof parsedFileForDOC["getDescription"]>, error:undefined}>}
         */
        parsed: () => Promise<{
            exportName: undefined;
            details: undefined;
            error: {
                fullpath: string;
                message: string;
            };
        } | {
            exportName: string | undefined;
            details: ReturnType<(typeof parsedFileForDOC)["getDescription"]>;
            error: undefined;
        }>;
    } & {
        [x: symbol]: {
            /**
             * @return {Promise<string|undefined>}
             */
            string: () => Promise<string | undefined>;
            /**
             *
             * @returns {Promise<{exportName:undefined, details:undefined, error:{fullpath:string, message:string}}|
             *  {exportName:string|undefined, details:ReturnType<typeof parsedFileForDOC["getDescription"]>, error:undefined}>}
             */
            parsed: () => Promise<{
                exportName: undefined;
                details: undefined;
                error: {
                    fullpath: string;
                    message: string;
                };
            } | {
                exportName: string | undefined;
                details: ReturnType<(typeof parsedFileForDOC)["getDescription"]>;
                error: undefined;
            }>;
        };
    };
    /**
     * @returns {ReturnType<typeof TryAsync<any>>}
     */
    importAsModuleJS: () => ReturnType<typeof TryAsync<any>>;
    #private;
}
import { TryAsync } from '../function/TryAsync.mjs';
