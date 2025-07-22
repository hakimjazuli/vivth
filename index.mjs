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
 */
export { $ } from './src/class/$.mjs';
export { Derived } from './src/class/Derived.mjs';
export { Q } from './src/class/Q.mjs';
export { QFIFO } from './src/class/QFIFO.mjs';
export { QUnique } from './src/class/QUnique.mjs';
export { Signal } from './src/class/Signal.mjs';
export { New$ } from './src/function/New$.mjs';
export { NewDerived } from './src/function/NewDerived.mjs';
export { NewPingFIFO } from './src/function/NewPingFIFO.mjs';
export { NewPingUnique } from './src/function/NewPingUnique.mjs';
export { NewSignal } from './src/function/NewSignal.mjs';
export { tryAsync } from './src/function/tryAsync.export.mjs';
export { trySync } from './src/function/trySync.export.mjs';
/**
 * @typedef {{}|null|number|string|boolean|symbol|bigint|function} anyButUndefined
 */