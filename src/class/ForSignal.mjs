// @ts-check

import { TryAsync } from '../function/TryAsync.mjs';
import { Console } from './Console.mjs';
import { Effect } from './Effect.mjs';
import { Signal } from './Signal.mjs';

/**
 * @typedef {import('../typehints/VivthCleanup.mjs').VivthCleanup} VivthCleanup
 */

/**
 * @description
 * - this class extends `Signal`;
 * - `ForSignal_instance.runCleanUp` still needs to be manually called, when cleaning up this instance;
 * @template {any} TYPE
 * @implements {VivthCleanup}
 * @extends {Signal<Array<TYPE|undefined>>}
 */
export class ForSignal extends Signal {
	/**
	 * @description
	 * @param {(
	 *	this: ForSignal<TYPE>,
	 *	arg:{
	 *		index:number,
	 *		value:{ value:TYPE, isValueDefined:true, }|
	 *			{ value:undefined, isValueDefined:false, },
	 *		prev:{ prev:TYPE, isPrevDefined:true, }|
	 * 			{ prev:undefined, isPrevDefined:false, },
	 * 	})=>void
	 * } loopCallback
	 * - the diffence of `current` and `prev` or `isValueDefined` and `isPrevDefined` can be used for sideEffect, such as;
	 * >- `adding/removing/modifiying` `childNode`s on a parent element;
	 * >- `adding/removing/modifiying` `Signal` instances;
	 * @param {()=>void} [additionalCleanUp]
	 * - additional callback to be run when runCleanUp is called;
	 * @example
	 * import { ForSignal } from 'vivth/neutral';
	 *
	 * const myLoop = new ForSignal(
	 * 	function ({ index, value: {value, isValueDefined}, prev:{ prev, isPrevDefined} }) {
	 * 		// code
	 * 	},
	 * 	() => {
	 * 	 // additional cleanup code
	 * 	}
	 * )
	 * // myLoop.runCleanUp(); // need to be called manually when the instance are to out of scope;
	 */
	constructor(loopCallback, additionalCleanUp) {
		super([]);
		new Effect(async ({ subscribe, isLastCalled, removeEffect }) => {
			const { value: currentValues, prev: prevValues = [] } = subscribe(this);
			if (!(await isLastCalled())) {
				return;
			}
			const length = Math.max(currentValues.length, prevValues?.length ?? 0);
			const isCleanUpRun = this.#isCleanUpRun;
			/**
			 * @type {Array<ReturnType<typeof TryAsync<void>>>}
			 */
			const promises = [];
			for (let index = 0; index < length; index++) {
				promises.push(
					TryAsync(async () => {
						const current = currentValues[index];
						const prev = prevValues[index];
						if (current === prev) {
							return;
						}
						try {
							await loopCallback.call(this, {
								index,
								// @ts-expect-error
								value: { value: current, isValueDefined: current !== undefined },
								// @ts-expect-error
								prev: { prev, isPrevDefined: prev !== undefined },
							});
						} catch (errorHandlingForSignal) {
							Console.error({ errorHandlingForSignal, index });
						}
					}),
				);
			}
			await Promise.all(promises);
			if (!isCleanUpRun) {
				return;
			}
			/**
			 * - the actual cleanup code;
			 */
			removeEffect();
			this.remove.ref();
			if (!additionalCleanUp) {
				return;
			}
			additionalCleanUp();
		});
	}
	/**
	 * @type {boolean}
	 */
	#isCleanUpRun = false;
	/**
	 * @description
	 * - need to be manually called when disposing/cleaning up this instance;
	 * @type {()=>Promise<void>}
	 * @override
	 */
	vivthCleanup = async () => {
		this.#isCleanUpRun = true;
		this.value = [];
	};
}
