// @ts-check

import { SafeExit } from './SafeExit.mjs';
import { Paths } from './Paths.mjs';
import { WorkerMainThread } from './WorkerMainThread.mjs';
import { WorkerThread } from './WorkerThread.mjs';

/**
 * @description
 * - class with collections of methods/constructors for setting up necessary variables for vivth internal functionalities;
 */
export class Setup {
	/**
	 * @description
	 * - proxy `SafeExit_instance` for Setup
	 * @example
	 * import { Setup, Console } from 'vivth';
	 *
	 * new Setup.safeExit({
	 * 	// eventNames are blank by default, you need to manually name them all;
	 * 	// 'exit' will be omited, as it might cause async callbacks failed to execute;
	 * 	eventNames: ['SIGINT', 'SIGTERM', ...eventNames],
	 * 	terminator : () => process.exit(0),
	 * 	listener : (eventName) => {
	 * 			process.once(eventName, function () {
	 * 				SafeExit.instance?.exiting.correction(true);
	 * 				Console.log(`safe exit via "${eventName}"`);
	 * 			});
	 * 	}
	 * });
	 */
	static safeExit = SafeExit;
	/**
	 * @description
	 * - proxy `Paths_instance` for Setup;
	 * @example
	 * import { Setup } from 'vivth';
	 *
	 * new Setup.paths({
	 * 	root: location.origin, // browser example
	 * })
	 */
	static paths = Paths;
	/**
	 * @description
	 * - proxy `WorkerMainThread_instance` for Setup;
	 * @example
	 * import { Setup } from 'vivth';
	 * import { Worker } from 'node:worker_threads';
	 *
	 * Setup.workerMain({
	 * 	workerClass: Worker,
	 * 	basePath: 'public/assets/js/workers',
	 * 	pathValidator: async (workerPath, root, base) => {
	 * 		const res = await fetch(`${root}/${base}/${workerPath}`);
	 * 		// might also check wheter it need base or not
	 * 		return await res.ok;
	 * 	},
	 * });
	 */
	static workerMain = WorkerMainThread.setup;
	/**
	 * @description
	 * - correct `parentPort` reference when needed;
	 * - export to create new reference to be use to create new WorkerThread instance;
	 * @example
	 * import { Setup } from 'vivth';
	 * import { parentPort } from 'node:worker_threads';
	 *
	 * export const MyWorkerThreadRef = Setup.workerThread({parentPort});
	 * // that is the default value, if your parentPort/equivalent API is not that;
	 * // you need to call this method;
	 */
	static workerThread = WorkerThread.setup;
}
