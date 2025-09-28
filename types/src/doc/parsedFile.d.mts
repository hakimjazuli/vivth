export class parsedFile {
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
     * @param {string} path__
     * @param {BufferEncoding} [encoding]
     */
    constructor(path__: string, encoding?: BufferEncoding);
    parse: () => Promise<void>;
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
        "vivth:unwrapLazy;": () => {
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
     * @returns {Promise<boolean>}
     */
    isFile: () => Promise<boolean>;
    /**
     * @returns {Promise<boolean>}
     */
    isDirectory: () => Promise<boolean>;
    baseName: {
        /**
         * @returns {string}
         */
        readonly withExt: string;
        /**
         * @returns {string}
         */
        readonly noExt: string;
    } & {
        "vivth:unwrapLazy;": () => {
            /**
             * @returns {string}
             */
            readonly withExt: string;
            /**
             * @returns {string}
             */
            readonly noExt: string;
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
        "vivth:unwrapLazy;": () => {
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
        readonly relative: string;
        /**
         * @returns {string}
         */
        readonly full: string;
    };
    get ext(): {
        /**
         * @returns {string|undefined}
         */
        readonly withDot: string | undefined;
        /**
         * @returns {string|undefined}
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
        "vivth:unwrapLazy;": () => {
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
        };
    };
    /**
     * @returns {[Promise<any>, undefined]|[undefined, Error]}
     */
    get importAsModuleJS(): [Promise<any>, undefined] | [undefined, Error];
    #private;
}
