// @ts-check

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
	static #call = (prefix, mode, data, color, bgcolor) => {
		/** @type {unknown} */
		const fn = console[mode];
		if (typeof fn !== 'function') {
			return;
		}
		fn.call(
			console,
			`%c${prefix} ${mode.toUpperCase()}:`,
			`color:${color};background:${bgcolor};padding:2px 6px;border-radius:4px;`,
			data
		);
	};
	/**
	 * @description
	 * @param {any} data
	 * @returns {void}
	 */
	static log = (data) => {
		Console.#call('🟢', 'log', data, 'white', '#2e7d32');
	};
	/**
	 * @description
	 * @param {any} data
	 * @returns {void}
	 */
	static info = (data) => {
		Console.#call('🔵', 'info', data, 'white', '#1565c0');
	};
	/**
	 * @description
	 * @param {any} data
	 * @returns {void}
	 */
	static warn = (data) => {
		Console.#call('🟠', 'warn', data, 'black', '#ffb300');
	};
	/**
	 * @description
	 * @param {any} data
	 * @returns {void}
	 */
	static error = (data) => {
		Console.#call('🔴', 'error', data, 'white', '#c62828');
	};
}
