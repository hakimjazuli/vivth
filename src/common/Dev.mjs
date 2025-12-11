// @ts-check

import { Console } from '../class/Console.mjs';
import { Effect } from '../class/Effect.mjs';
import { Signal } from '../class/Signal.mjs';
import { LazyFactory } from '../function/LazyFactory.mjs';
import { TryAsync } from '../function/TryAsync.mjs';
import { Trace } from './Trace.mjs';

/**
 * @typedef {import("../types/VivthDevCodeBlockStringType.mjs").VivthDevCodeBlockStringType} VivthDevCodeBlockStringType
 * @typedef {import('../types/DevTestCB.mjs').DevTestCB} DevTestCB
 */

/**
 * @description
 * - class helper for `devTime` only code block;
 */
export class Dev {
	/**
	 * @description
	 * - persistent variable(during `devTime` and `bundled`);
	 * - can be used as `condition` for checking whether it is in `devTime` or `bundled`;
	 * @type {boolean}
	 * @example
	 * import { Dev } from 'vivth';
	 *
	 * if (Dev.isDev) {
	 * 	// this code block will presist even on `bundled`;
	 * }
	 */
	static isDev = true;
	/**
	 * @type {Signal<Map<string,Awaited<ReturnType<typeof TryAsync<boolean>>>>>}
	 */
	static #notifications = LazyFactory(() => new Signal(new Map()));
	/**
	 * @type {DevTestCB}
	 */
	static #test = async (testName, testCallback) => {
		testName = `${testName}:'${Trace(4)}'`;
		Dev.#notifications.subscribers.notify(async ({ signalInstance }) => {
			signalInstance.value.set(
				testName,
				await TryAsync(async () => {
					return await testCallback();
				})
			);
		});
		Dev.#effectForCheck['vivth:unwrapLazy;']();
		return {
			removeId: () => {
				Dev.#notifications.subscribers.notify(async ({ signalInstance }) => {
					signalInstance.value.delete(testName);
				});
			},
		};
	};
	static #effectForCheck = LazyFactory(
		() =>
			new Effect(async ({ isLastCalled, subscribe }) => {
				const notifications = subscribe(Dev.#notifications).value;
				if (!(await isLastCalled(100)) || !notifications.size) {
					return;
				}
				/**
				 * @type {string[]}
				 */
				const succeedTest = [];
				/**
				 * @type {string[]}
				 */
				const failedTest = [];
				for (const [notificationID, [isCorrect, error]] of notifications) {
					if (error || !isCorrect) {
						failedTest.push(notificationID);
						continue;
					}
					succeedTest.push(notificationID);
				}
				const size = notifications.size;
				/**
				 * @type {{
				 * testCount:number,
				 * succeed?: {count:string, testID:string[]},
				 * failed?: {count:string, testID:string[]},
				 * }}
				 */
				let warn = { testCount: size };
				if (succeedTest.length) {
					warn.succeed = {
						count: `${succeedTest.length} of ${size}`,
						testID: succeedTest,
					};
				}
				if (failedTest.length) {
					warn.failed = {
						count: `${failedTest.length} of ${size}`,
						testID: failedTest,
					};
				}
				Console.warn(warn);
			})
	);
	/**
	 * @description
	 * - to wrap `devTime` only code block;
	 * - when bundled uses `EsBundler` or esbuild with `ToBundledJSPlugin` plugin, the code block will be removed on the bundled version;
	 * @param {(options:{test:DevTestCB})=>Promise<void>} callback
	 * - also provide `test` method for inline testing:
	 * >- which is wrapped in `TryAsync`, throwed errors will automatically return `false`;
	 * @param {VivthDevCodeBlockStringType} _closing
	 * - it is needed to detect the code block closing;
	 * - should use single or double quote and not back tick;
	 * @returns {Promise<void>}
	 * @example
	 * import { Dev, Signal } from 'vivth';
	 *
	 * Dev.vivthDevCodeBlock(async function () {
	 * 	// this code block will be removed on `bundled` version;
	 * }, 'vivthDevCodeBlock');
	 *
	 * const numberSignal = new Signal(0);
	 * Dev.vivthDevCodeBlock(async ({ test }) => {
	 * 	// this code block will be removed on `bundled` version;
	 * 	const [{ removeId: removeTest }] = await Promise.all([
	 * 		test(async () => numberSignal.value === 0)
	 * 	])
	 * }, 'vivthDevCodeBlock');
	 */
	static vivthDevCodeBlock = async (callback, _closing) => {
		if (
			/**
			 * just in case Bundler doesn't properly clearup `vivthDevCodeBlock`
			 */
			!Dev.isDev
		) {
			return;
		}
		await callback({ test: Dev.#test });
	};
}
