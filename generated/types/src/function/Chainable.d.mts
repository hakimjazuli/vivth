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
 * import { Chainable } from "vivth";
 *
 * (()=>{
 * const canvas = document.getElementById("myCanvas");
 * if (!canvas) {
 * 	return;
 * }
 * // Now you can chain:
 * chainableContext(canvas.getContext("2d"))
 * 	.beginPath()
 * 	.moveTo(50, 50)
 * 	.lineTo(200, 50)
 * 	.lineTo(200, 200)
 * 	.closePath()
 * 	.stroke();
 * })()
 */
export function Chainable<T extends object>(ctx: T): import("../typehints/ChainableType.mjs").ChainableType<T>;
