// @ts-check

import { Console } from '../class/Console.mjs';
import { Derived } from '../class/Derived.mjs';
import { Effect } from '../class/Effect.mjs';
import { Signal } from '../class/Signal.mjs';
import { ForOfSync } from '../function/ForOfSync.mjs';
import { LazyFactory } from '../function/LazyFactory.mjs';
import { TryAsync } from '../function/TryAsync.mjs';
import { FactoryKey } from './FactoryKey.mjs';
import { TracePath } from './TracePath.mjs';

/**
 * @typedef {import('../typehints/EnvModeType.mjs').EnvModeType} EnvModeType
 * @typedef {import('../typehints/DevTestCB.mjs').DevTestCB} DevTestCB
 */

/**
 * @description
 * - class helper for determining environtment mode to be `developement` or `production`;
 */
export class EnvMode {
	/**
	 * @type {Signal<EnvModeType>}
	 */
	// @ts-expect-error
	static #mode = LazyFactory(() => new Signal('dev'));
	/**
	 * @description
	 * - `Derived` wrapper of whether is in `dev` mode or `prod` not;
	 * >- for listener only;
	 * @type {Derived<EnvModeType>}
	 * @example
	 * import { EnvMode, Effect } from 'vivth/neutral';
	 *
	 * console.log(EnvMode.mode.value); // default: 'dev'
	 *
	 * // listeneing to changes;
	 * new Effect(async({ subscribe }) => {
	 * 	const mode = subscribe(EnvMode.mode).value;
	 * 	// code
	 * })
	 */
	static mode = LazyFactory(() => {
		return new Derived(async ({ subscribe }) => {
			return subscribe(EnvMode.#mode).value;
		});
	});
	/**
	 * @description
	 * - enforce development or production mode;
	 * - DO NOT EXPOSE THIS API TO UNSECURED ACCESS, DIRECTLY NOR INDIRECTLY;
	 * @param {EnvModeType} mode
	 * @returns {void}
	 * @example
	 * import { EnvMode } from 'vivth/neutral';
	 *
	 * EnvMode.enforce('dev'); // OR
	 * EnvMode.enforce('prod');
	 */
	static enforce = (mode) => {
		switch (mode) {
			case 'dev':
			case 'prod':
				EnvMode.#mode.value = mode;
				break;
			default:
				EnvMode.#mode.value = 'prod';
				break;
		}
	};
	/**
	 * @type {Signal<Map<string,Awaited<ReturnType<typeof TryAsync<boolean>>>>>}
	 */
	static #notifications = LazyFactory(() => new Signal(new Map()));

	/**
	 * @type {DevTestCB}
	 */
	static #test = (testName, testCallback) => {
		testName = `${testName}:'${TracePath((path) => {
			return !path.includes('vivth/src/common/EnvMode.mjs');
		})}'`;
		EnvMode.#notifications.subscribers.notify(async ({ signalInstance }) => {
			signalInstance.value.set(
				testName,
				await TryAsync(async () => {
					return await testCallback();
				}),
			);
		});
		EnvMode.#effectForCheck[FactoryKey];
		return {
			removeId: () => {
				EnvMode.#notifications.subscribers.notify(async ({ signalInstance }) => {
					signalInstance.value.delete(testName);
				});
			},
		};
	};

	static #effectForCheck = LazyFactory(
		() =>
			new Effect(async ({ subscribe }) => {
				const notifications = subscribe(EnvMode.#notifications).value;
				const testCount = notifications.size;
				if (!testCount) {
					return;
				}
				/**
				 * @type {Set<string>}
				 */
				const succeedTests = new Set();
				/**
				 * @type {Set<string>}
				 */
				const failedTests = new Set();
				ForOfSync(notifications, ([notificationID, [isCorrect, error]]) => {
					if (error || isCorrect !== true) {
						failedTests.add(notificationID);
						return;
					}
					succeedTests.add(notificationID);
				});
				/**
				 * @type {{
				 * testCount:number,
				 * succeed?: {count:string, testIDs:Set<string>},
				 * failed?: {count:string, testIDs:Set<string>},
				 * }}
				 */
				let warn = { testCount };
				if (succeedTests.size) {
					warn.succeed = {
						count: `${succeedTests.size} of ${testCount}`,
						testIDs: succeedTests,
					};
				}
				if (failedTests.size) {
					warn.failed = {
						count: `${failedTests.size} of ${testCount}`,
						testIDs: failedTests,
					};
				}
				Console.warn(warn);
			}),
	);
	/**
	 * @description
	 * @param {(options:{devTest:DevTestCB}|
	 * {devTest:undefined})=>Promise<void>
	 * } callback
	 * - when on `dev` mode also provide `test` method for inline testing:
	 * >- which is wrapped in `TryAsync`, throwed errors will automatically return `false`;
	 * - for smaller bundle size, you can wrap the `devTest` with `BundleV.vivthUnBundledCodeBlock`;
	 * @param {Effect["options"]["subscribe"]} [subscribe]
	 * - optional whether to scope the callback into an `Effect`;
	 * @returns {Promise<void>}
	 */
	static async codeBlock(callback, subscribe = undefined) {
		/**
		 * @type {EnvModeType|undefined}
		 */
		let mode;
		if (!subscribe) {
			mode = EnvMode.#mode.value;
		} else {
			mode = subscribe(EnvMode.#mode).value;
		}
		await callback(mode === 'dev' ? { devTest: EnvMode.#test } : { devTest: undefined });
	}
}
