export class parsedFile {
    /**
     * @param {string} exportName
     * @returns {boolean}
     */
    static "__#12@#isExportNameValid": (exportName: string) => boolean;
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
     * @param {string} path__
     * @param {BufferEncoding} [encoding]
     */
    constructor(path__: string, encoding?: BufferEncoding);
    documented: {
        typedef: () => Promise<{
            module: string;
            readme: string;
        }>;
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
        "vivth:unwrapLazy;": string;
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
     * @returns {Promise<boolean>}
     */
    isFile: () => Promise<boolean>;
    /**
     * @returns {Promise<boolean>}
     */
    isDirectory: () => Promise<boolean>;
    baseName: {
        /**
         * @type {string}
         */
        readonly withExt: string;
        /**
         * @type {string}
         */
        readonly noExt: string;
    } & {
        "vivth:unwrapLazy;": string;
    };
    path: {
        /**
         * @type {string}
         */
        readonly relative: string;
        /**
         * @type {string}
         */
        readonly full: string;
    } & {
        "vivth:unwrapLazy;": string;
    };
    get dirName(): {
        /**
         * @type {string}
         */
        readonly relative: string;
        /**
         * @type {string}
         */
        readonly full: string;
    };
    get ext(): {
        /**
         * @type {string|undefined}
         */
        readonly withDot: string | undefined;
        /**
         * @type {string|undefined}
         */
        readonly noDot: string | undefined;
    };
    /**
     * @private
     * @returns {Promise<Stats>}
     */
    private stats;
    get timeStamp(): {
        /**
         * @returns {Promise<number>}
         */
        lastModified: () => Promise<number>;
        /**
         * @returns {Promise<number>}
         */
        createdAt: () => Promise<number>;
    };
    content: {
        /**
         * @return {Promise<string|undefined>}
         */
        string: () => Promise<string | undefined>;
        parsed: () => Promise<{
            exportName: undefined;
            details: undefined;
            error: {
                fullpath: string;
                message: string;
            };
        } | {
            exportName: string | undefined;
            details: ReturnType<(typeof parsedFile)["getDescription"]>;
            error: undefined;
        }>;
    } & {
        "vivth:unwrapLazy;": string;
    };
    /**
     * @type {[Promise<any>, undefined]|[undefined, Error]}
     */
    get importAsModuleJS(): [Promise<any>, undefined] | [undefined, Error];
    #private;
}
