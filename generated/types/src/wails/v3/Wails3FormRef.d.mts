/**
 * @type {Map<string, (...args: any[]) => Promise<any>>}
 */
export declare const wails3FormRefObjects: Map<string, (...args: any[]) => Promise<any>>;
/**
 * @description
 * helper collection to handle `// FORM` for `Wails3Listener`
 */
export declare class Wails3FormRef {
    /**
     * @description
     * - register handler for `Wails3OnSubmit` or `Wails3Form` to use
     * @param {string} name
     * @param {(...args:any)=>Promise<any>} handler
     * @example
     * import { Wails3FormRef } from 'vivth/neutral';
     * // need to target your actual wails3 generated service binding
     * import { MyGetter } from '../bindings/myProject/mygetterservice.ts';
     * Wails3FormRef.register('MyGetter', MyGetter);
     */
    static register(name: string, handler: (...args: any) => Promise<any>): void;
}
