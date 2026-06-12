/**
 * @description
 * - class with static methods to print to standard console with bare minimum ANSI styles;
 */
export class Console {
    static #ansi: {
        reset: string;
        bold: string;
        colors: {
            log: string;
            info: string;
            warn: string;
            error: string;
        };
    };
    /**
     * @param {any} data
     * @param {import("../typehints/ConsoleAdditionalSettingType.mjs").ConsoleAdditionalSettingType} args
     * @return {object}
     */
    static #addArgsHandler: (data: any, { now: now_ }: import("../typehints/ConsoleAdditionalSettingType.mjs").ConsoleAdditionalSettingType) => object;
    /**
     * @param {string} prefix
     * @param {'log'|'info'|'error'|'warn'} mode
     * @param {any} data
     * @param {import("../typehints/ConsoleAdditionalSettingType.mjs").ConsoleAdditionalSettingType} [addArgs]
     * @returns {void}
     */
    static #call: (prefix: string, mode: "log" | "info" | "error" | "warn", data: any, addArgs?: import("../typehints/ConsoleAdditionalSettingType.mjs").ConsoleAdditionalSettingType) => void;
    /**
     * @description
     * @param {any} data
     * @param {import("../typehints/ConsoleAdditionalSettingType.mjs").ConsoleAdditionalSettingType} [addArgs]
     * @returns {void}
     * @example
     * import { Console } from 'vivth/neutral';
     *
     * Console.log({
     * 	hello: 'world!!',
     * });
     */
    static log: (data: any, addArgs?: import("../typehints/ConsoleAdditionalSettingType.mjs").ConsoleAdditionalSettingType) => void;
    /**
     * @description
     * @param {any} data
     * @param {import("../typehints/ConsoleAdditionalSettingType.mjs").ConsoleAdditionalSettingType} [addArgs]
     * @returns {void}
     * @example
     * import { Console } from 'vivth/neutral';
     *
     * Console.info({
     * 	hello: 'world!!',
     * });
     */
    static info: (data: any, addArgs?: import("../typehints/ConsoleAdditionalSettingType.mjs").ConsoleAdditionalSettingType) => void;
    /**
     * @description
     * @param {any} data
     * @param {import("../typehints/ConsoleAdditionalSettingType.mjs").ConsoleAdditionalSettingType} [addArgs]
     * @returns {void}
     * @example
     * import { Console } from 'vivth/neutral';
     *
     * Console.warn({
     * 	hello: 'world!!',
     * });
     */
    static warn: (data: any, addArgs?: import("../typehints/ConsoleAdditionalSettingType.mjs").ConsoleAdditionalSettingType) => void;
    /**
     * @description
     * @param {any} data
     * @param {import("../typehints/ConsoleAdditionalSettingType.mjs").ConsoleAdditionalSettingType} [addArgs]
     * @returns {void}
     * @example
     * import { Console } from 'vivth/neutral';
     *
     * Console.error({
     * 	hello: 'world!!',
     * });
     */
    static error: (data: any, addArgs?: import("../typehints/ConsoleAdditionalSettingType.mjs").ConsoleAdditionalSettingType) => void;
}
