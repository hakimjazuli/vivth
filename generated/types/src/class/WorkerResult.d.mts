/**
 * @description
 * - typeHelper for `Worker` message passing;
 * - uses error as value instead;
 * @template POST
 */
export class WorkerResult<POST> {
    /**
     * @param {POST} data
     * @param {Error|string|undefined} error
     */
    constructor(data: POST, error: Error | string | undefined);
    /**
     * @description
     * - result value;
     * @type {POST}
     */
    data: POST;
    /**
     * @description
     * - error value;
     * @type {Error|string|undefined}
     */
    error: Error | string | undefined;
}
