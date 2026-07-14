import { SafeExit } from './SafeExit.mjs';
import { Paths } from './Paths.mjs';
import { WorkerMainThread } from './WorkerMainThread.mjs';
import { WorkerThread } from './WorkerThread.mjs';
import { Preferrence } from '../common/Preferrence.mjs';
/**
 * @description
 * - class with collections of methods/constructors for setting up necessary variables for vivth internal functionalities;
 */
export declare class Setup {
    /**
     * @description
     * - proxy `SafeExit_instance` for Setup
     * @example
     * import { Setup } from 'vivth/node';
     *
     * new Setup.safeExit('SIGINT', 'SIGTERM', ...eventNames);
     */
    static safeExit: typeof SafeExit;
    /**
     * @description
     * - proxy `Paths_instance` for Setup;
     * @example
     * import { Setup } from 'vivth/node';
     *
     * new Setup.paths({
     * 	root: location.origin, // browser example
     * })
     */
    static paths: typeof Paths;
    /**
     * @description
     * - proxy `WorkerMainThread_instance` for Setup;
     * @example
     * import { Setup } from 'vivth/node';
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
    static workerMain: ({ workerClass, pathValidator }: {
        workerClass: typeof WorkerMainThread["workerClass"];
        pathValidator: typeof WorkerMainThread["pathValidator"];
    }) => void;
    /**
     * @description
     * - correct `parentPort` reference when needed;
     * - export to create new reference to be use to create new WorkerThread instance;
     * @example
     * import { Setup } from 'vivth/node';
     * import { parentPort } from 'node:worker_threads';
     *
     * export const MyWorkerThreadRef = Setup.workerThread({parentPort});
     * // that is the default value, if your parentPort/equivalent API is not that;
     * // you need to call this method;
     */
    static workerThread: typeof WorkerThread.setup;
    /**
     * @description
     * - setup envMode into `developement`('default') or `production`;
     * @example
     * import { Setup } from 'vivth/node';
     *
     * Setup.enforceEnvMode('prod');
     *
     * // default behaviour, technically only need to be call for reactive functionality;
     * Setup.enforceEnvMode('dev');
     */
    static enforceEnvMode: (mode: import("../common/EnvMode.mjs").EnvModeType) => void;
    /**
     * @description
     * - setup `vivth `preffered encoding;
     * @example
     * import { Setup } from 'vivth/node';
     *
     * Setup.preferrence({ encoding: 'utf-8' });
     */
    static preferrence: ({ encoding }: {
        encoding: typeof Preferrence["encoding"];
    }) => void;
}
