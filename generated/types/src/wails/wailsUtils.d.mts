import { TryAsync } from '../function/TryAsync.mjs';
export declare class wailsUtils {
    #private;
    /**
     * @returns {string}
     */
    static getProjectName: () => string;
    /**
     * @param {string} projectName
     * @returns {boolean}
     */
    static checkGoProjectName: (projectName: string) => boolean;
    /**
     * @param {string} str
     * @returns {string}
     */
    static toPascal: (str?: string) => string;
    /**
     * Formats a Go file using gofumpt in-place (-w)
     * @param {string} filePath
     * @param {string} unformattedCode
     * @returns {string}
     */
    static formatGoCodeString: (filePath: string, unformattedCode: string) => string;
    /**
     * @type {(
     * 	obj:Record<string, string>,
     * )=>string}
     */
    static buildFields: (obj: Record<string, string>) => string;
    /**
     * @param {string} functionName
     * @param {string} trueInput
     * @param {string} trueOutput
     * @param {string} safeSql
     * @param {boolean} isReadQuery
     * @param {string} namedQueryArgs
     * @param {string} scanTargets
     * @param {2 | 3} wailsVersion
     * @returns {string}
     */
    static fileContentSQLGoGenerator: (functionName: string, trueInput: string, trueOutput: string, safeSql: string, isReadQuery: boolean, namedQueryArgs: string, scanTargets: string, wailsVersion: 2 | 3) => string;
    /**
     * - parse sql file into typed go function, in same dir;
     * - package is always sql, so dirname should be sql;
     * - type are self closing, it recogninse go native types;
     * - `:` prefix is for input field;
     * - type then no `:` prefix means it is an output field;
     * @param {string} path
     * @param {2|3} wailsVersion
     * @returns {ReturnType<typeof TryAsync<boolean>>}
     */
    static pathToSQLHandler: (path: string, wailsVersion: 2 | 3) => ReturnType<typeof TryAsync<boolean>>;
    /**
     * @param {Object[]} snippets
     * @param {string[]} pathToJoin
     */
    static jsonPrepare: (snippets: Object[], pathToJoin: string[]) => void;
    /**
     * @param {string} content
     * @param {string[]} pathToJoin
     */
    static writeFileContent: (content: string, pathToJoin: string[]) => void;
    /**
     * @param {Set<string>} packages
     * @param {string[]} services
     * @returns {string}
     */
    static generateAppServiceContent: (packages: Set<string>, services: string[]) => string;
}
