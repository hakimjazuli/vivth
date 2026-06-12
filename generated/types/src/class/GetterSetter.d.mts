/**
 * @description
 * - create getter setter in one place;
 * @template {any} RET
 * @template {((...any:any[])=>RET)} TG
 * @template {((...any:any[])=>void)} TS
 * @example
 * import { GetterSetter } from 'vivth/neutral';
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
 * localA.get(); // 'my new value'
 */
export class GetterSetter<RET extends unknown, TG extends ((...any: any[]) => RET), TS extends ((...any: any[]) => void)> {
    /**
     * @param {Object} options
     * @param {TG|undefined} [options.get]
     * @param {TS|undefined} [options.set]
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
