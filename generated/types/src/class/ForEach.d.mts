import { TrySync } from '../function/TrySync.mjs';
/**
 * @description
 * - is collections of safe `.forEach` wrapper;
 * >- via [TrySync](#trysync);
 */
export declare class ForEach {
    #private;
    /**
     * @description
     * - static method helper for `array` to be iterate safely;
     * @template T, R
     * @param {T[]} array
     * @param {(value: T, index: number, array: T[]) => R} handler
     * @returns {Array<ReturnType<typeof TrySync<R>>>}
     * @example
     * import { Foreach } from 'vivth/neutral';
     *
     * const arr = ['a','b'];
     * ForEach(arr, (string, i, arr_)=>{
     * 	// unsafe Code
     * });
     */
    static array<T, R>(array: T[], handler: (value: T, index: number, array: T[]) => R): Array<ReturnType<typeof TrySync<R>>>;
    /**
     * @description
     * - static method helper for `set` to be iterate safely;
     * @template T, R
     * @param {Set<T>} set
     * @param {(value: T, value2: T, set: Set<T>) => R} handler
     * @returns {Array<ReturnType<typeof TrySync<R>>>}
     * @example
     * import { Foreach } from 'vivth/neutral';
     *
     * const set = new Set();
     * ForEach(set, (value, value2, set_)=>{
     * 	// unsafe Code
     * });
     */
    static set<T, R>(set: Set<T>, handler: (value: T, value2: T, set: Set<T>) => R): Array<ReturnType<typeof TrySync<R>>>;
    /**
     * @description
     * - static method helper for `map` to be iterate safely;
     * @template K, V, R
     * @param {Map<K,V>} map
     * @param {(value: V, key: K, map: Map<K,V>) => R} handler
     * @returns {Array<ReturnType<typeof TrySync<R>>>}
     * @example
     * import { Foreach } from 'vivth/neutral';
     *
     * const map = new Map();
     * ForEach(map, (value, key, map_)=>{
     * 	// unsafe Code
     * });
     */
    static map<K, V, R>(map: Map<K, V>, handler: (value: V, key: K, map: Map<K, V>) => R): Array<ReturnType<typeof TrySync<R>>>;
}
