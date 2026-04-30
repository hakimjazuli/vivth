/**
 * @description
 * - function helper to object registrar;
 * @template {any} OBJ
 * @param {(any:OBJ)=>void} registrarCallback
 * @returns {(obj:OBJ)=>OBJ}
 * @example
 * import { ObjectRegistrar, Signal, ForOfSync } from 'vivth';
 *
 * const setOfDCCB = new Set();
 * const registrar = (obj)=>{
 * 	setOfDCCB.add(obj);
 * }
 * const cleanup = () => ForOfSync(setOfDCCB, (signal) => {
 * 	signal.remove.ref()
 * })
 *
 * const autoCleanedUpSignal = ObjectRegistrar(registrar);
 * const mySignal = autoCleanedUpSignal(new Signal(1));
 *
 * // somewhere else
 * cleanup();
 */
export function ObjectRegistrar<OBJ extends unknown>(registrarCallback: (any: OBJ) => void): (obj: OBJ) => OBJ;
