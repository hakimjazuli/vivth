import { Signal } from '../../class/Signal.mjs';
export type VivthCleanup = import('../../typehints/VivthCleanup.mjs').VivthCleanup;
/**
 * @typedef {import('../../typehints/VivthCleanup.mjs').VivthCleanup} VivthCleanup
 */
/**
 * @description
 * - signal helper to check whether element is in viewport;
 * @implements {VivthCleanup}
 * @extends {Signal<boolean>}
 */
export declare class IsInViewPortSignal extends Signal<boolean> implements VivthCleanup {
    #private;
    /**
     * @description
     * @override
     * - cleanup callback;
     */
    vivthCleanup: () => Promise<void>;
    /**
     * @description
     * @param {Element} element
     */
    constructor(element: Element);
    /**
     * @description
     * - `Signal.value` reference to check if element is in viewport;
     * @returns {boolean}
     * @override
     */
    get value(): boolean;
    /**
     * @type {boolean}
     * @override
     */
    set value(_: boolean);
}
