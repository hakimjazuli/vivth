/**
 * @description
 * - class with static methods to print to standard console with added style;
 */
export class Console {
    /**
     * @param {string} prefix
     * @param {'log'|'info'|'error'|'warn'} mode
     * - Console method to use
     * @param {any} data
     * @param {string} color
     * @param {string} bgcolor
     * @returns {void}
     */
    static #call: (prefix: string, mode: "log" | "info" | "error" | "warn", data: any, color: string, bgcolor: string) => void;
    /**
     * @description
     * @param {any} data
     * @returns {void}
     */
    static log: (data: any) => void;
    /**
     * @description
     * @param {any} data
     * @returns {void}
     */
    static info: (data: any) => void;
    /**
     * @description
     * @param {any} data
     * @returns {void}
     */
    static warn: (data: any) => void;
    /**
     * @description
     * @param {any} data
     * @returns {void}
     */
    static error: (data: any) => void;
}
