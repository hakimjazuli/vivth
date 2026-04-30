// @ts-check

if (
	/**  */
	!Promise.withResolvers
) {
	/**
	 * @template {any} T
	 * @type {{
	 * <T>(): PromiseWithResolvers<T>;
	 * <T>(): {
	 * promise: Promise<T>;
	 * resolve: (value?: T | PromiseLike<T> | undefined) => void;
	 * reject: (reason?: any) => void;
	 * };
	 * }}
	 */
	Promise.withResolvers = () => {
		/**
		 * @type {(value: T | PromiseLike<T>) => void}
		 */
		let resolve;
		/**
		 * @type {(reason?: any) => void}
		 */
		let reject;
		const promise = new Promise((res, rej) => {
			resolve = res;
			reject = rej;
		});
		return {
			promise,
			// @ts-expect-error
			resolve,
			// @ts-expect-error
			reject,
		};
	};
}
