import { Signal } from './Signal.mjs';
export type VivthCleanup = import('../typehints/VivthCleanup.mjs').VivthCleanup;
/**
 * @typedef {import('../typehints/VivthCleanup.mjs').VivthCleanup} VivthCleanup
 */
/**
 * @description
 * - this class extends `Signal`;
 * - `ForSignal_instance.runCleanUp` still needs to be manually called, when cleaning up this instance;
 * @template {any} TYPE
 * @implements {VivthCleanup}
 * @extends {Signal<Array<TYPE|undefined>>}
 */
export declare class ForSignal<TYPE extends any> extends Signal<Array<TYPE | undefined>> implements VivthCleanup {
    #private;
    /**
     * @description
     * @param {(
     *	this: ForSignal<TYPE>,
     *	arg:{
     *		index:number,
     *		value:{ value:TYPE, isValueDefined:true, }|
     *			{ value:undefined, isValueDefined:false, },
     *		prev:{ prev:TYPE, isPrevDefined:true, }|
     * 			{ prev:undefined, isPrevDefined:false, },
     * 	})=>void
     * } loopCallback
     * - the diffence of `current` and `prev` or `isValueDefined` and `isPrevDefined` can be used for sideEffect, such as;
     * >- `adding/removing/modifiying` `childNode`s on a parent element;
     * >- `adding/removing/modifiying` `Signal` instances;
     * @param {()=>void} [additionalCleanUp]
     * - additional callback to be run when runCleanUp is called;
     * @example
     * import { ForSignal } from 'vivth/neutral';
     *
     * const myLoop = new ForSignal(
     * 	function ({ index, value: {value, isValueDefined}, prev:{ prev, isPrevDefined} }) {
     * 		// code
     * 	},
     * 	() => {
     * 	 // additional cleanup code
     * 	}
     * )
     * // myLoop.runCleanUp(); // need to be called manually when the instance are to out of scope;
     */
    constructor(loopCallback: (this: ForSignal<TYPE>, arg: {
        index: number;
        value: {
            value: TYPE;
            isValueDefined: true;
        } | {
            value: undefined;
            isValueDefined: false;
        };
        prev: {
            prev: TYPE;
            isPrevDefined: true;
        } | {
            prev: undefined;
            isPrevDefined: false;
        };
    }) => void, additionalCleanUp?: () => void);
    /**
     * @description
     * - need to be manually called when disposing/cleaning up this instance;
     * @type {()=>Promise<void>}
     * @override
     */
    vivthCleanup: () => Promise<void>;
}
