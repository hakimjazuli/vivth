declare const Wails2Form_base: (new (...args: any[]) => HTMLFormElement & {
    setObservedAttributes(attributes: Partial<Record<never, string>>): void;
    props: {
        [x: string]: never;
    };
    adoptedCallback(): void;
    connectedCallback(): void;
    disonnectedCallback(): void;
    attributeChangedCallback(name: never, oldValue: string | null, newValue: string | null): void;
    ON: <OBJ extends Record<any, any> & {
        onConnected?: NonNullable<Parameters<InstanceType<any>["ON"]>[1]>["connected"];
        onDisconnected?: NonNullable<Parameters<InstanceType<any>["ON"]>[1]>["disconnected"];
        onAdopted?: NonNullable<Parameters<InstanceType<any>["ON"]>[1]>["adopted"];
        onAttributeChanged?: NonNullable<Parameters<InstanceType<any>["ON"]>[1]>["attributeChanged"];
    }>(obj: OBJ, callbacks?: {
        connected?: ((obj: OBJ) => void) | undefined;
        disconnected?: ((obj: OBJ) => void) | undefined;
        adopted?: ((obj: OBJ) => void) | undefined;
        attributeChanged?: ((obj: OBJ, name: never, oldValue: string | null, newValue: string | null) => void) | undefined;
    } | undefined) => OBJ;
}) & {
    tagName: string;
    extendIsValue: string;
    namedSlots: readonly string[] | undefined;
    observedAttributes: readonly string[] | undefined;
    createNamedSlot: (name: never, defaultNode?: import("lit-html").TemplateResult) => import("lit-html").TemplateResult;
    props?: Record<string, "bigint" | "boolean" | "function" | "number" | "object" | "string" | "symbol" | "undefined" | (new (...args: any[]) => any)> | undefined;
    define: <TAG extends string, CLASSREF extends {
        new (): HTMLFormElement;
        prototype: HTMLFormElement;
    } & {
        tagName: string;
        extendIsValue: string;
        observedAttributes?: readonly string[] | undefined;
        namedSlots?: readonly string[] | undefined;
        props?: Record<string, "bigint" | "boolean" | "function" | "number" | "object" | "string" | "symbol" | "undefined" | (new (...args: any[]) => any)> | undefined;
    }>(tagName: import("../../web/common/WC_TagName_type.mts").WC_TagName_type<TAG>, classRef: CLASSREF, elementDefinitionOptions?: ElementDefinitionOptions) => (param?: {
        attrs?: (CLASSREF["observedAttributes"] extends readonly string[] ? Partial<Record<import("../../typehints/ArrayToKeys.mts").ArrayToKeys<CLASSREF["observedAttributes"]>, string>> : undefined) | undefined;
        props?: { [K in keyof NonNullable<CLASSREF["props"]>]: NonNullable<CLASSREF["props"]>[K] extends "bigint" | "boolean" | "function" | "number" | "object" | "string" | "symbol" | "undefined" ? {
            string: string;
            number: number;
            boolean: boolean;
            object: {};
            function: () => void;
            undefined: undefined;
            symbol: symbol;
            bigint: bigint;
        }[NonNullable<CLASSREF["props"]>[K]] : NonNullable<CLASSREF["props"]>[K] extends abstract new (...args: any[]) => any ? InstanceType<NonNullable<CLASSREF["props"]>[K]> : never; } | undefined;
        children?: (CLASSREF["namedSlots"] extends readonly string[] ? (slotName: Record<import("../../typehints/ArrayToKeys.mts").ArrayToKeys<CLASSREF["namedSlots"]>, string>) => import("lit-html").TemplateResult : undefined) | undefined;
        renderOptions?: import("lit-html").RenderOptions;
    } | undefined) => InstanceType<CLASSREF>;
};
/**
 * @description
 * Custom `form[is="form-wails"]` element that handles submission by calling a specified Wails SETTER backend function;
 * passing form input fields as a JSON object string.
 * - applies to `form[is="form-wails"]`;
 * > - this class automatically bind the element with `Wails2OnSubmit` to it's `onsubmit`;
 * - `[setter]` value to target go wails ipc name;
 * > - it will call `window['go']['main']['App'][{setter.value}]` to your form inputs as `arg0`;
 * @example
 * import { Wails2Form } from 'vivth/browser';
 */
export declare class Wails2Form extends Wails2Form_base {
    constructor();
}
export {};
