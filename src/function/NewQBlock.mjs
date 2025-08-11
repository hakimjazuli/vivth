// @ts-check

import { Q } from '../class/Q.mjs';
import { TryAsync } from './TryAsync.mjs';

/**
 * @description
 * - a function for Queue;
 * - will wait next execution of the same `arg1`:`objectReferenceID`, without blocking other calls;
 * ```js
 * // @ts-check
 * import { NewQBlock } from 'vivth';
 *  const objectReferenceID = 'yourUniqueID'; // can be anything, reference to object is preferable;
 * const handler = () =>{
 * 	NewQBlock(async () => {
 * 		// your code
 * 	 }, objectReferenceID //- default, will refer to `arg0`:`asyncCallaback`;
 *  );
 * }
 * ```
 */
/**
 * will wait next execution of the same `arg1`:`objectReferenceID`, without blocking other calls;
 * @param {()=>Promise<void>} asyncCallaback
 * @param {any} [objectReferenceID]
 * - default, will refer to `arg0`:`asyncCallaback`;
 */
export const NewQBlock = (asyncCallaback, objectReferenceID = undefined) => {
	TryAsync(async () => {
		const { resume } = await Q.unique(objectReferenceID ?? asyncCallaback);
		await asyncCallaback();
		resume();
	}).then(([_, error]) => {
		if (!error) {
			return;
		}
		console.error(error);
	});
};
