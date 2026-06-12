/**
 * @description
 * - `Signal` to check parentComponent;
 * - automatically trigger check upon connectedCallback, by wrapping it with `this.ON` even without second argument;
 * - automatically trigger cleanup upon disconnectedCallback, by wrapping it with `this.ON` even without second argument;
 * @template {HTMLElement} TEMP
 * @extends {Signal<TEMP|undefined|null>}
 */
export class WC_parentComponentRef<TEMP extends HTMLElement> extends Signal<TEMP | null | undefined> {
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
