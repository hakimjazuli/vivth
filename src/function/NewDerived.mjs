// @ts-check

import { Derived } from '../class/Derived.mjs';

/**
 * @template V
 * @param {()=>(V)} derivedFunction
 * @returns {Derived<V>}
 */
export const NewDerived = (derivedFunction) => new Derived(derivedFunction);
