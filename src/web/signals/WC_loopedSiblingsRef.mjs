// @ts-check

import { Console } from '../../class/Console.mjs';
import { Signal } from '../../class/Signal.mjs';
import { TrySync } from '../../function/TrySync.mjs';

const loopedSiblingSymbol = Symbol('loopedSiblings');

/**
 * @description
 * - `Signal` to check siblingIndex of a looped component;
 * - automatically trigger check upon connectedCallback, by wrapping it with `this.ON` even without second argument;
 * - automatically trigger cleanup upon disconnectedCallback, by wrapping it with `this.ON` even without second argument;
 * - assumption is all sibling element must be from same class `WebCompoent`;
 * ```html
 * <div>
 * 	<!-- looped <my-component></my-component> -->
 * 	<!-- looped <my-component></my-component> -->
 * 	<!-- looped <my-component></my-component> -->
 * 	<my-component></my-component>
 * 	<!-- looped <my-component></my-component> -->
 * 	<!-- looped <my-component></my-component> -->
 * </div>
 * ```
 * @extends {Signal<number|undefined>}
 */
export class WC_loopedSiblingsRef extends Signal {
	/**
	 * @param {HTMLElement} instanceRef
	 */
	constructor(instanceRef) {
		super(undefined);
		this.#instanceRef = instanceRef;
	}
	/**
	 * @type {HTMLElement}
	 */
	#instanceRef;
	/**
	 * @type {number|undefined}
	 */
	#index;
	/**
	 * @description
	 * - self auto register and cleanup when assigned with `ON` jut by passing empty object as second argument;
	 * - the automatic part only works on `WC_extends${suffix}`;
	 * >- the cleanup logic are infered by `WC_extends${suffix}` class inner behaviour;
	 * - still need to be called manually if used outside `vivth/neutral` `WebComponent`;
	 * @type {()=>void}
	 */
	onConnected = () => {
		const [res, errorSettingUpLoopedSublingIndex] = TrySync(() => {
			const instanceRef = this.#instanceRef;
			if (this.#index === undefined) {
				if (!instanceRef.isConnected) {
					return undefined;
				}
				if (!instanceRef.previousElementSibling) {
					this.#index = 0;
				} else {
					// @ts-expect-error
					this.#index = instanceRef.previousElementSibling[loopedSiblingSymbol] + 1;
				}
				// @ts-expect-error
				instanceRef[loopedSiblingSymbol] = this.#index;
			}
			return this.#index;
		});
		if (errorSettingUpLoopedSublingIndex) {
			Console.error({ errorSettingUpLoopedSublingIndex });
			return;
		}
		super.value = res;
	};
	/**
	 * @description
	 * - self auto register and cleanup when assigned with `ON` jut by passing empty object as second argument;
	 * - the automatic part only works on `WC_extends${suffix}`;
	 * >- the cleanup logic are infered by `WC_extends${suffix}` class inner behaviour;
	 * - still need to be called manually if used outside `vivth/neutral` `WebComponent`;
	 * @type {()=>void}
	 */
	onDisconnected = () => {
		this.vivthCleanup();
	};
	/**
	 * @type {number|undefined}
	 * @override
	 */
	get value() {
		return super.value;
	}
	/**
	 * @type {number|undefined}
	 * @override
	 */
	set value(_) {
		Console.warn('you cannot manually set WC_loopedSiblings_ref value');
	}
}
