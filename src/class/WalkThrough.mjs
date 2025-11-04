// @ts-check

/**
 * @description
 * - collection of static `methods` to walktrhough things, instead of regular looping;
 * - usefull to iterator that might be modified during iteration;
 * - mostlikely to be less performant, but with better result clarity;
 */
export class WalkThrough {
	/**
	 * @param {Iterator<any, any, any>} iterator
	 * @param {(...any:any[])=>void} callback
	 * @returns {void}
	 */
	static #handler = (iterator, callback) => {
		let result = iterator.next();
		while (!result.done) {
			callback(result.value);
			result = iterator.next();
		}
	};
	/**
	 * @description
	 * - method helper to WalkThrough `Set`;
	 * @template VAL
	 * @param {Set<VAL>} setInstance
	 * @param {(value:VAL)=>void} callback
	 * @returns {void}
	 * @example
	 * import { WalkThrough } from 'vivth';
	 *
	 * WalkThrough.set(setOfSomething, (value) => {
	 * 	// code
	 * })
	 */
	static set(setInstance, callback) {
		WalkThrough.#handler(setInstance.values(), callback);
	};
	/**
	 * @description
	 * - method helper to WalkThrough `Map`;
	 * @template KEY, VAL
	 * @param {Map<KEY, VAL>} mapInstance
	 * @param {(res:[key: KEY, value: VAL]) => void} callback
	 * @returns {void}
	 * @example
	 * import { WalkThrough } from 'vivth';
	 *
	 * WalkThrough.map(mapOfSomething, ([key, value]) => {
	 * 	// code
	 * })
	 */
	static map(mapInstance, callback) {
		WalkThrough.#handler(mapInstance.entries(), callback);
	};
	/**
	 * @description
	 * - method helper to WalkThrough `Array`;
	 * @template VAL
	 * @param {VAL[]} arrayInstance
	 * @param {(res:[value: VAL, index: number]) => void} callback
	 * @returns {void}
	 * @example
	 * import { WalkThrough } from 'vivth';
	 *
	 * WalkThrough.array(arrayOfSomething, ([value, index]) => {
	 * 	// code
	 * })
	 */
	static array(arrayInstance, callback) {
		WalkThrough.#handler(arrayInstance.values(), callback);
	};
	/**
	 * @description
	 * - method helper to WalkThrough `Generator`;
	 * @template T
	 * @param {Generator<T, any, any>} generatorInstance
	 * @param {(value: T) => void} callback
	 * @returns {void}
	 * @example
	 * import { WalkThrough } from 'vivth';
	 *
	 * WalkThrough.generator(generatorOfSomething, (value) => {
	 * 	// code
	 * })
	 */
	static generator(generatorInstance, callback) {
		WalkThrough.#handler(generatorInstance, callback);
	};
}
