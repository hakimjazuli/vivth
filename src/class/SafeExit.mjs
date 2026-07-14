// @ts-check

import process from 'node:process';
import { spawn } from 'node:child_process';

import { TryAsync } from '../function/TryAsync.mjs';
import { WalkThrough } from './WalkThrough.mjs';
import { Console } from './Console.mjs';
import { mapOfEffects } from './Effect.mjs';
import { setOFSignals } from './Signal.mjs';
import { ForOfSync } from '../function/ForOfSync.mjs';
import { QChannel } from './QChannel.mjs';
import { Paths } from './Paths.mjs';
import { FileSafe } from './FileSafe.mjs';
import { UniqueFSTempName } from '../function/UniqueFSTempName.mjs';
import { Preferrence } from '../common/Preferrence.mjs';
import { join } from 'node:path';

/**
 * @description
 * - class helper for describing how to Safely Response on exit events
 * - singleton;
 * - most of functionality might need to access `SafeExit.instance.exiting`, if you get warning, you can instantiate `SafeExit` before running anything;
 */
export class SafeExit {
	/**
	 * @type {QChannel<any>}
	 */
	#q = new QChannel('SafeExit');
	/**
	 * @description
	 * - only accessible after instantiation;
	 * @type {SafeExit|undefined}
	 */
	static instance;
	/**
	 * @type {Set<()=>Promise<void>>}
	 */
	safeCleanUpCBs = new Set();
	/**
	 * @description
	 * @param {...NodeJS.Signals} eventNames
	 * - `beforeExit` is auto included;
	 * - example:
	 * ```js
	 *  ['SIGINT', 'SIGTERM'] // both are automatically added
	 * ```
	 * @example
	 * import process from 'node:process';
	 * import { SafeExit } from 'vivth/node';
	 *
	 * new SafeExit('SIGINT', 'SIGTERM', ...eventNames);
	 */
	constructor(...eventNames) {
		if (SafeExit.instance instanceof SafeExit) {
			return SafeExit.instance;
		}
		SafeExit.instance = this;
		this.#register(eventNames);
	}

	/**
	 * @type {  undefined|import('node:child_process').ChildProcess }
	 */
	#childProcessHelper;

	/**
	 * @type {Parameters<QChannel<any>["callback"]>[1]}
	 */
	#mitigationQ = async ({ isLastOnQ }) => {
		if (
			/**  */
			!!this.#childProcessHelper ||
			!isLastOnQ()
		) {
			return;
		}
		const tempPath = UniqueFSTempName(
			Paths.diskAbsolute(join(Paths.root, '/vivth/src/safeExit-guard-with-bun.mjs')),
			'.mjs',
		);

		await FileSafe.write(
			tempPath,
			`import process from "node:process";process.title="close this terminal to emit 'SIGTERM' to main process at '${Paths.normalize(Paths.root)}'";`,
			{ encoding: Preferrence.encoding },
		);
		const proc = spawn(
			'bun',
			[
				/**  */
				'--watch',
				tempPath,
			],
			{
				cwd: Paths.root,
				stdio: 'ignore',
				detached: true,
			},
		);
		this.#childProcessHelper = proc;
		SafeExit.instance?.addCallback(async () => {
			proc.kill('SIGTERM');
		});
		process.once('exit', () => {
			proc.kill('SIGTERM');
		});
		ForOfSync(['exit', 'close'], (eventName) => {
			proc.once(eventName, () => {
				process.emit('SIGTERM');
				proc.kill('SIGTERM');
			});
		});
	};
	#exitMitigation = () => {
		this.#q.callback(this.#mitigationQ, this.#mitigationQ);
	};

	/**
	 * @param {...ConstructorParameters<typeof SafeExit>[0]} eventNames
	 * @returns {void}
	 */
	#register = (eventNames = []) => {
		eventNames.push(
			/**
			 * - `beforeExit` is necessary as sometimes `bun` might not listen to SIGNAL;
			 * - and then somehow `exit` is already called;
			 */
			// @ts-expect-error
			'beforeExit',
			'SIGINT',
			'SIGTERM',
		);
		const setOfEvents = new Set(eventNames);
		setOfEvents.delete(
			// @ts-expect-error
			'exit',
		);
		ForOfSync(setOfEvents, (eventName) => {
			this.#createListener(eventName);
		});
	};
	#hasExited = false;
	/**
	 * @type {(eventName:string)=>void}
	 */
	#createListener = (eventName) => {
		process.once(eventName, async () => {
			const [, errorCleanup] = await this.#q.callback(
				this.#createListener,
				async ({ isLastOnQ }) => {
					if (!isLastOnQ() || this.#hasExited) {
						return;
					}
					this.#hasExited = true;
					await this.#cleanup(eventName);
				},
			);
			if (!errorCleanup) {
				return;
			}
			Console.error({ errorCleanup }, { now: true });
		});
	};
	/**
	 * @description
	 * - `SafeExit` ${eventName}.Callback registration;
	 * - `onEventName` all callbacks are called simultanousely using `await Promise.all`;
	 * >- for sequential event you need to put them in a single callback;
	 * @param {()=>(Promise<void>)} safeExitCallback
	 * @returns {{removeCallback:()=>void}}
	 * @example
	 * import { SafeExit } from 'vivth/node';
	 *
	 * const exitCallback = async () => {
	 * 	// code
	 * }
	 * SafeExit.instance.addCallback(exitCallback);
	 */
	addCallback = (safeExitCallback) => {
		this.#exitMitigation();
		this.safeCleanUpCBs.add(safeExitCallback);
		return {
			removeCallback: () => {
				this.removeCallback(safeExitCallback);
			},
		};
	};
	/**
	 * @description
	 * - optional exit event removal;
	 * - the callbacks will be removed from registered via `addCallback` exiting;
	 * @param {()=>(Promise<void>)} cb
	 * @example
	 * import { SafeExit } from 'vivth/node';
	 *
	 * const exitCallback () => {
	 * 	// code
	 * }
	 * SafeExit.instance.addCallback(exitCallback);
	 * // somewhere else
	 * SafeExit.instance.removeCallback(exitCallback);
	 */
	removeCallback = (cb) => {
		this.safeCleanUpCBs.delete(cb);
	};
	triggerExit = async () => {
		await this.#cleanup('vivth/node.SafeExit.instance.triggerExit');
	};

	/**
	 * @param {string} eventName
	 * @returns {Promise<void>}
	 */
	#cleanup = async (eventName) => {
		Console.log({ SafeExit: `called by '${eventName}'` }, { now: true });
		if (this.#childProcessHelper) {
			this.#childProcessHelper.kill('SIGTERM');
			Console.info('force closing bun terminal helper', { now: true });
		}
		await Promise.all(
			ForOfSync(this.safeCleanUpCBs, async (cleanup) => {
				const [, error] = await TryAsync(async () => {
					await cleanup();
				});
				if (error === undefined) {
					return;
				}
				Console.warn(error);
			})[0],
		);
		WalkThrough.set(setOFSignals, (signal) => {
			signal.remove.ref();
		});
		WalkThrough.map(mapOfEffects, ([effect, _]) => {
			effect.options.removeEffect();
		});
		process.exit(0);
	};
}
