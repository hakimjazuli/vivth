// @ts-check

import { Console } from '../../class/Console.mjs';
import { Signal } from '../../class/Signal.mjs';

/**
 * @description
 * - `Signal` to check parentComponent;
 * - automatically trigger check upon connectedCallback, by wrapping it with `this.ON` even without second argument;
 * - automatically trigger cleanup upon disconnectedCallback, by wrapping it with `this.ON` even without second argument;
 * @template {HTMLElement} TEMP
 * @extends {Signal<TEMP|undefined|null>}
 */
export class WC_parentComponentRef extends Signal {
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
	 * @description
	 * - self auto register and cleanup when assigned with `ON` jut by passing empty object as second argument;
	 * - the automatic part only works on `WC_extends${suffix}`;
	 * >- the cleanup logic are infered by `WC_extends${suffix}` class inner behaviour;
	 * - still need to be called manually if used outside `vivth/neutral` `WebComponent`;
	 * @type {()=>void}
	 */
	onConnected = () => {
		const newValue =
			// @ts-expect-error
			this.#instanceRef.getRootNode()?.host ?? this.#instanceRef.parentElement;
		super.value = newValue;
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
	 * @returns {TEMP|undefined|null}
	 * @override
	 * - values:
	 * >- `parentElement`;
	 * >- `hostElement`;
	 * >- `null`;
	 */
	get value() {
		return super.value;
	}
	/**
	 * @returns {TEMP|undefined|null}
	 * @override
	 */
	set value(_) {
		Console.warn('you cannot manually set WC_parentComponentRef_signal value');
	}
}
