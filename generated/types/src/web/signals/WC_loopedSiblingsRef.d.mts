/**
 * @description
 * - `Signal` to check siblingIndex of a looped component;
 * - automatically trigger check upon connectedCallback, by wrapping it with `this.ON` even without second argument;
 * - automatically trigger cleanup upon disconnectedCallback, by wrapping it with `this.ON` even without second argument;
 * - assumption is all sibling element must be from same class `WebCompoent`;
 * ```html
 * <div>
 * 	<!-- looped <my-component></my-component> -->
 * 	<!-- looped <my-component></my-component> -->
 * 	<!-- looped <my-component></my-component> -->
 * 	<my-component></my-component>
 * 	<!-- looped <my-component></my-component> -->
 * 	<!-- looped <my-component></my-component> -->
 * </div>
 * ```
 * @extends {Signal<number|undefined>}
 */
export class WC_loopedSiblingsRef extends Signal<number | undefined> {
    /**
     * @param {HTMLElement} instanceRef
     */
    constructor(instanceRef: HTMLElement);
    /**
     * @description
     * - self auto register and cleanup when assigned with `ON` jut by passing empty object as second argument;
     * - the automatic part only works on `WC_extends${suffix}`;
     * >- the cleanup logic are infered by `WC_extends${suffix}` class inner behaviour;
     * - still need to be called manually if used outside `vivth/neutral` `WebComponent`;
     * @type {()=>void}
     */
    onConnected: () => void;
    /**
     * @description
     * - self auto register and cleanup when assigned with `ON` jut by passing empty object as second argument;
     * - the automatic part only works on `WC_extends${suffix}`;
     * >- the cleanup logic are infered by `WC_extends${suffix}` class inner behaviour;
     * - still need to be called manually if used outside `vivth/neutral` `WebComponent`;
     * @type {()=>void}
     */
    onDisconnected: () => void;
    #private;
}
import { Signal } from '../../class/Signal.mjs';
