/**
 * @description
 * - function helper to turn unsafe callback into safe one without tryCatch block;
 * - usefull to flatten your source code;
 * @template {(...param:any[])=>Promise<any>} UNSAFEASYNCCALLBACK
 * @param {UNSAFEASYNCCALLBACK} unsafeAsyncCallback
 * @returns {(...param:Parameters<UNSAFEASYNCCALLBACK>)=> Promise<
 * [Awaited<ReturnType<UNSAFEASYNCCALLBACK>>,undefined]|
 * [undefined,Error]>}
 * @example
 * import { TryAsyncCall } from 'vivth';
 *
 * (async() => {
 *  const [result, error] = await TryAsyncCall(unsafeAsyncCallback)(...unsafeAsyncCallbackParameters);
 *  if (!error) {
 *   // do something with result
 *  }
 * })()
 */
export function TryAsyncCall<UNSAFEASYNCCALLBACK extends (...param: any[]) => Promise<any>>(unsafeAsyncCallback: UNSAFEASYNCCALLBACK): (...param: Parameters<UNSAFEASYNCCALLBACK>) => Promise<[Awaited<ReturnType<UNSAFEASYNCCALLBACK>>, undefined] | [undefined, Error]>;
