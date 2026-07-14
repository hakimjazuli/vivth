// @ts-check

import { extname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { watch } from 'chokidar';

import { EventSignal } from '../class/EventSignal.mjs';
import { Paths } from '../class/Paths.mjs';
import { TryAsync } from '../function/TryAsync.mjs';
import { SafeExit } from '../class/SafeExit.mjs';
import { QChannel } from '../class/QChannel.mjs';
import { LazyFactory } from '../function/LazyFactory.mjs';
import { Console } from '../class/Console.mjs';
import { ForOfSync } from '../function/ForOfSync.mjs';
import { TsToMjs } from '../function/TsToMjs.mjs';
import { Preferrence } from '../common/Preferrence.mjs';
import { ObjectRegistrar } from '../function/ObjectRegistrar.mjs';
import { Signal } from '../class/Signal.mjs';
import { Effect } from '../class/Effect.mjs';
import { Derived } from '../class/Derived.mjs';
import { TracePath } from '../common/TracePath.mjs';
import { SafeImport } from '../function/SafeImport.mjs';
import { IsInstanceOf } from '../function/IsInstanceOf.mjs';
import { IsTypeOf } from '../function/IsTypeOf.mjs';
/**
 * @typedef {import('../bundler/FileSelfMapper.mjs').VivthCleanup} VivthCleanup
 */
/**
 * @description
 * - alternative to `neinth`;
 * @template {any} EXPORT
 * @implements {VivthCleanup}
 */
export class VivthyNeinth {
	/**
	 * @type {QChannel<string>}
	 */
	static #q = LazyFactory(() => new QChannel('VivthyNeinth singleton Q'));
	static #hasStarted = false;
	/**
	 * @type {Map<string, VivthyNeinth<any>>}
	 */
	static #mappedInstance = new Map();
	/**
	 * @type {Parameters<typeof VivthyNeinth["start"]>[0]["assemblyScriptOptions"]}
	 */
	static #assemblyScriptOptions;
	/**
	 * @description
	 * - DO NOT CALL THIS METHOD INSIDE
	 * @param {Object} options
	 * @param {string} options.dirPath
	 * @param {import('../typehints/AutoDocASOptions.mjs').AutoDocASOptions} [options.assemblyScriptOptions]
	 * @returns {ReturnType<typeof TryAsync<void>>}
	 */
	static start = async ({ dirPath, assemblyScriptOptions = {} }) => {
		return await TryAsync(async () => {
			if (VivthyNeinth.#hasStarted) {
				Console.error(
					{
						'VivthyNeinth.start': 'is a singleton method',
						message: 'calling singleton method will not trigger rerun',
					},
					{ now: true },
				);
				return;
			}
			VivthyNeinth.#hasStarted = true;
			VivthyNeinth.#assemblyScriptOptions = assemblyScriptOptions;
			dirPath = Paths.diskAbsolute(dirPath);
			const watcher = watch(dirPath);
			Console.log(`'VivthyNeinth.start' begining to watch:'${dirPath}'`, { now: true });
			watcher.addListener('all', VivthyNeinth.#watcherListener);
			const vivthCleanup = async () => {
				SafeExit.instance?.removeCallback(vivthCleanup);
				watcher.removeAllListeners();
				await watcher.close();
			};
			SafeExit.instance?.addCallback(vivthCleanup);
		});
	};

	/**
	 * @param {import('chokidar/handler.js').EventName} eventName
	 * @param {string} path
	 * @param {import('node:fs').Stats} [stats]
	 */
	static #watcherListenerQ = async (eventName, path, stats) => {
		switch (eventName) {
			case 'add':
			case 'change':
				if (!stats || !stats.isFile()) {
					return;
				}
				await VivthyNeinth.#addListener(eventName, path, stats);
				break;
			default:
				await VivthyNeinth.#negativeListener(eventName, path, stats);
				break;
		}
	};
	/**
	 * @param {import('chokidar/handler.js').EventName} eventName
	 * @param {string} path
	 * @param {import('node:fs').Stats} [stats]
	 * @returns {void}
	 */
	static #watcherListener = (eventName, path, stats) => {
		path = Paths.diskAbsolute(path);
		VivthyNeinth.#q.callback(path, async () => {
			await VivthyNeinth.#watcherListenerQ(eventName, path, stats);
		});
	};

	/**
	 * @param {'add'|'change'} _eventName
	 * @param {string} path
	 * @param {import('node:fs').Stats} [_stats]
	 * @returns {Promise<void>}
	 */
	static #addListener = async (_eventName, path, _stats) => {
		const fileExt = extname(path);
		switch (fileExt) {
			case '.ts':
			case '.mts':
				return await TsToMjs(path, {
					encoding: Preferrence.encoding,
					assemblyScriptOptions: VivthyNeinth.#assemblyScriptOptions,
				});
			case '.mjs':
				break;
			default:
				return;
		}
		/**
		 * @type {ReturnType<typeof TryAsync<any|VivthyNeinth<any>>>}
		 */
		const res = TryAsync(async () => {
			return (
				/**
				 * - first check with the `baseNameNoExt` export;
				 * - `default` for fallback;
				 */
				// @ts-expect-error
				(await SafeImport(path))[0].default
			);
		});
		if (!res) {
			return;
		}
		const [newModule, errorSafeImport] = await res;
		await VivthyNeinth.#ifPrevInstanceExistThenCleanup_(path);
		if (IsInstanceOf(newModule, VivthyNeinth)) {
			await newModule.#register();
			return;
		}
		if (errorSafeImport) {
			Console.error({ errorSafeImport }, { now: true });
			return;
		}
	};

	/**
	 * @param {string} _eventName
	 * @param {string} path
	 * @param {import('node:fs').Stats} [_stats]
	 * @returns {Promise<void>}
	 */
	static #negativeListener = async (_eventName, path, _stats) => {
		await VivthyNeinth.#ifPrevInstanceExistThenCleanup_(path);
		const { dispatcher } = await EventSignal.get(path);
		dispatcher.value = undefined;
	};

	/**
	 * @param {Object} options
	 * @param {(this:VivthyNeinth<EXPORT>, arg0:VivthyNeinth<EXPORT>)=>Promise<EXPORT>} options.export
	 * @param {boolean} [options.I__the_developer__have_provided_onFileMutations_cleanupCallbacks_for_every_long_running_object_in_this_file]
	 */
	constructor({
		export: exportCallback,
		I__the_developer__have_provided_onFileMutations_cleanupCallbacks_for_every_long_running_object_in_this_file = false,
	}) {
		if (new.target !== VivthyNeinth) {
			throw new Error('This class cannot be extended');
		}
		const [letter, path] = (
			TracePath((path) => {
				return !path.includes(Paths.normalize(fileURLToPath(import.meta.url)));
			}) ?? ''
		).split(':');
		this.path = [letter, path].join(':');
		this.#allowToRegister =
			I__the_developer__have_provided_onFileMutations_cleanupCallbacks_for_every_long_running_object_in_this_file;
		this.#export = exportCallback;
	}

	#allowToRegister;

	/**
	 * @type {ConstructorParameters<typeof VivthyNeinth<EXPORT>>[0]["export"]}
	 */
	#export;

	/**
	 * @type { string }
	 */
	path;
	/**
	 * @returns {Promise<EventSignal<EXPORT|undefined>>}
	 */
	#import = async () => {
		const path = this.path;
		return await EventSignal.get(path);
	};

	/**
	 * @description
	 * - use this to update export value;
	 * - `WARNING`: this instance setter are accesible from outside, including importer;
	 * >- usefull for treating `VivthyNeinth` instance as global signal;
	 * >- you can accidentally ;
	 * @param {EXPORT|undefined} newExportValue
	 * @example
	 */
	set exportedValue(newExportValue) {
		this.#import().then(({ dispatcher }) => {
			dispatcher.value = newExportValue;
		});
	}

	/**
	 * @description
	 * - use this to listen to dependency changes(inside `Effect`);
	 * @returns {Promise<Derived<EXPORT|undefined>>}
	 * @example
	 */
	get listener() {
		return this.#import().then(({ listener }) => {
			return listener;
		});
	}

	/**
	 * @param {string} path
	 * @returns {Promise<void>}
	 */
	static #ifPrevInstanceExistThenCleanup_ = async (path) => {
		const prev = VivthyNeinth.#mappedInstance.get(path);
		if (!prev) {
			return;
		}
		await prev.vivthCleanup();
	};

	/**
	 * @description
	 * - generate autoCleaned `Signal` instance;
	 * @example
	 * /// on VivthyNeinth callback scope
	 * const { newSignal } = this;
	 * const numberSignal = newSignal(1);
	 * ///
	 */
	newSignal = ObjectRegistrar(
		/**
		 * @template {any} A
		 * @param {A} obj
		 * @returns {Signal<A>}
		 */
		(obj) => {
			const signalInstance = new Signal(obj);
			this.onMutate(async () => {
				signalInstance.remove.ref();
			});
			return signalInstance;
		},
	);

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
	newEffect = ObjectRegistrar(
		/**
		 * @param {ConstructorParameters<typeof Effect>[0]} callback
		 * @returns {Effect}
		 */
		(callback) => {
			const effectInstance = new Effect(callback);
			this.onMutate(async () => {
				effectInstance.options.removeEffect();
			});
			return effectInstance;
		},
	);

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
	newDerived = ObjectRegistrar(
		/**
		 * @template {ConstructorParameters<typeof Derived>[0]} CB
		 * @param {CB} callback
		 * @returns {Derived<ReturnType<CB>>}
		 */
		(callback) => {
			const derivedInstance = new Derived(callback);
			this.onMutate(async () => {
				derivedInstance.remove.ref();
			});
			// @ts-expect-error
			return derivedInstance;
		},
	);

	/**
	 * @type {Set<()=>Promise<void>>}
	 */
	#onCleanups = new Set();

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
	onMutate = (callback) => {
		this.#onCleanups.add(callback);
		this.onExit(callback);
	};

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
	onExit = (callback) => {
		const handler = SafeExit.instance?.addCallback(callback);
		if (!handler) {
			return;
		}
		this.#onCleanups.add(
			// @ts-expect-error
			handler.removeCallback,
		);
	};

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
	registerObjectWithAutoCleanup(obj) {
		if ('vivthCleanup' in obj && IsTypeOf(obj.vivthCleanup, 'function')) {
			/**
			 * - this is not `VivthyNeinth` instance
			 */
			this.onMutate(obj.vivthCleanup);
		} else {
			throw {
				VivthyNeinthPath: this.path,
				obj,
				registerObjectCleanupCall: 'obj has no `vivthCleanup`',
			};
		}
		return obj;
	}

	/**
	 * @returns {Promise<void>}
	 */
	vivthCleanup = async () => {
		await Promise.all(
			ForOfSync(this.#onCleanups, async (cb) => {
				this.#onCleanups.delete(cb);
				await cb();
			})[0],
		);
	};

	/**
	 * @returns {boolean}
	 */
	#checkIfAllowedToBeRegistered = () => {
		if (this.#allowToRegister) {
			return true;
		}
		Console.warn(
			{
				VivthyNeinthInstancePath: this.path,
				I__the_developer__have_provided_onFileMutations_cleanupCallbacks_for_every_long_running_object_in_this_file:
					this.#allowToRegister,
				message: [
					'Developer must provide cleanup callbacks for long-running objects on file mutations',
					'then set `options.exportCallback.I__the_developer__have_provided_onFileMutations_cleanupCallbacks_for_every_long_running_object_in_this_file` to `true`',
				],
			},
			{ now: true },
		);
		return false;
	};
	/**
	 * @returns {Promise<void>}
	 */
	#register = async () => {
		if (!this.#checkIfAllowedToBeRegistered()) {
			return;
		}
		VivthyNeinth.#mappedInstance.set(this.path, this);
		const [exportValue, { dispatcher }] = await Promise.all([
			this.#export.call(this, this),
			this.#import(),
		]);
		dispatcher.value = exportValue;
	};
}
