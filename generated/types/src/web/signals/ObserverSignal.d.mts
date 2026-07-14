import { Signal } from '../../class/Signal.mjs';
import type { ParametersFollowingN } from '../../typehints/ParametersFollowingN.mts';
export type VivthCleanup = import('../../typehints/VivthCleanup.mjs').VivthCleanup;
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
export declare class ObserverSignal extends Signal<MutationRecord[] | undefined> implements VivthCleanup {
    #private;
    /**
     * @description
     * @override
     * - cleanup callback;
     */
    vivthCleanup: () => Promise<void>;
    /**
     * @description
     * @param {Node} node
     * @param {ParametersFollowingN<
     * 	MutationObserver["observe"],1
     * >} mutationObserverInitArgs
     * - no default value;
     */
    constructor(node: Node, ...mutationObserverInitArgs: ParametersFollowingN<MutationObserver["observe"], 1>);
    /**
     * @override
     */
    set value(_: MutationRecord[] | undefined);
    /**
     * @description
     * @override
     */
    get value(): MutationRecord[] | undefined;
    /**
     * @description
     * - unobserve element;
     */
    unobserve: () => void;
}
