import { Derived } from '../class/Derived.mjs';
import { Effect } from '../class/Effect.mjs';
export type EnvModeType = import('../typehints/EnvModeType.mjs').EnvModeType;
export type DevTestCB = import('../typehints/DevTestCB.mjs').DevTestCB;
/**
 * @typedef {import('../typehints/EnvModeType.mjs').EnvModeType} EnvModeType
 * @typedef {import('../typehints/DevTestCB.mjs').DevTestCB} DevTestCB
 */
/**
 * @description
 * - class helper for determining environtment mode to be `developement` or `production`;
 */
export declare class EnvMode {
    #private;
    /**
     * @description
     * - `Derived` wrapper of whether is in `dev` mode or `prod` not;
     * >- for listener only;
     * @type {Derived<EnvModeType>}
     * @example
     * import { EnvMode, Effect } from 'vivth/neutral';
     *
     * console.log(EnvMode.mode.value); // default: 'dev'
     *
     * // listeneing to changes;
     * new Effect(async({ subscribe }) => {
     * 	const mode = subscribe(EnvMode.mode).value;
     * 	// code
     * })
     */
    static mode: Derived<EnvModeType>;
    /**
     * @description
     * - enforce development or production mode;
     * - DO NOT EXPOSE THIS API TO UNSECURED ACCESS, DIRECTLY NOR INDIRECTLY;
     * @param {EnvModeType} mode
     * @returns {void}
     * @example
     * import { EnvMode } from 'vivth/neutral';
     *
     * EnvMode.enforce('dev'); // OR
     * EnvMode.enforce('prod');
     */
    static enforce: (mode: EnvModeType) => void;
    /**
     * @description
     * @param {(options:{devTest:DevTestCB}|
     * {devTest:undefined})=>Promise<void>
     * } callback
     * - when on `dev` mode also provide `test` method for inline testing:
     * >- which is wrapped in `TryAsync`, throwed errors will automatically return `false`;
     * - for smaller bundle size, you can wrap the `devTest` with `BundleV.vivthUnBundledCodeBlock`;
     * @param {Effect["options"]["subscribe"]} [subscribe]
     * - optional whether to scope the callback into an `Effect`;
     * @returns {Promise<void>}
     */
    static codeBlock(callback: (options: {
        devTest: DevTestCB;
    } | {
        devTest: undefined;
    }) => Promise<void>, subscribe?: Effect["options"]["subscribe"]): Promise<void>;
}
