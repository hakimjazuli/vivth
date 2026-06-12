/**
 * @typedef {import('../../typehints/VivthCleanup.mjs').VivthCleanup} VivthCleanup
 */
/**
 * @description
 * - signal helper to check whether element is in viewport;
 * @implements {VivthCleanup}
 * @extends {Signal<boolean>}
 */
export class IsInViewPortSignal extends Signal<boolean> implements VivthCleanup {
    /**
     * @type {WeakMap<Element, Signal<boolean>>}
     */
    static #mapped: WeakMap<Element, Signal<boolean>>;
    /**
     * @type {IntersectionObserver|undefined}
     */
    static #intersectionObserver_: IntersectionObserver | undefined;
    static #q: QChannel<import("../../typehints/AnyButUndefined.mjs").AnyButUndefined> & {
        [x: symbol]: QChannel<import("../../typehints/AnyButUndefined.mjs").AnyButUndefined>;
    };
    static get #intersectionObserver(): IntersectionObserver;
    /**
     * @type {IntersectionObserverInit}
     */
    static #intersectionObserverInit: IntersectionObserverInit;
    /**
     * @type {IntersectionObserverCallback}
     */
    static #intersectionObserverCallback: IntersectionObserverCallback;
    /**
     * @param {()=>boolean} isLastOnQ
     * @param {Element} target
     * @param {IntersectionObserverEntry} entry
     * @returns {Promise<void>}
     */
    static #qCB: (isLastOnQ: () => boolean, target: Element, entry: IntersectionObserverEntry) => Promise<void>;
    /**
     * @param {Element} element
     * @returns {boolean}
     */
    static #isInViewport(element: Element): boolean;
    /**
     * @description
     * @param {Element} element
     */
    constructor(element: Element);
    #private;
}
export type VivthCleanup = import("../../typehints/VivthCleanup.mjs").VivthCleanup;
import { Signal } from '../../class/Signal.mjs';
import { QChannel } from '../../class/QChannel.mjs';
