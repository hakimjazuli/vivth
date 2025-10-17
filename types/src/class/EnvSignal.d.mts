/**
 * @description
 * - uses [Signal](#signal) and [Derived](#derived) under the hood;
 * @template VALUE
 */
export class EnvSignal<VALUE> {
    /**
     * @description
     * - create `EnvSignal` instance;
     * @param {VALUE} initialValue
     */
    constructor(initialValue: VALUE);
    /**
     * @description
     * - exposed property to listen to;
     * @type {Derived<VALUE>}
     * @example
     * import { EnvSignal, Effect } from 'vivth';
     *
     * export const myEnv = new EnvSignal(true);
     * new Effect(async ({ subscribe }) => {
     * 	const myEnvValue = subscribe(myEnv.env).value;
     * 	// code
     * })
     */
    env: Derived<VALUE>;
    /**
     * @description
     * - call to correct the value of previously declared value;
     * - can only be called once;
     * @param {VALUE} correctedValue
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
    correction: (correctedValue: VALUE) => void;
    #private;
}
import { Derived } from './Derived.mjs';
