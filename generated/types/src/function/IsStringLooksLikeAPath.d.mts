/**
 * @description
 * - check if string lookslike a path;
 * @param {string} spec
 * @returns {boolean}
 * @example
 * import { IsStringLooksLikeAPath } from "vivth";
 *
 * looksLikePath("./foo.mjs"); // true
 * looksLikePath("../bar.ts"); // true
 * looksLikePath("/usr/lib.js"); // true
 * looksLikePath("C:\\lib\\mod"); // true
 * looksLikePath("react"); // false
 * looksLikePath("node:path"); // false
 */
export function IsStringLooksLikeAPath(spec: string): boolean;
