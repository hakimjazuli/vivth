// @ts-check

import { LazyFactory } from '../function/LazyFactory.mjs';
import { Console } from './Console.mjs';
import { Signal } from './Signal.mjs';

/**
 * @typedef {import('../types/ListArg.mjs').ListArg} ListArg
 * @typedef {import('../types/MutationType.mjs').MutationType} MutationType
 */
/**
 * @description
 * - class to create list that satisfy `Array<Record<string, string>>`.
 * @template {import('../types/ListArg.mjs').ListArg} LISTARG
 * @extends {Signal<LISTARG[]>}
 */
export class ListSignal extends Signal {
	/**
	 * @description
	 * - Checks if the input is an array whose first item (if present) is a plain object
	 * - with string keys and string values. Allows empty arrays.
	 * @param {unknown} value - The value to validate.
	 * @returns {value is Array<Record<string, string>>} True if the first item is a valid string record or array is empty.
	 */
	static isValid(value) {
		if (Array.isArray(value) === false) {
			return false;
		}
		const first = value[0];
		if (first === undefined) {
			// allow empty array
			return true;
		}
		return (
			first &&
			typeof first === 'object' &&
			!Array.isArray(first) &&
			Object.entries(first).every(
				([key, val]) => typeof key === 'string' && typeof val === 'string'
			)
		);
	}
	/**
	 * @description
	 * - usefull for `loops`;
	 * @param {LISTARG[]} [value]
	 * @example
	 * import { ListSignal } from 'vivth';
	 *
	 * const listExample = new ListSignal([
	 *      {key1: "test1",},
	 *      {key1: "test2",},
	 * ]);
	 */
	constructor(value = []) {
		super(value);
	}
	/**
	 * @description
	 * - reference to original inputed `value`;
	 * @returns {LISTARG[]}
	 * @override
	 */
	get value() {
		return super.value;
	}
	/**
	 * @description
	 * - you cannot mannually set`value` `ListSignal_instance`;
	 * @private
	 * @type {LISTARG[]}
	 * @override
	 */
	set value(_) {
		Console.error('`List.value` `setter` are not available outside the class or instance');
	}
	/**
	 * @description
	 * - methods collection that mimics `Array` API;
	 * - calling this methods will notify subscribers for changes, except for some;
	 */
	arrayMethods = LazyFactory(() => {
		return {
			/**
			 * @instance arrayMethods
			 * @description
			 * - reference to structuredClone elements of `value`;
			 * - calling doesn't notify for changes;
			 * @returns {Array<LISTARG>}
			 */
			get structuredClone() {
				return structuredClone(super.value);
			},
			/**
			 * @instance arrayMethods
			 * @description
			 * - appends new elements to the end;
			 * @param {...LISTARG} listArg
			 * @returns {void}
			 */
			push: (...listArg) => {
				super.value.push(...listArg);
				this.subscribers.notify();
			},
			/**
			 * @instance arrayMethods
			 * @description
			 * - removes the first element;
			 * @type {()=>void}
			 */
			shift: () => {
				super.value.shift();
				this.subscribers.notify();
			},
			/**
			 * @instance arrayMethods
			 * @description
			 * - inserts new element at the start;
			 * @param  {...LISTARG} listArg
			 * @returns {void}
			 */
			unshift: (...listArg) => {
				super.value.unshift(...listArg);
				this.subscribers.notify();
			},
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
			slice: (start = 0, end = 0) => {
				const deleteCount = end - start + 1;
				this.arrayMethods.splice(start, deleteCount);
			},
			/**
			 * @instance arrayMethods
			 * @description
			 * - replace whole `List` data with new array.
			 * @param {LISTARG[]} listArgs
			 * - new array in place of the deleted array.
			 * @returns {void}
			 */
			replace: (listArgs) => {
				this.arrayMethods.splice(0, super.value.length, ...listArgs);
			},
			/**
			 * @instance arrayMethods
			 * @description
			 * - removes elements from an data and, if necessary, inserts new elements in their place;
			 * @param {number} start
			 * - The zero-based location in the data from which to start removing elements.
			 * @param {number} deleteCount
			 * -The number of elements to remove.
			 * @param {...LISTARG} listArg
			 * - new data in place of the deleted data.
			 * @returns {void}
			 */
			splice: (start, deleteCount, ...listArg) => {
				const end = start + deleteCount - 1;
				if (this.#checkLength('splice', end) === false) {
					return;
				}
				super.value.splice(start, deleteCount, ...listArg);
				this.subscribers.notify();
			},
			/**
			 * @instance arrayMethods
			 * @description
			 * - swap `List` data between two indexes;
			 * @param {number} indexA
			 * @param {number} indexB
			 * @returns {void}
			 */
			swap: (indexA, indexB) => {
				if (
					this.#checkLength('swap', indexA) === false ||
					this.#checkLength('swap', indexB) === false
				) {
					return;
				}
				// @ts-expect-error
				[super.value[indexA], super.value[indexB]] = [super.value[indexB], super.value[indexA]];
				this.subscribers.notify();
			},
			/**
			 * @instance arrayMethods
			 * @description
			 * - modify `List` element at specific index;
			 * @param {number} index
			 * @param {Partial<LISTARG>} listArg
			 * @returns {void}
			 */
			modify: (index, listArg) => {
				if (this.#checkLength('modify', index) === false) {
					return;
				}
				for (const key in listArg) {
					const listArgKey = listArg[key];
					if (listArgKey) {
						// @ts-expect-error
						super.value[index][key] = listArgKey;
					}
				}
				this.subscribers.notify();
			},
			/**
			 * @instance arrayMethods
			 * @description
			 * - remove `List` element at specific index;
			 * @param {number} index
			 * @returns {void}
			 */
			remove: (index) => {
				if (this.#checkLength('remove', index) === false) {
					return;
				}
				this.arrayMethods.splice(index, 1);
			},
			/**
			 * @instance arrayMethods
			 * @description
			 * - reverses the elements in an `List` in place.
			 * @returns {void}
			 */
			reverse: () => {
				super.value.reverse();
				this.subscribers.notify();
			},
			/**
			 * @instance arrayMethods
			 * @description
			 * - removes the last element;
			 * @returns {void}
			 */
			pop: () => {
				super.value.pop();
				this.subscribers.notify();
			},
		};
	});
	/**
	 * @param {MutationType} mode
	 * @param {number} end
	 * @returns {boolean}
	 */
	#checkLength = (mode, end) => {
		const dataLength = super.value.length;
		if (end >= dataLength) {
			Console.error({
				mode,
				end,
				dataLength,
				message: 'list modifier, end is out of dataLength',
			});
			return false;
		}
		return true;
	};
}
