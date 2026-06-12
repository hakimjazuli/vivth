/**
 * - you can call:
 * ```js
 * something.vivthCleanup();
 * ```
 * >- class that implements this;
 * >- function that have this as part of it's return;
 * - to clean up that object, usually a long lived process;
 */
export type VivthCleanup = {
    vivthCleanup: () => Promise<any>;
};
