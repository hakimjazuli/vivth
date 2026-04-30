// @ts-check

export class PathFSBundles {
	/**
	 * @param {string} relativePath
	 * @param {{shouldNotInlcudes:string}} [options]
	 * @returns {PathFSBundles}
	 */
	static vivthBundles = (relativePath, options) => {
		return new PathFSBundles(relativePath, options);
	};
	/**
	 * @private
	 * @param {Parameters<typeof PathFSBundles["vivthBundles"]>[0]} relativePath
	 * @param {Parameters<typeof PathFSBundles["vivthBundles"]>[1]} [_options]
	 */
	constructor(relativePath, _options) {
		this.#path = relativePath;
		this.#callerPath = '';
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
