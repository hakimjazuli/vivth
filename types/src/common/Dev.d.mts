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
    static isDev: boolean;
    /**
     * @type {Signal<Map<string,Awaited<ReturnType<typeof TryAsync<boolean>>>>>}
     */
    static #notifications: Signal<Map<string, Awaited<ReturnType<typeof TryAsync<boolean>>>>>;
    /**
     * @type {DevTestCB}
     */
    static #test: DevTestCB;
    static #effectForCheck: Effect & {
        "vivth:unwrapLazy;": () => Effect;
    };
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
    static vivthDevCodeBlock: (callback: (options: {
        test: DevTestCB;
    }) => Promise<void>, _closing: VivthDevCodeBlockStringType) => Promise<void>;
}
export type VivthDevCodeBlockStringType = import("../types/VivthDevCodeBlockStringType.mjs").VivthDevCodeBlockStringType;
export type DevTestCB = import("../types/DevTestCB.mjs").DevTestCB;
import { Signal } from '../class/Signal.mjs';
import { TryAsync } from '../function/TryAsync.mjs';
import { Effect } from '../class/Effect.mjs';
