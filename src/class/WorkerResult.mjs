// @ts-check

/**
 * @description
 * - typeHelper for `Worker` message passing;
 * - uses error as value instead;
 * @template POST
 */
export class WorkerResult {
	/**
	 * @param {POST} data
	 * @param {Error|string|undefined} error
	 */
	constructor(data, error) {
		this.data = data;
		this.error = error;
	}
	/**
	 * @description
	 * - result value;
	 * @type {POST}
	 */
	data;
	/**
	 * @description
	 * - error value;
	 * @type {Error|string|undefined}
	 */
	error;
}
