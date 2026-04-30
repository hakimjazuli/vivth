// @ts-check

/**
 * @description
 * - create getter setter in one place;
 * @template {any} T
 * @template {(...any:any[])=>T} TG
 * @template {(...any:any[])=>void} TS
 * @example
 * import { GetterSetter } from 'vivth';
 *
 * const localA = new GetterSetter({
 * 	get:() => {
 * 		return localStorage.getItem('myAValue');
 * 	},
 * 	set:(newValue) => {
 * 		return localStorage.setItem('myAValue', newValue);
 * 	},
 * });
 * localA.get(); // null;
 * localA.set('my new value');
 * localA.get();
 */
export class GetterSetter {
	/**
	 * @param {Object} options
	 * @param {TG} [options.get]
	 * @param {TS} [options.set]
	 */
	constructor({ get, set }) {
		this.get = get;
		this.set = set;
	}
	/**
	 * @type {TG|undefined}
	 */
	get;
	/**
	 * @type {TS|undefined}
	 */
	set;
}
