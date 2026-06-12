// @ts-check

/**
 * @description
 * - return type of object have this method;
 * @typedef {{vivthCleanup: ()=>Promise<any>}} VivthCleanup
 * - you can call:
 * ```js
 * something.vivthCleanup();
 * ```
 * >- class that implements this;
 * >- function that have this as part of it's return;
 * - to clean up that object, usually a long lived process;
 */
