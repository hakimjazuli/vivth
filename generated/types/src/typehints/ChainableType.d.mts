export type ChainableType<OBJ extends object> = {
    this: OBJ;
} & {
    [K in keyof OBJ]: OBJ[K] extends (...args: any[]) => any ? (...args: Parameters<OBJ[K]>) => ChainableType<OBJ> : OBJ[K];
};
/**
 * @template {object} OBJ
 * @typedef { {this: OBJ} & {
 *   [K in keyof OBJ]:
 *     OBJ[K] extends (...args: any[]) => any
 *       ? (...args: Parameters<OBJ[K]>) => ChainableType<OBJ>
 *       : OBJ[K]
 * }} ChainableType
 */
