// @ts-check

/**
 * @description
 * - class with static methods to print to standard console with bare minimum ANSI styles;
 */
export class Console {
	static #ansi = {
		reset: '\x1b[0m',
		bold: '\x1b[1m',
		colors: {
			log: '\x1b[32m', // green
			info: '\x1b[34m', // blue
			warn: '\x1b[33m', // yellow
			error: '\x1b[31m', // red
		},
	};
	/**
	 * @param {string} prefix
	 * @param {'log'|'info'|'error'|'warn'} mode
	 * @param {any} data
	 * @returns {void}
	 */
	static #call = (prefix, mode, data) => {
		const fn = console[mode];
		if (typeof fn !== 'function') return;

		const color = Console.#ansi.colors[mode] || '';
		const styledPrefix = `${color}${Console.#ansi.bold}${prefix} ${mode.toUpperCase()}:${
			Console.#ansi.reset
		}`;
		fn(styledPrefix, data);
	};

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
	static log = (data) => {
		return Console.#call('🟢', 'log', data);
	};
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
	static info = (data) => {
		return Console.#call('🔵', 'info', data);
	};
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
	static warn = (data) => {
		return Console.#call('🟠', 'warn', data);
	};
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
	static error = (data) => {
		return Console.#call('🔴', 'error', data);
	};
}
