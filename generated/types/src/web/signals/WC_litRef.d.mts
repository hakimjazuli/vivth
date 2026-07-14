import { Signal } from '../../class/Signal.mjs';
import type { RefDirective } from 'lit-html/directives/ref.js';
import type { DirectiveResult } from 'lit-html/directive.js';
/**
 * @import {Ref, RefDirective,} from 'lit-html/directives/ref.js'
 * @import {DirectiveResult} from 'lit-html/directive.js'
 */
/**
 * @description
 * - signal to get element reference on lit render;
 * - warning, this class relies on creating macro task to trick lit-html render ref to get the `Element` reference, it might not be too accurate;
 * @template {Element} EL
 * @extends {Signal<EL|undefined>}
 */
export declare class WC_litRef<EL extends Element> extends Signal<EL | undefined> {
    #private;
    /**
     * @description
     */
    constructor();
    /**
     * @returns {DirectiveResult<typeof RefDirective>}
     */
    get ref(): DirectiveResult<typeof RefDirective>;
    onDisconnected: () => void;
    /**
     * @override
     * @returns {EL|undefined}
     */
    get value(): EL | undefined;
    /**
     * @type {EL|undefined}
     * @override
     */
    set value(_: EL | undefined);
}
