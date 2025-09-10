/**
 * @description
 * - non browser API;
 * - uses [Signal](#signal) and [Derived](#derived) under the hood;
 * @template V
 */
export class EnvSignal<V> {
    /**
     * @description
     * - create `EnvSignal` instance;
     * @param {V} initialValue
     */
    constructor(initialValue: V);
    /**
     * @description
     * - exposed property to listen to;
     * @type {Derived<V>}
     * @example
     * import { EnvSignal, Effect } from 'vivth';
     *
     * export const myEnv = new EnvSignal(true);
     * new Effect(async ({ subscribe }) => {
     * 	const myEnvValue = subscribe(myEnv.env).value;
     * 	// code
     * })
     */
    env: Derived<V>;
    /**
     * @description
     * - call to correct the value of previously declared value;
     * - can only be called once;
     * @param {V} correctedValue
     * @returns {void}
     * @example
     * import { EnvSignal } from 'vivth';
     *
     * export const myEnv = new EnvSignal(true);
     *
     * // somewhere else on the program
     * import { myEnv } from './myEnv.mjs'
     *
     * myEnv.correction(false); // this will notify all subscribers;
     */
    correction: (correctedValue: V) => void;
    #private;
}
import { Derived } from './Derived.mjs';
