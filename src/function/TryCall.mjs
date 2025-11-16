// @ts-check

/**
 * @description
 * - function helper to turn unsafe callback into safe one without tryCatch block;
 * - usefull to flatten your source code;
 * @template {(...param:any[])=>any} UNSAFECALLBACK
 * @param {UNSAFECALLBACK} unsafeCallback
 * @returns {(...param:Parameters<UNSAFECALLBACK>)=>
 * [ReturnType<UNSAFECALLBACK>,undefined]|
 * [undefined,Error]}
 * @example
 * import { TryCall } from 'vivth';
 *
 * const [result, error] = TryCall(unsafeCallback)(...unsafeCallbackParameters);
 * if (!error) {
 *  // do something with result
 * }
 */
export function TryCall(unsafeCallback) {
	// @ts-expect-error
	return (...params) => {
		try {
			return [unsafeCallback(...params), undefined];
		} catch (err) {
			return [undefined, err];
		}
	};
}
