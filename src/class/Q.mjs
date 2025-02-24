// @ts-check

/**
 * @description
 * - class that containts static methods to generate Promise based `awaiter` inside async function, to prevent race condition, including but not limited to:
 * > - modifying the same `Map`, `Set`(etc.) `Object`/`Instance` inside a `Promise.all`/any code that might fired simultanously;
 * ```js
 * import { Q } from 'vivth';
 *
 * const handler = async () => {
 * 	// your code;
 * 	const { resume } = await Q.fifo() // or await Q.unique(uniqueID);
 * 	// your code that modifies same `Map`;
 * 	resume();
 * 	// the rest of your code;
 * 	return;
 * }
 *
 * const runtime = async () => {
 * 	// await Promise.all(handler1, handler2, ..., handlern);
 * }
 *
 * runtime();
 * ```
 * - behaviour:
 * > - `fifo`: call all queued callback `first in first out` style;
 * > - `unique`: call all queued callback with the same `uniqueID` `first in first out` style, if the `uniqueID` is different it will be called in parallel;
 */
export class Q {
	/**
	 * @typedef {import('../types/anyButUndefined.type.mjs').anyButUndefined} anyButUndefined
	 */
	/**
	 * @private
	 * @type {Promise<void>}
	 */
	static f = Promise.resolve();
	/**
	 * Blocks execution for subsequent calls until the current one finishes.
	 * @returns {Promise<{resume:()=>void}>} Resolves when it's safe to proceed, returning a cleanup function
	 */
	static fifo = async () => {
		let resolveFn;
		const next = new Promise((resolve) => {
			resolveFn = resolve;
		});
		const prev = Q.f;
		Q.f = next;
		await prev;
		return {
			resume: () => {
				resolveFn(); // Resolve the current task
			},
		};
	};
	/**
	 * @type {Map<any, Promise<any>>}
	 */
	static u = new Map();
	/**
	 * Ensures that each id has only one task running at a time.
	 * Calls with the same id will wait for the previous call to finish.
	 * @param {anyButUndefined} id
	 * @returns {Promise<{resume:()=>void}>} Resolves when it's safe to proceed for the given id, returning a cleanup function
	 */
	static unique = async (id) => {
		if (!Q.u.has(id)) {
			Q.u.set(id, Promise.resolve());
			let resolveFn;
			const next = new Promise((resolve) => {
				resolveFn = resolve;
			});
			const prev = Q.u.get(id);
			Q.u.set(id, next);
			await prev;
			return {
				resume: () => {
					resolveFn();
					Q.u.delete(id);
				},
			};
		} else {
			const prev = Q.u.get(id);
			await prev;
			return await Q.unique(id);
		}
	};
}
