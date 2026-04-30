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
export class GetterSetter<T extends unknown, TG extends (...any: any[]) => T, TS extends (...any: any[]) => void> {
    /**
     * @param {Object} options
     * @param {TG} [options.get]
     * @param {TS} [options.set]
     */
    constructor({ get, set }: {
        get?: TG | undefined;
        set?: TS | undefined;
    });
    /**
     * @type {TG|undefined}
     */
    get: TG | undefined;
    /**
     * @type {TS|undefined}
     */
    set: TS | undefined;
}
