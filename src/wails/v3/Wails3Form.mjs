// @ts-check

import { WC_extendsA } from '../../web/WC_extendsA.mjs';
import { Wails3OnSubmit } from './Wails3OnSubmit.mjs';

/**
 * @description
 * Custom `form[is="form-wails"]` element that handles submission by calling a specified Wails SETTER backend function;
 * passing form input fields as a JSON object string.
 * - applies to `form[is="form-wails"]`;
 * > - this class automatically bind the element with `Wails3OnSubmit` to it's `onsubmit`;
 * - `[setter]` value to target go wails ipc name;
 * > - it will call `wails3 Binded Service` to your form inputs as `arg0`;
 * @example
 * import { Wails2Form } from 'vivth/browser';
 */
export class Wails2Form extends WC_extendsA(HTMLFormElement) {
	constructor() {
		super();
		const onSubmitHandler = Wails3OnSubmit.bind(this);
		this.ON(this, {
			connected: () => {
				this.addEventListener('submit', onSubmitHandler);
			},
			disconnected: () => {
				this.removeEventListener('submit', onSubmitHandler);
			},
		});
	}
	static {
		this.define('form-wails', this, { extends: 'form' });
	}
}
