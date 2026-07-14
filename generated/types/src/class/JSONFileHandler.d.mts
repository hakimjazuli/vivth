import { TryAsync } from '../function/TryAsync.mjs';
/**
 * @description
 * - class helper to handle `.json` file;
 * - this class assume, `Paths` already instantiated;
 */
export declare class JSONFileHandler {
    #private;
    /**
     * @param {string} path
     * - `relative`(to `Paths.root`) OR `absolute`, both are accepted;
     */
    constructor(path: string);
    /**
     * @description
     * @returns {ReturnType<typeof TryAsync<Object>>}
     * @example
     * import { JSONFileHandler } from "vivth/node";
     *
     * const packageJSONHandler = new JSONFileHandler('/package.json');
     * const [content, error] = await packageJSONHandler.read();
     */
    read: () => ReturnType<typeof TryAsync<Object>>;
    /**
     * @description
     * @param {Object} newObj
     * @return { ReturnType<typeof TryAsync<void>> }
     * @example
     * import { this.writeJSONFileHandler } from "vivth/node";
     *
     * const packageJSONHandler = new JSONFileHandler('/package.json');
     * const [, error] = await packageJSONHandler.write({
     *  ...object,
     * });
     */
    write: (newObj: Object) => ReturnType<typeof TryAsync<void>>;
    /**
     * @description
     * @param {Object} object
     * @return { ReturnType<typeof TryAsync<void>> }
     * @example
     * import { JSONFileHandler } from "vivth/node";
     *
     * const packageJSONHandler = new JSONFileHandler('/package.json');
     * const [, error] = await packageJSONHandler.assign({
     *  ...object,
     * });
     */
    assign: (object: Object) => ReturnType<typeof TryAsync<void>>;
}
