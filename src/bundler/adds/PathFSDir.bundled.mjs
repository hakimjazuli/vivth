// @ts-check

export class PathFSDir {
	/**
	 * @param {string} relativePath
	 * @param {RegExp} rule
	 * @param {{shouldNotIncludes:string}} [options]
	 * @returns {PathFSDir}
	 */
	static vivthDir = (relativePath, rule, options = undefined) => {
		return new PathFSDir(relativePath, options, rule);
	};
	/**
	 * @param {Parameters<typeof PathFSDir["vivthDir"]>[0]} relativePath
	 * @param {Parameters<typeof PathFSDir["vivthDir"]>[2]} [_options]
	 * @param {Parameters<typeof PathFSDir["vivthDir"]>[1]} [rule]
	 */
	constructor(relativePath, _options, rule = /[\s\S]*/) {
		this.#rule = rule;
		this.#path = relativePath;
		this.#callerPath = '';
	}
	/**
	 * @type {RegExp}
	 */
	#rule;
	/**
	 * @type {RegExp}
	 */
	get rule() {
		return this.#rule;
	}
	/**
	 * @type {string}
	 */
	#path;
	/**
	 * @returns {string}
	 */
	get path() {
		return this.#path;
	}
	/**
	 * @type {string}
	 */
	#callerPath;
	/**
	 * @returns {string}
	 */
	get callerPath() {
		return this.#callerPath;
	}
}
