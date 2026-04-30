// @ts-check

/**
 * @callback DevTestCB
 * @param {string} testName
 * @param {()=>Promise<boolean>} testCallback
 * - already wrapped with `TryAsync`:
 * >- if throws error will automatically return false;
 * @returns {{removeId:()=>void}}
 * - calling `removeId` will remove this test from reports;
 */
