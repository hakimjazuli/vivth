/**
 * @description
 * - class helper for `vivth` `Bundled` values;
 */
export class BundledV {
    static #isBundled: boolean;
    /**
     * @description
     * - readonly value of whether the script run after being bundled with `vivth` or not;
     * @readonly
     * @type {boolean}
     * @example
     * import { BundledV } from 'vivth/neutral';
     *
     * if(BundledV.isBundled){
     * 	// code
     * }
     */
    static readonly get isBundled(): boolean;
    /**
     * @description
     * - to create `unbundled` only codeBlock;
     * >- when properly bundled via `vivth` bundling mechanism, this code block will be removed;
     * @param {()=>void} callback
     * @param {import('./VivthUnBundledCodeBlock.mjs').VivthUnBundledCodeBlock} _closing
     * - must be filled for regexp detection;
     * @returns {void}
     * @example
     * import { BundledV } from 'vivth/neutral';
     *
     * BundledV.vivthUnBundledCodeBlock(() => {
     * 	// code
     * }, 'vivthUnBundledCodeBlock')
     */
    static vivthUnBundledCodeBlock: (callback: () => void, _closing: "vivthUnBundledCodeBlock") => void;
}
