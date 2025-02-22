// @ts-check

export class Q {
	/**
	 * @typedef {import('./anyButUndefined.type.mjs').anyButUndefined} anyButUndefined
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
