export class Q {
    /**
     * @typedef {import('../types/anyButUndefined.type.mjs').anyButUndefined} anyButUndefined
     */
    /**
     * @private
     * @type {Promise<void>}
     */
    private static f;
    /**
     * Blocks execution for subsequent calls until the current one finishes.
     * @returns {Promise<{resume:()=>void}>} Resolves when it's safe to proceed, returning a cleanup function
     */
    static fifo: () => Promise<{
        resume: () => void;
    }>;
    /**
     * @type {Map<any, Promise<any>>}
     */
    static u: Map<any, Promise<any>>;
    /**
     * Ensures that each id has only one task running at a time.
     * Calls with the same id will wait for the previous call to finish.
     * @param {anyButUndefined} id
     * @returns {Promise<{resume:()=>void}>} Resolves when it's safe to proceed for the given id, returning a cleanup function
     */
    static unique: (id: import("../types/anyButUndefined.type.mjs").anyButUndefined) => Promise<{
        resume: () => void;
    }>;
}
