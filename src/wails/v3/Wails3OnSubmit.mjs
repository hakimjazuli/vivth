// @ts-check

import { IsInstanceOf } from '../../function/IsInstanceOf.mjs';
import { wails3FormRefObjects } from './Wails3FormRef.mjs';

/**
 * @description
 * - function helper to be used as onsubmit event handler for wails ipc call for setter;
 * - `form[form-ref]` value to target go wails ipc name;
 * - `form[input][name]` value will be used as named `arg0` struct on setter ipc;
 * - you can generate setter ipc by add comment before function `// FORM`, which then `Wails3Dev` generate callable ipc on `main_services.go`;
 * > - funtion need to return `*EmitterInstance` which to notify your getter declared via `Wails3Listener`;
 * > - function need to be located on `package backend` at `{projectRoot}/backend`;
 * > - use `??serviceMethod` snipet to generate the function skeleton;
 * > > - you might also prepare it with `??servicePrepare`;
 * @this {HTMLFormElement}
 * - you need to call it via `Wails3OnSubmit.call(yourFormElement, submitEvent)` to bind `yourFormElement` to `this`;
 * @param {SubmitEvent} e
 * @returns {Promise<void>}
 * @example
 * import { Wails3OnSubmit } from 'vivth/neutral';
 * const myElement = document.querySelector('#myForm');
 * const submitHandler = Wails3OnSubmit.bind(myElement);
 * myElement.addEventListener('submit', submitHandler);
 * // on element no longer exist
 * myElement.removeEventListener('submit', submitHandler);
 */
export async function Wails3OnSubmit(e) {
	if (!IsInstanceOf(this, HTMLFormElement)) {
		console.error('FormWails: no HTMLFormElement is binded to `this`;');
		return;
	}
	e.preventDefault();
	const formRefNode = this.getAttribute('form-ref');
	if (!formRefNode) {
		console.error({
			element: this,
			message: 'FormWails: Missing "form-ref" attribute on form element;',
		});
		return;
	}
	// get all input name that have [input-name]
	// Extract named inputs into a Record<string, string>
	const formData = new FormData(this);
	const payload = Object.fromEntries(formData.entries());
	await wails3FormRefObjects.get(formRefNode)?.(payload);
}
