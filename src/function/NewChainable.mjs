// @ts-check

/**
 * @description
 * - Wraps a target object in a chainable;
 * - example:
 * ```html
 * <canvas id="myCanvas" width="400" height="400"></canvas>
 * ```
 * - chain call are synchronous without awaiting;
 * >- if the method are async, it could cause race condition;
 * @template {object} OBJ
 * @param {OBJ} ctx
 * @returns {import("../typehints/ChainableType.mjs").ChainableType<OBJ>}
 * @example
 * import { NewChainable, TrySync } from 'vivth/neutral';
 *
 * TrySync(()=>{
 * const canvas = document.getElementById('myCanvas');
 * if (!canvas) {
 * 	return;
 * }
 *
 * const ctx2D = canvas.getContext('2d');
 *
 * // instead of repeating call method from `ctx2D`, you can:
 * NewChainable(ctx2D)
 * 	.beginPath()
 * 	.moveTo(50, 50)
 * 	.lineTo(200, 50)
 * 	.lineTo(200, 200)
 * 	.closePath()
 * 	.stroke();
 * 	// .this to get ctx2D reference;
 * })
 */
export function NewChainable(ctx) {
	/**
	 * @type {import("../typehints/ChainableType.mjs").ChainableType<OBJ>}
	 */
	// @ts-expect-error
	let proxy = null;

	// @ts-expect-error
	proxy = new Proxy(ctx, {
		get(target, prop, receiver) {
			if (prop === 'this') {
				return ctx;
			}
			const value = Reflect.get(target, prop, receiver);

			if (typeof value === 'function') {
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
