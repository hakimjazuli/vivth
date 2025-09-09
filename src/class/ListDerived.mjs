// @ts-check

import { Derived } from './Derived.mjs';
import { Effect } from './Effect.mjs';
/**
 * @description
 * - class to create `dervivedList` that satisfy `Array<Record<string, string>>`;
 * - usefull for `derivedLoops`, e.g. temporary search values;
 * - is a `Derived` instance;
 * @template {ListArg} LA
 * @extends {Derived<LA[]>}
 */
export class ListDerived extends Derived {
	/**
	 * @typedef {import('../types/ListArg.mjs').ListArg} ListArg
	 */
	/**
	 * @description
	 * @param {(effectInstanceOptions:Effect["options"])=>Promise<LA[]>} derivedFunction
	 * @example
	 * import { ListSignal, ListDerived } from 'vivth';
	 *
	 * const listExample = new ListSignal([
	 * 	{key1: "test1"},
	 * 	{key1: "test2"},
	 * ]);
	 *
	 * export const listDerivedExample = new ListDerived(async({ subscribe }) => {
	 * 	// becarefull to not mutate the reference value
	 * 	return subscribe(listExample).value.filter((val) => {
	 * 		// subscribe(listExample).structuredClone can be used as alternative
	 * 		// filter logic
	 * 	})
	 * });
	 */
	constructor(derivedFunction) {
		super(derivedFunction);
	}
}
