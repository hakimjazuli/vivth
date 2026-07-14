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
export declare function NewChainable<OBJ extends object>(ctx: OBJ): import("../typehints/ChainableType.mjs").ChainableType<OBJ>;
