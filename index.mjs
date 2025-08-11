// @ts-check
/**
 * generated using:
 * @see {@link https://www.npmjs.com/package/@html_first/js_lib_template | @html_first/js_lib_template}
 * @copyright
 * developed and published under MIT license,
 * @description
 * ## HOW TO INSTALL
 * ```shell
 * npm i vivth
 * ```
 * ```shell
 * bun i vivth
 * ```
 * 
 * ## vivth
 * - contains helpers to help you write autosubscriber pattern javascript program, including:
 * >- collections of signal based functions and classes;
 * >- collections of queue helper functions and classes;
 * 
 * - `vivth` technically can run in any `js runtime`, since it uses non platform specific api;
 * - it is written specifically to be used as a primitives for javascript library or runtime, so there are no complex abstraction is, nor will be, added in `vivth` it self;
 * 
 * ### version
 * - 0.11.x: drop function wrapper for all classes, for better runtime performance
 */
export { $ } from './src/class/$.mjs';
export { Derived } from './src/class/Derived.mjs';
export { PingFIFO } from './src/class/PingFIFO.mjs';
export { PingUnique } from './src/class/PingUnique.mjs';
export { Q } from './src/class/Q.mjs';
export { Signal } from './src/class/Signal.mjs';
export { NewQBlock } from './src/function/NewQBlock.mjs';
export { TryAsync } from './src/function/TryAsync.mjs';
export { TrySync } from './src/function/TrySync.mjs';
/**
 * @typedef {{}|null|number|string|boolean|symbol|bigint|function} AnyButUndefined
 */