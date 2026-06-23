/**
 * @description
 * - collection of static `methods` to walkthrough things, instead of regular looping;
 * - useful for iterators that might be modified during iteration;
 * - most likely to be less performant, but with better result clarity;
 */
export class WalkThrough {
    /**
     * @template T
     * @param {Iterator<T, any, any>} iterator
     * @param {(value: T) => void} callback
     * @returns {void}
     */
    static #handler<T>(iterator: Iterator<T, any, any>, callback: (value: T) => void): void;
    /**
     * @description
     * - method helper to WalkThrough `Set`;
     * @template VAL
     * @param {Set<VAL>} setInstance
     * @param {(value: VAL) => void} callback
     * @returns {void}
     * @example
     * import { WalkThrough } from 'vivth/neutral';
     *
     * WalkThrough.set(setOfSomething, (value) => {
     * // code
     * })
     */
    static set<VAL>(setInstance: Set<VAL>, callback: (value: VAL) => void): void;
    /**
     * @description
     * - method helper to WalkThrough `Map`;
     * @template KEY, VAL
     * @param {Map<KEY, VAL>} mapInstance
     * @param {(entry: [key: KEY, value: VAL]) => void} callback
     * @returns {void}
     * @example
     * import { WalkThrough } from 'vivth/neutral';
     *
     * WalkThrough.map(mapOfSomething, ([key, value]) => {
     * // code
     * })
     */
    static map<KEY, VAL>(mapInstance: Map<KEY, VAL>, callback: (entry: [key: KEY, value: VAL]) => void): void;
    /**
     * @description
     * - method helper to WalkThrough `Array`;
     * @template VAL
     * @param {VAL[]} arrayInstance
     * @param {(entry: [index: number, value: VAL]) => void} callback
     * @returns {void}
     * @example
     * import { WalkThrough } from 'vivth/neutral';
     *
     * WalkThrough.array(arrayOfSomething, ([index, value]) => {
     * // code
     * })
     */
    static array<VAL>(arrayInstance: VAL[], callback: (entry: [index: number, value: VAL]) => void): void;
}
