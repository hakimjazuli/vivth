import { TryAsync } from '../function/TryAsync.mjs';
import { Signal } from '../class/Signal.mjs';
import { Effect } from '../class/Effect.mjs';
import { Derived } from '../class/Derived.mjs';
export type VivthCleanup = import('../bundler/FileSelfMapper.mjs').VivthCleanup;
/**
 * @typedef {import('../bundler/FileSelfMapper.mjs').VivthCleanup} VivthCleanup
 */
/**
 * @description
 * - alternative to `neinth`;
 * @template {any} EXPORT
 * @implements {VivthCleanup}
 */
export declare class VivthyNeinth<EXPORT extends any> implements VivthCleanup {
    #private;
    /**
     * @description
     * - DO NOT CALL THIS METHOD INSIDE
     * @param {Object} options
     * @param {string} options.dirPath
     * @param {import('../typehints/AutoDocASOptions.mjs').AutoDocASOptions} [options.assemblyScriptOptions]
     * @returns {ReturnType<typeof TryAsync<void>>}
     */
    static start: ({ dirPath, assemblyScriptOptions }: {
        dirPath: string;
        assemblyScriptOptions?: import('../typehints/AutoDocASOptions.mjs').AutoDocASOptions;
    }) => ReturnType<typeof TryAsync<void>>;
    /**
     * @param {Object} options
     * @param {(this:VivthyNeinth<EXPORT>, arg0:VivthyNeinth<EXPORT>)=>Promise<EXPORT>} options.export
     * @param {boolean} [options.I__the_developer__have_provided_onFileMutations_cleanupCallbacks_for_every_long_running_object_in_this_file]
     */
    constructor({ export: exportCallback, I__the_developer__have_provided_onFileMutations_cleanupCallbacks_for_every_long_running_object_in_this_file, }: {
        export: (this: VivthyNeinth<EXPORT>, arg0: VivthyNeinth<EXPORT>) => Promise<EXPORT>;
        I__the_developer__have_provided_onFileMutations_cleanupCallbacks_for_every_long_running_object_in_this_file?: boolean;
    });
    /**
     * @type { string }
     */
    path: string;
    /**
     * @description
     * - use this to update export value;
     * - `WARNING`: this instance setter are accesible from outside, including importer;
     * >- usefull for treating `VivthyNeinth` instance as global signal;
     * >- you can accidentally ;
     * @param {EXPORT|undefined} newExportValue
     * @example
     */
    set exportedValue(newExportValue: EXPORT | undefined);
    /**
     * @description
     * - use this to listen to dependency changes(inside `Effect`);
     * @returns {Promise<Derived<EXPORT|undefined>>}
     * @example
     */
    get listener(): Promise<Derived<EXPORT | undefined>>;
    /**
     * @description
     * - generate autoCleaned `Signal` instance;
     * @example
     * /// on VivthyNeinth callback scope
     * const { newSignal } = this;
     * const numberSignal = newSignal(1);
     * ///
     */
    newSignal: <A extends unknown>(obj: A) => Signal<A>;
    /**
     * @description
     * - generate autoCleaned `Effect` instance;
     * @example
     * /// on VivthyNeinth callback scope
     * const { newEffect } = this;
     * const numberSignal = newSignal(1);
     * const effer = newEffect(async({subscribe})=>{
     * 	const numberSignalValue = subscribe(numberSignal).value;
     * });
     * ///
     */
    newEffect: (callback: (arg0: Effect["options"]) => Promise<void>) => Effect;
    /**
     * @description
     * - generate autoCleaned `Derived` instance;
     * @example
     * /// on VivthyNeinth callback scope
     * const { newDerived } = this;
     * const effer = newDerived(async({subscribe})=>{
     * 	const numberSignalValue = subscribe(numberSignal).value;
     * 	return numberSignalValue * 2;
     * });
     * ///
     */
    newDerived: <CB extends ConstructorParameters<typeof Derived>[0]>(callback: CB) => Derived<ReturnType<CB>>;
    /**
     * @description
     * - manually registering object celeanup;
     * @param {()=>Promise<void>} callback
     * @returns {void}
     * @example
     * import { watch } from 'chokidar';
     *
     * /// on VivthyNeinth export callback scope
     * const watcher = watch('D://my/dir/path');
     * // preferably to declare the cleanup right bellow it's object creation;
     * // set 'I__the_developer__have_provided_onFileMutations_cleanupCallbacks_for_every_long_running_object_in_this_file' to false if you might want to save before full cleanup is written;
     * this.onMutate(async () => {
     * 	watcher.removeAllListeners();
     * 	watcher.close();
     * });
     *
     * watcher.addListener('all', (eventName, path, stats) => {
     * 	//
     * })
     * ///
     * // alternative: use vivth `modules` that returns object that implements `VivthCleanup`;
     * // and call uses `registerObjectWithAutoCleanup`;
     */
    onMutate: (callback: () => Promise<void>) => void;
    /**
     * @description
     * - process SafeExit;
     * @param {()=>Promise<void>} callback
     * @returns {void}
     * @example
     * import { Console } from 'vivth/neutral';
     *
     * /// on VivthyNeinth export callback scope
     * this.onExit(async()=>{
     * 	Console.log('main process ends');
     * })
     * ///
     */
    onExit: (callback: () => Promise<void>) => void;
    /**
     * @description
     * - register premade cleanup `vivthCleanup` method to `VivthyNeinth` lifecycle;
     * @template {Object} OBJ
     * @param { OBJ & VivthCleanup } obj
     * @returns {OBJ}
     * @example
     * import { EsWatcher } from "vivth/node";
     *
     * /// on VivthyNeinth export callback scope
     * const esWatcherInstance = this.registerObjectWithAutoCleanup(new EsWatcher({
     * 	...buildOptions,
     * }));
     * ///
     */
    registerObjectWithAutoCleanup<OBJ extends Object>(obj: OBJ & VivthCleanup): OBJ;
    /**
     * @returns {Promise<void>}
     */
    vivthCleanup: () => Promise<void>;
}
