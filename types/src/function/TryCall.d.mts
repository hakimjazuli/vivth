/**
 * @description
 * - function helper to turn unsafe callback into safe one without tryCatch block;
 * - usefull to flatten your source code;
 * @template {(...param:any[])=>any} UNSAFECALLBACK
 * @param {UNSAFECALLBACK} unsafeCallback
 * @param {Parameters<UNSAFECALLBACK>} params
 * @returns {[ReturnType<UNSAFECALLBACK>,undefined]|
 * [undefined, Error]}
 * @example
 * import { TryCall } from 'vivth';
 *
 * const [result, error] = TryCall(unsafeCallback, ...unsafeCallbackParameters);
 * if (!error) {
 *   // do something with result safely;
 * }
 */
export function TryCall<UNSAFECALLBACK extends (...param: any[]) => any>(unsafeCallback: UNSAFECALLBACK, ...params: Parameters<UNSAFECALLBACK>): [ReturnType<UNSAFECALLBACK>, undefined] | [undefined, Error];
