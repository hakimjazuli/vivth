// @ts-check

/**
 * @callback DevTestCB
 * @param {string} testName
 * @param {()=>Promise<boolean>} testCallback
 * - already wrapped with `TryAsync`:
 * >- if throws error will automatically return false;
 * @returns {Promise<{removeId:()=>void}>}
 * - calling `removeId` will remove the this test from reports;
 */
