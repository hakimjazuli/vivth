/**
 * @description
 * `workerThreadClass` description placeholder;
 */
export const workerThreadClass: {
    new (handler: (ev: any, isLastOnQ: () => boolean) => any): WorkerThread<any, any>;
    #refs: Parameters<(typeof WorkerThread)["setup"]>[0];
    setup<RECEIVE, POST>(refs: {
        parentPort: typeof import("worker_threads")["parentPort"];
    }): typeof WorkerThread<RECEIVE, POST>;
    #isCloseWorkerEvent: (ev: any) => boolean;
};
import { WorkerThread } from '../index.mjs';
