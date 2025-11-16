// @ts-check

/**
 * @description
 * - function helper to turn unsafe constructor call of classReference into safe one without tryCatch block;
 * - usefull to flatten your source code;
 * @template {new (...args: any[]) => any} CLASSREF
 * @param {CLASSREF} classReference
 * @returns {(...args: ConstructorParameters<CLASSREF>) =>
 * [InstanceType<CLASSREF>, undefined]|
 * [undefined, Error]}
 * @example
 * import { TryNew } from 'vivth';
 *
 * const [instance, error] = TryNew(ClassReference)(...classConstructorParameters)
 * if(!error) {
 *  // do something with instance
 * }
 */
export function TryNew(classReference) {
	// @ts-expect-error
	return (...params) => {
		try {
			return [new classReference(...params), undefined];
		} catch (err) {
			return [undefined, err];
		}
	};
}
