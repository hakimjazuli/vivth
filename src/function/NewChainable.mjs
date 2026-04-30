// @ts-check

/**
 * @description
 * - Wraps a target object in a chainable.
 * - example:
 * ```html
 * <canvas id="myCanvas" width="400" height="400"></canvas>
 * ```
 * - chain call are synchronous without awaiting;
 * >- if the method are async, it could cause race condition;
 * @template {object} T
 * @param {T} ctx
 * @returns {import("../typehints/ChainableType.mjs").ChainableType<T>}
 * @example
 * import { NewChainable } from "vivth";
 *
 * (()=>{
 * const canvas = document.getElementById("myCanvas");
 * if (!canvas) {
 * 	return;
 * }
 * // Now you can chain:
 * NewChainable(canvas.getContext("2d"))
 * 	.beginPath()
 * 	.moveTo(50, 50)
 * 	.lineTo(200, 50)
 * 	.lineTo(200, 200)
 * 	.closePath()
 * 	.stroke();
 * })()
 */
export function NewChainable(ctx) {
	/** @type {import("../typehints/ChainableType.mjs").ChainableType<T>} */
	// @ts-expect-error
	let proxy = null;

	// @ts-expect-error
	proxy = new Proxy(ctx, {
		get(target, prop, receiver) {
			const value = Reflect.get(target, prop, receiver);

			if (
				/**  */
				typeof value === 'function'
			) {
				// @ts-expect-error
				return (...args) => {
					value.apply(target, args);
					return proxy;
				};
			}

			return value;
		},
		set(target, prop, value) {
			// @ts-expect-error
			target[prop] = value;
			return true;
		},
	});

	return proxy;
}
