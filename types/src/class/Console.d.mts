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
     * @param {string} prefix
     * @param {'log'|'info'|'error'|'warn'} mode
     * @param {any} data
     * @returns {void}
     */
    static #call: (prefix: string, mode: "log" | "info" | "error" | "warn", data: any) => void;
    /**
     * @description
     * @param {any} data
     * @returns {void}
     * @example
     * import { Console } from 'vivth';
     *
     * Console.log({
     * 	hello: 'world!!',
     * });
     */
    static log: (data: any) => void;
    /**
     * @description
     * @param {any} data
     * @returns {void}
     * @example
     * import { Console } from 'vivth';
     *
     * Console.info({
     * 	hello: 'world!!',
     * });
     */
    static info: (data: any) => void;
    /**
     * @description
     * @param {any} data
     * @returns {void}
     * @example
     * import { Console } from 'vivth';
     *
     * Console.warn({
     * 	hello: 'world!!',
     * });
     */
    static warn: (data: any) => void;
    /**
     * @description
     * @param {any} data
     * @returns {void}
     * @example
     * import { Console } from 'vivth';
     *
     * Console.error({
     * 	hello: 'world!!',
     * });
     */
    static error: (data: any) => void;
}
