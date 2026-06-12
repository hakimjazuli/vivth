/**
 * @description
 * - `prettier` wrapper with option inference from path;
 */
export class Prettivy {
    static #q: QChannel<import("../typehints/AnyButUndefined.mjs").AnyButUndefined> & {
        [x: symbol]: QChannel<import("../typehints/AnyButUndefined.mjs").AnyButUndefined>;
    };
    /**
     * @param {string} path
     */
    constructor(path: string);
    /**
     * @type {string}
     */
    path: string;
    getOptions: () => Promise<import("prettier").Options | null | undefined>;
    options: import("prettier").Options | null | undefined;
    /**
     * @param {string} contentBeforePrettified
     * @returns {Promise<string>}
     */
    format: (contentBeforePrettified: string) => Promise<string>;
    #private;
}
import { QChannel } from './QChannel.mjs';
