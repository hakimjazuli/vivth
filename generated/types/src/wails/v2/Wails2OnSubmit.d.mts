/**
 * @description
 * - function helper to be used as onsubmit event handler for wails ipc call for setter;
 * - `form[setter]` value to target go wails ipc name;
 * - `form[input][name]` value will be used as named `arg0` struct on setter ipc;
 * - you can generate setter ipc by add comment before function `// SETTER`, which then `Wails2Dev` generate callable ipc on `app_ipc.go`;
 * > - funtion need to return `[]string` which to notify your getter declared via `Wails2GetterListener`;
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
export declare function Wails2OnSubmit(this: HTMLFormElement, e: SubmitEvent): Promise<void>;
