// @ts-check

import { watch } from 'chokidar';

import { Paths } from './Paths.mjs';
import { Signal } from './Signal.mjs';
import { SafeExit } from './SafeExit.mjs';
import { QChannel } from './QChannel.mjs';
import { Effect } from './Effect.mjs';
import { TryAsync } from '../function/TryAsync.mjs';
import { WalkThrough } from './WalkThrough.mjs';
import { LazyFactory } from '../function/LazyFactory.mjs';
import { Console } from './Console.mjs';

/**
 * @typedef {import('../typehints/VivthCleanup.mjs').VivthCleanup} VivthCleanup
 */

/**
 * @description
 * - class helper for chokidar abstraction to watch and iterate paths;
 * - this class assume `Paths` and `SafeExit` to be instantiated;
 * @template {any} PASSEDVALUE
 * @implements {VivthCleanup}
 */
export class FSDirArchWatcher {
	/**
	 * @type {QChannel<string|FSDirArchWatcher<any>>}
	 */
	#q = LazyFactory(() => new QChannel('FSDirArchWatcher'));
	/**
	 * @description
	 * - callback to handle each path;
	 * @type {(
	 *  eventName: import('chokidar/handler.js').EventName,
	 *  path: import('chokidar/handler.js').Path,
	 *  stats?: import('node:fs').Stats,
	 *  ) => Promise<PASSEDVALUE>
	 * }
	 */
	eachHandler;
	/**
	 * @description
	 * - callback to handle all registered path;
	 * - debounced to only handle last changes on full registry with:
	 * >- `options.debounce`;
	 * >- `QChannel` `isLastOnQ`;
	 * @type {(
	 * 		alphabeticallySortedSharedValue: {
	 * 			map: Map<string, PASSEDVALUE>,
	 * 			array: Array<[path: string, PASSEDVALUE]>,
	 * 		}
	 * 	) => Promise<void>
	 * }
	 */
	fullHandler;
	/**
	 * @description
	 * @param {string[]} watchPaths
	 * @param {Object} options
	 * @param {FSDirArchWatcher<PASSEDVALUE>["eachHandler"]} options.each
	 * - throw to `ignore` OR `delete` path from the result passed to `.full`;
	 * @param {FSDirArchWatcher<PASSEDVALUE>["fullHandler"]} options.full
	 * @param {number} [options.debounce]
	 * - debounce on calling `fullHandler`;
	 * @param {import('chokidar').ChokidarOptions} [options.chokidarOptions]
	 * - `ChokidarOptions`;
	 * @example
	 * import { FSDirArchWatcher, IsSameFile } from "vivth/node";
	 *
	 * const settingFile = '/fsrouter.setting.mjs';
	 *
	 * new FSDirArchWatcher(['/routers/', '/fsrouter.setting.mjs'], {
	 * 	// debounce: 100,
	 * 	each: async (eventName, path, stats) => {
	 * 		// this callback is queued already;
	 * 		// path are already `Paths.normalized`;
	 * 		if(IsSameFile(path, settingFile)){
	 * 			// code;
	 * 		}
	 * 		switch (eventName) {
	 * 			case 'add':
	 * 			case 'change':
	 * 				// structure route here and return;
	 * 				// a throwed call, will delete from sharedMap;
	 * 				return {};
	 * 			default:
	 * 				// only for imperative handler when needed;
	 * 				// or you can just throw here;
	 * 				return {};
	 * 		}
	 * 		// only non throwed call of path is registered to sharedMap;
	 * 		// throwed call of path is unregistered from sharedMap;
	 * 	},
	 * 	full:async (sharedMap) => {
	 * 		// this callback is queued already;
	 * 		// loop through returned from loop then write to a file;
	 * 	},
	 * })
	 */
	constructor(
		watchPaths,
		{ chokidarOptions = undefined, each: eachHandler, full: fullHandler, debounce = 100 },
	) {
		const setOfWatchPath = new Set(watchPaths);
		WalkThrough.set(setOfWatchPath, (watchPath) => {
			const absolutePath = Paths.diskAbsolute(watchPath);
			if (setOfWatchPath.has(absolutePath)) {
				return;
			}
			setOfWatchPath.delete(watchPath);
			setOfWatchPath.add(absolutePath);
		});
		this.fullHandler = fullHandler;
		this.eachHandler = eachHandler;
		this.watcher = watch(Array.from(setOfWatchPath), chokidarOptions);
		this.#debounce = debounce;
		this.watcher.addListener('all', this.#eachHandler);
		SafeExit.instance?.addCallback(this.vivthCleanup);
	}

	vivthCleanup = async () => {
		SafeExit.instance?.removeCallback(this.vivthCleanup);
		this.watcher.removeAllListeners();
		await this.watcher.close();
		Console.log(
			{
				FSDirArchWatcher: 'watcher closed',
			},
			{ now: true },
		);
	};

	/**
	 * @type {Signal<Map<string, PASSEDVALUE>>}
	 */
	#mappedFilePaths = new Signal(new Map());

	/**
	 * @param {() => boolean} isLastOnQ
	 * @param {(signalInstance: any) => any} subscribe
	 * @param {(timeoutMS?: number | undefined) => Promise<boolean>} isLastCalled
	 * @returns
	 */
	#mappedFilePathsHandlerQ = async (isLastOnQ, subscribe, isLastCalled) => {
		const originalMap = subscribe(this.#mappedFilePaths).value;
		if (!isLastOnQ() || !(await isLastCalled(this.#debounce))) {
			return;
		}
		const array = [...originalMap.entries()].sort(([a], [b]) => a.localeCompare(b));
		/**
		 * @type {Map<string, PASSEDVALUE>}
		 */
		const map = new Map(array);
		await this.fullHandler({ map, array });
	};

	// @ts-expect-error
	#mappedFilePathsHandler = new Effect(async ({ isLastCalled, subscribe }) => {
		this.#q.callback(this, async ({ isLastOnQ }) => {
			await this.#mappedFilePathsHandlerQ(isLastOnQ, subscribe, isLastCalled);
		});
	});

	/**
	 * @type {ConstructorParameters<typeof FSDirArchWatcher<PASSEDVALUE>>[1]["debounce"]}
	 */
	#debounce;

	/**
	 * @param {()=>boolean} isLastOnQ
	 * @param {import('chokidar/handler.js').EventName} eventName
	 * @param {import('chokidar/handler.js').Path} path
	 * @param {import('node:fs').Stats} [stats]
	 */
	#eachHandlerQ = async (isLastOnQ, eventName, path, stats) => {
		if (!isLastOnQ()) {
			return;
		}
		switch (eventName) {
			case 'add':
			case 'change':
				{
					if (
						/**
						 * - only MARKED file PATH;
						 */
						!stats ||
						!stats.isFile()
					) {
						return;
					}
					/**
					 * - outside notify, as to be awaited by `QChannel.callback`
					 */
					const [shared, errorCallingEachHandler] = await TryAsync(async () => {
						return await this.eachHandler(eventName, path, stats);
					});
					this.#mappedFilePaths.subscribers.notify(async ({ signalInstance }) => {
						if (errorCallingEachHandler) {
							signalInstance.value.delete(path);
							return;
						}
						signalInstance.value.set(path, shared);
					});
				}
				break;
			default:
				{
					if (
						/**
						 * - only handle MARKED PATH;
						 * - which in this case must be a file that no longer exist;
						 * - and not a dir;
						 */
						!this.#mappedFilePaths.value.has(path)
					) {
						return;
					}
					/**
					 * - outside notify, as to be awaited by `QChannel.callback`
					 */
					await TryAsync(async () => {
						await this.eachHandler(eventName, path, stats);
					});
					this.#mappedFilePaths.subscribers.notify(async ({ signalInstance }) => {
						signalInstance.value.delete(path);
					});
				}
				break;
		}
	};

	/**
	 * @param {import('chokidar/handler.js').EventName} eventName
	 * @param {import('chokidar/handler.js').Path} path
	 * @param {import('node:fs').Stats} [stats]
	 * @returns {void}
	 */
	#eachHandler = (eventName, path, stats) => {
		path = Paths.normalize(path);
		this.#q.callback(path, async ({ isLastOnQ }) => {
			await this.#eachHandlerQ(isLastOnQ, eventName, path, stats);
		});
	};
}
