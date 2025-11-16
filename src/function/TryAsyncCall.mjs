// @ts-check

/**
 * @description
 * - function helper to turn unsafe callback into safe one without tryCatch block;
 * - usefull to flatten your source code;
 * @template {(...param:any[])=>Promise<any>} UNSAFEASYNCCALLBACK
 * @param {UNSAFEASYNCCALLBACK} unsafeAsyncCallback
 * @param {Parameters<UNSAFEASYNCCALLBACK>} params
 * @returns {Promise<
 * [Awaited<ReturnType<UNSAFEASYNCCALLBACK>>,undefined]|
 * [undefined,Error]>}
 * @example
 * import { TryAsyncCall } from 'vivth';
 *
 * (async() => {
 *  const [result, error] = await TryAsyncCall(unsafeAsyncCallback, ...unsafeAsyncCallbackParameters);
 *  if (!error) {
 *   // do something with result safely;
 *  }
 * })()
 */
export async function TryAsyncCall(unsafeAsyncCallback, ...params) {
	try {
		return [await unsafeAsyncCallback(...params), undefined];
	} catch (err) {
		// @ts-expect-error
		return [undefined, err];
	}
}
