const TypeMap = {
  string: "",
  number: 0,
  boolean: true,
  object: {},
  function: () => {
  },
  undefined: void 0,
  symbol: /* @__PURE__ */ Symbol(),
  bigint: 0n
};
/**
 * @description
 * A type-safe `typeof` helper.
 * @template {keyof typeof TypeMap} K
 * @typedef {import('./IsTypeOf.mts').IsTypeOf<K>} IsTypeOf
 */
function IsTypeOf(object, type) {
  return typeof object === type;
}
export {
  IsTypeOf,
  TypeMap
};
