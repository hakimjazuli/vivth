export type MonkeyPatchedType<ORIOBJ extends any> = ORIOBJ extends (...args: infer A) => infer R ? (...args: A) => R : ORIOBJ extends abstract new (...args: infer C) => infer I ? abstract new (...args: C) => I : any;
/**
 * @description
 * - type helper for `MonkeyPatch`;
 * @template {any} ORIOBJ
 * @typedef {ORIOBJ extends (...args: infer A) => infer R
 *    ? (...args: A) => R
 *    : ORIOBJ extends abstract new (...args: infer C) => infer I
 *    ? abstract new (...args: C) => I
 *    : any
 * } MonkeyPatchedType
 */
