// @ts-check

import { WC_extendsA } from '../../web/WC_extendsA.mjs';
import { Wails3OnSubmit } from './Wails3OnSubmit.mjs';

/**
 * @description
 * Custom `form[is="form-wails"]` element that handles submission by calling a specified Wails FORM backend function;
 * passing form input fields as a JSON object string.
 * - applies to `form[is="form-wails"]`;
 * > - this class automatically bind the element with `Wails3OnSubmit` to it's `onsubmit`;
 * - `[data-wails3]` value to target go wails ipc name;
 * > - it will call `wails3 Binded Service` to your form inputs as `arg0`;
 * @example
 * import { Wails3Form } from 'vivth/browser';
 */
export class Wails3Form extends WC_extendsA(HTMLFormElement) {
	constructor() {
		super();
		const onSubmitHandler = Wails3OnSubmit.bind(this);
		this.ON(this, {
			connected: (el) => {
				el.addEventListener('submit', onSubmitHandler);
			},
			disconnected: (el) => {
				el.removeEventListener('submit', onSubmitHandler);
			},
		});
	}
	static #isPrepared = false;
	/**
	 * @description
	 * - prepare class for standard definitions;
	 * - you need to call this callback before using this class;
	 * @type {()=>void}
	 * @example
	 * import { Wails3Form } from 'vivth/browser';
	 * Wails3Form.prepare();
	 */
	static prepare = () => {
		if (Wails3Form.#isPrepared) {
			return;
		}
		Wails3Form.#isPrepared = true;
		this.define('form-wails', this, { extends: 'form' });
	};
}
