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
export declare class Wails3Listener implements VivthCleanup {
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
     * - unlike `wails3` standard emit event listener, this class meant to listen to single `eventName`(`emitter:updated_datas`), with light weight `string[]` `message`(internally handled by this class);
     * - it is usefull for getter setter pattern, meaning the message should only contains what data on the backends is updated, then you can just call getter `Service` for that particullar name;
     * @param {string} listenToFORMNotifName
     * - `// FORM` will notify names go as array of string via `*EmitterInstance`;
     * - `listenToFORMNotifName` is to listen to one specific string value, then you can run a callback;
     * @param {()=>Promise<void>} handler
     * @example
     * import { Wails3Listener } from 'vivth/neutral';
     * import { MyIPC } from '../wails/go/App.js'
     * const myListener = new Wails3Listener('users', async () => {
     * 	const res = await MyIPC();
     * });
     * // when no longer needed, eg. element is disconnected;
     * myListener.vivthCleanup();
     */
    constructor(listenToFORMNotifName: string, handler: () => Promise<void>);
    /**
     * @description
     * - prepare class for standard definitions;
     * - you need to call this callback before using this class;
     * @type {()=>void}
     * @example
     * import { Wails3Listener } from 'vivth/neutral';
     * Wails3Listener.prepare();
     */
    static prepare: () => void;
}
