/**
 * @param {string} path
 * @param {import('esbuild').Message[]} errorData
 * @returns { void }
 */
export declare const onEndEsBuildErrorLogger: (path: string, errorData: import('esbuild').Message[]) => void;
