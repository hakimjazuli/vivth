// @ts-check

import { IsInstanceOf } from '../../function/IsInstanceOf.mjs';

/**
 * @description
 * - function helper to be used as onsubmit event handler for wails ipc call for setter;
 * - `form[setter]` value to target go wails ipc name;
 * - `form[input][name]` value will be used as named `arg0` struct on setter ipc;
 * - you can generate setter ipc by add comment before function `// SETTER`, which then `Wails2Dev` generate callable ipc on `app_ipc.go`;
 * > - funtion need to return `[]string` which to notify your getter declared via `Wails2Listener`;
 * > - function need to be located on `package backend` at `{projectRoot}/backend`;
 * > - use `??staticMethod` snipet to generate the function skeleton;
 * > > - you might also prepare it with `??staticPrepare`;
 * @this {HTMLFormElement}
 * - you need to call it via `Wails2OnSubmit.call(yourFormElement, submitEvent)` to bind `yourFormElement` to `this`;
 * @param {SubmitEvent} e
 * @returns {Promise<void>}
 * @example
 * import { Wails2OnSubmit } from 'vivth/neutral';
 * const myElement = document.querySelector('#myForm');
 * const submitHandler = Wails2OnSubmit.bind(myElement);
 * myElement.addEventListener('submit', submitHandler);
 * // on element no longer exist
 * myElement.removeEventListener('submit', submitHandler);
 */
export async function Wails2OnSubmit(e) {
	if (!IsInstanceOf(this, HTMLFormElement)) {
		console.error('FormWails: no HTMLFormElement is binded to `this`;');
		return;
	}
	e.preventDefault();
	const setterName = this.getAttribute('setter');
	if (!setterName) {
		console.error('FormWails: Missing "setter" attribute on form element;');
		return;
	}
	// get all input name that have [input-name]
	// Extract named inputs into a Record<string, string>
	const formData = new FormData(this);
	const payload = Object.fromEntries(formData.entries());
	// @ts-expect-error
	await window['go']['main']['App'][setterName](payload);
}
