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
	 * @param {any} data
	 * @param {import("../typehints/ConsoleAdditionalSettingType.mjs").ConsoleAdditionalSettingType} args
	 * @return {object}
	 */
	static #addArgsHandler = (data, { now: now_ }) => {
		const obj = { message: data };
		if (now_) {
			Object.assign(obj, { now: Date.now() });
		}
		return obj;
	};
	/**
	 * @param {string} prefix
	 * @param {'log'|'info'|'error'|'warn'} mode
	 * @param {any} data
	 * @param {import("../typehints/ConsoleAdditionalSettingType.mjs").ConsoleAdditionalSettingType} [addArgs]
	 * @returns {void}
	 */
	static #call = (prefix, mode, data, addArgs) => {
		if (addArgs) {
			data = Console.#addArgsHandler(data, addArgs);
		}
		const fn = console[mode];
		if (typeof fn !== 'function') {
			return;
		}

		const color = Console.#ansi.colors[mode] || '';
		const styledPrefix = `${color}${Console.#ansi.bold}${prefix} ${mode.toUpperCase()}:${
			Console.#ansi.reset
		}`;
		fn(styledPrefix, data);
	};

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
	static log = (data, addArgs) => {
		return Console.#call('🟢', 'log', data, addArgs);
	};
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
	static info = (data, addArgs) => {
		return Console.#call('🔵', 'info', data, addArgs);
	};
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
	static warn = (data, addArgs) => {
		return Console.#call('🟠', 'warn', data, addArgs);
	};
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
	static error = (data, addArgs) => {
		return Console.#call('🔴', 'error', data, addArgs);
	};
}
