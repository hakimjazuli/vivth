/**
 * @typedef {import('../types/ListArg.mjs').ListArg} ListArg
 * @typedef {import('../types/MutationType.mjs').MutationType} MutationType
 */
/**
 * @description
 * - class to create list that satisfy `Array<Record<string, string>>`.
 * @template {import('../types/ListArg.mjs').ListArg} LA
 * @extends {Signal<LA[]>}
 */
export class ListSignal<LA extends import("../types/ListArg.mjs").ListArg> extends Signal<LA[]> {
    /**
     * @description
     * - Checks if the input is an array whose first item (if present) is a plain object
     * - with string keys and string values. Allows empty arrays.
     * @param {unknown} value - The value to validate.
     * @returns {value is Array<Record<string, string>>} True if the first item is a valid string record or array is empty.
     */
    static isValid: (value: unknown) => value is Array<Record<string, string>>;
    /**
     * @description
     * - usefull for `loops`;
     * @param {LA[]} [value]
     * @example
     * import { ListSignal } from 'vivth';
     *
     * const listExample = new ListSignal([
     *      {key1: "test1",},
     *      {key1: "test2",},
     * ]);
     */
    constructor(value?: LA[]);
    /**
     * @description
     * - methods collection that mimics `Array` API;
     * - calling this methods will notify subscribers for changes, except for some;
     */
    arrayMethods: {
        /**
         * @instance arrayMethods
         * @description
         * - reference to structuredClone elements of `value`;
         * - calling doesn't notify
         * @type {Array<LA>}
         */
        readonly structuredClone: Array<LA>;
        /**
         * @instance arrayMethods
         * @description
         * - appends new elements to the end;
         * @param {...LA} listArg
         * @returns {void}
         */
        push: (...listArg: LA[]) => void;
        /**
         * @instance arrayMethods
         * @description
         * - removes the first element;
         * @type {()=>void}
         */
        shift: () => void;
        /**
         * @instance arrayMethods
         * @description
         * - inserts new element at the start;
         * @param  {...LA} listArg
         * @returns {void}
         */
        unshift: (...listArg: LA[]) => void;
        /**
         * @instance arrayMethods
         * @description
         * - for both start and end, a negative index can be used to indicate an offset from the end of the data. For example, -2 refers to the second to last element of the data;
         * @param {number} [start]
         * - the beginning index of the specified portion of the data. If start is undefined, then the slice begins at index 0.
         * @param {number} [end]
         * - the end index of the specified portion of the data. This is exclusive of the element at the index 'end'. If end is undefined, then the slice extends to the end of the data.
         * @returns {void}
         */
        slice: (start?: number, end?: number) => void;
        /**
         * @instance arrayMethods
         * @description
         * - replace whole `List` data with new array.
         * @param {LA[]} listArgs
         * - new array in place of the deleted array.
         * @returns {void}
         */
        replace: (listArgs: LA[]) => void;
        /**
         * @instance arrayMethods
         * @description
         * - removes elements from an data and, if necessary, inserts new elements in their place;
         * @param {number} start
         * - The zero-based location in the data from which to start removing elements.
         * @param {number} deleteCount
         * -The number of elements to remove.
         * @param {...LA} listArg
         * - new data in place of the deleted data.
         * @returns {void}
         */
        splice: (start: number, deleteCount: number, ...listArg: LA[]) => void;
        /**
         * @instance arrayMethods
         * @description
         * - swap `List` data between two indexes;
         * @param {number} indexA
         * @param {number} indexB
         * @returns {void}
         */
        swap: (indexA: number, indexB: number) => void;
        /**
         * @instance arrayMethods
         * @description
         * - modify `List` element at specific index;
         * @param {number} index
         * @param {Partial<LA>} listArg
         * @returns {void}
         */
        modify: (index: number, listArg: Partial<LA>) => void;
        /**
         * @instance arrayMethods
         * @description
         * - remove `List` element at specific index;
         * @param {number} index
         * @returns {void}
         */
        remove: (index: number) => void;
        /**
         * @instance arrayMethods
         * @description
         * - reverses the elements in an `List` in place.
         * @returns {void}
         */
        reverse: () => void;
        /**
         * @instance arrayMethods
         * @description
         * - removes the last element;
         * @returns {void}
         */
        pop: () => void;
    } & {
        "vivth:unwrapLazy;": string;
    };
    #private;
}
export type ListArg = import("../types/ListArg.mjs").ListArg;
export type MutationType = import("../types/MutationType.mjs").MutationType;
import { Signal } from './Signal.mjs';
