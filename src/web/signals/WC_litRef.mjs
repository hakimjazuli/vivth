// @ts-check

import { createRef, ref } from 'lit-html/directives/ref.js';

import { Signal } from '../../class/Signal.mjs';
import { Console } from '../../class/Console.mjs';
import { Timeout } from '../../function/Timeout.mjs';

/**
 * @import {Ref, RefDirective,} from 'lit-html/directives/ref.js'
 * @import {DirectiveResult} from 'lit-html/directive.js'
 */

/**
 * @description
 * - signal to get element reference on lit render;
 * - warning, this class relies on creating macro task to trick lit-html render ref to get the `Element` reference, it might not be too accurate;
 * @template {Element} EL
 * @extends {Signal<EL|undefined>}
 */
export class WC_litRef extends Signal {
	/**
	 * @description
	 */
	constructor() {
		super(undefined);
	}
	/**
	 * @type {Ref<EL>}
	 */
	#createdRef = createRef();
	/**
	 * @returns {DirectiveResult<typeof RefDirective>}
	 */
	get ref() {
		const directiveResultRef = ref(this.#createdRef);
		directiveResultRef;
		Timeout(0).then(() => {
			/** macro task to let lit finish attaching `.value` to object  */
			super.value = this.#createdRef.value;
		});
		return directiveResultRef;
	}
	onDisconnected = () => {
		this.vivthCleanup();
	};
	/**
	 * @override
	 * @returns {EL|undefined}
	 */
	get value() {
		return super.value;
	}
	/**
	 * @returns {EL|undefined}
	 * @override
	 */
	set value(_) {
		Console.warn('you cannot manually set WC_litRef_signal_ref value');
	}
}
