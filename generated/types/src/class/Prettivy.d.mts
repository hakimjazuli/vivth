/**
 * @description
 * - `prettier` wrapper with option inference from path;
 */
export declare class Prettivy {
    #private;
    options: import("prettier").Options | null | undefined;
    /**
     * @param {string} path
     */
    constructor(path: string);
    /**
     * @type {string}
     */
    path: string;
    getOptions: () => Promise<import("prettier").Options | null | undefined>;
    /**
     * @param {string} contentBeforePrettified
     * @returns {Promise<string>}
     */
    format: (contentBeforePrettified: string) => Promise<string>;
}
