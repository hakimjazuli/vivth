// @ts-check

export class PathFSFile {
	/**
	 * @param {string} relativePath
	 * @param {{shouldNotInlcudes:string}} [options]
	 * @returns {PathFSFile}
	 */
	static vivthFile = (relativePath, options) => {
		return new PathFSFile(relativePath, options);
	};
	/**
	 * @private
	 * @param {Parameters<typeof PathFSFile["vivthFile"]>[0]} relativePath
	 * @param {Parameters<typeof PathFSFile["vivthFile"]>[1]} [_options]
	 */
	constructor(relativePath, _options) {
		((this.#path = relativePath), (this.#callerPath = ''));
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
