// @ts-check

import { Console } from '../../class/Console.mjs';
import { Signal } from '../../class/Signal.mjs';
/**
 * @import {ParametersFollowingN} from '../../typehints/ParametersFollowingN.mts'
 */

/**
 * @typedef {import('../../typehints/VivthCleanup.mjs').VivthCleanup} VivthCleanup
 */

/**
 * @description
 * - helper to create lazy `MutationObserver`;
 * - use in tandem with `WC_extends`;
 * @implements {VivthCleanup}
 * @extends {Signal<MutationRecord[]|undefined>}
 */
export class ObserverSignal extends Signal {
	/**
	 * @description
	 * @override
	 * - cleanup callback;
	 */
	vivthCleanup = async () => {
		this.unobserve();
	};
	/**
	 * @param { MutationRecord[] | undefined} mutationRecords
	 */
	#modifySuperValue(mutationRecords) {
		super.value = mutationRecords;
	}
	/**
	 * @description
	 * @param {Node} node
	 * @param {ParametersFollowingN<
	 * 	MutationObserver["observe"],1
	 * >} mutationObserverInitArgs
	 * - no default value;
	 */
	constructor(node, ...mutationObserverInitArgs) {
		super(undefined);
		this.#node = node;
		this.#observer = new MutationObserver(this.#recordHandler);
		this.#observer.observe(node, ...mutationObserverInitArgs);
	}
	/**
	 * @type {Node}
	 */
	#node;
	/**
	 * @type {MutationObserver|undefined}
	 */
	#observer;
	/**
	 * @type {MutationCallback}
	 */
	#recordHandler(mutationRecords) {
		super.value = mutationRecords;
	}
	/**
	 * @override
	 */
	set value(_) {
		Console.error({ node: this.#node, message: 'you cannot manually set ObserverSignal value' });
	}
	/**
	 * @description
	 * @override
	 */
	get value() {
		return super.value;
	}
	/**
	 * @description
	 * - unobserve element;
	 */
	unobserve = () => {
		const mutationRecords = this.#observer?.takeRecords();
		this.#observer?.disconnect();
		this.#observer = undefined;
		this.subscribers.notify(
			async () => {
				this.#modifySuperValue(mutationRecords);
			},
			async () => {
				this.remove.ref();
			},
		);
	};
}
