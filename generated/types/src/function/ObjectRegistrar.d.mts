/**
 * @description
 * - function helper to object registrar;
 * @template {any[]} ARGS
 * @template {any} OBJ
 * @param {(...args:ARGS)=>OBJ} registrarCallback
 * @returns {Parameters<typeof ObjectRegistrar<ARGS, OBJ>>[0]}
 * @example
 * import { ObjectRegistrar, Signal, ForOfSync } from 'vivth/neutral';
 *
 * const autoCleanedUpSignal = ObjectRegistrar(()=>{
 *
 * })
 *
 * const mySignal = autoCleanedUpSignal(1);
 */
export declare function ObjectRegistrar<ARGS extends any[], OBJ extends any>(registrarCallback: (...args: ARGS) => OBJ): Parameters<typeof ObjectRegistrar<ARGS, OBJ>>[0];
