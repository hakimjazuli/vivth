/**
 * @import {ParametersFollowingN} from '../../typehints/ParametersFollowingN.mts'
 */
/**
 * @typedef {import('../../typehints/VivthCleanup.mjs').VivthCleanup} VivthCleanup
 */
/**
 * @description
 * - helper to create lazy `MutationObserver`;
 * - use in tandem with `WC_extends`;
 * @implements {VivthCleanup}
 * @extends {Signal<MutationRecord[]|undefined>}
 */
export class ObserverSignal extends Signal<MutationRecord[] | undefined> implements VivthCleanup {
    /**
     * @description
     * @param {Node} node
     * @param {ParametersFollowingN<
     * 	MutationObserver["observe"],1
     * >} mutationObserverInitArgs
     * - no default value;
     */
    constructor(node: Node, options?: MutationObserverInit | undefined);
    /**
     * @description
     * - unobserve element;
     */
    unobserve: () => void;
    #private;
}
export type VivthCleanup = import("../../typehints/VivthCleanup.mjs").VivthCleanup;
import { Signal } from '../../class/Signal.mjs';
