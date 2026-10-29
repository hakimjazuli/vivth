// @ts-check

/**
 * @type {Map<string, (...args: any[]) => Promise<any>>}
 */
export const wails3SetterObjects = new Map();

/**
 * @description
 * helper collection to handle `Setter` for `Wails3Listener`
 */
export class Wails3Setter {
	/**
	 * @description
	 * - register handler for `Wails3OnSubmit` or `Wails3Form` to use
	 * @param {string} name
	 * @param {(...args:any)=>Promise<any>} handler
	 * @example
	 * import { Wails3Setter } from 'vivth/neutral';
	 * // need to target your actual wails3 generated service binding
	 * import { MyGetter } from '../bindings/myProject/mygetterservice.ts';
	 * Wails3Setter.register('MyGetter', MyGetter);
	 */
	static register(name, handler) {
		wails3SetterObjects.set(name, handler);
	}
}
