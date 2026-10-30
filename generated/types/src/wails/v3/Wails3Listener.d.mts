export type VivthCleanup = import('../../typehints/VivthCleanup.mjs').VivthCleanup;
/**
 * @typedef {import('../../typehints/VivthCleanup.mjs').VivthCleanup} VivthCleanup
 */
/**
 * @description
 * - getter helper;
 * - `Wails3Dev` will generate `main_services.go`;
 * @implements {VivthCleanup}
 */
export declare class Wails2Listener implements VivthCleanup {
    #private;
    /**
     * @description
     * - when wrapped with vivth `WC_extends_instance.this.ON` this method is to auto cleaned;
     * - you can call this method manually on the framework element cleanup lifecycle;
     * @type {()=>Promise<void>}
     */
    vivthCleanup: () => Promise<void>;
    /**
     * @description
     * @param {string} listenToFORMNotifName
     * - `// FORM` will notify names go as array of string via `*EmitterInstance`;
     * - `listenToFORMNotifName` is to listen to one specific string value, then you can run a callback;
     * > - as of `wails3` they didn't expose `ipc`(now `Service`) with human readable name like on `wails2` so you could technically obfuscate it slightly better;
     * > - so this class is to help you wrap that `Service` bindings into your callback;
     * - multi instance listening to same name can run in parallel;
     * > - so different handler could pass different arguments;
     * @param {()=>Promise<void>} handler
     * @example
     * import { Wails2Listener } from 'vivth/browser';
     * import { MyIPC } from '../wails/go/App.js'
     * const myListener = new Wails2Listener('users', async () => {
     * 	const res = await MyIPC();
     * });
     * // when no longer needed, eg. element is disconnected;
     * myListener.vivthCleanup();
     */
    constructor(listenToFORMNotifName: string, handler: () => Promise<void>);
}
