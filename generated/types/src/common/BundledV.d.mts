/**
 * @description
 * - class helper for `vivth` `Bundled` values;
 */
export declare class BundledV {
    #private;
    /**
     * @description
     * - readonly value of whether the script run after being bundled with `vivth` or not;
     * @type {boolean}
     * @example
     * import { BundledV } from 'vivth/neutral';
     *
     * if(BundledV.isBundled){
     * 	// code
     * }
     */
    static get isBundled(): boolean;
    /**
     * @description
     * - to create `unbundled` only codeBlock;
     * >- when properly bundled via `vivth` bundling mechanism, this code block will be removed;
     * @param {()=>void} callback
     * @param {typeof import('./VivthUnBundledCodeBlock.mjs').VivthUnBundledCodeBlock} _closing
     * - must be filled for regexp detection;
     * @returns {void}
     * @example
     * import { BundledV } from 'vivth/neutral';
     *
     * BundledV.vivthUnBundledCodeBlock(() => {
     * 	// code
     * }, 'vivthUnBundledCodeBlock')
     */
    static vivthUnBundledCodeBlock: (callback: () => void, _closing: typeof import('./VivthUnBundledCodeBlock.mjs').VivthUnBundledCodeBlock) => void;
}
