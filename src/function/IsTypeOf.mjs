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
 * @preserve
 * @description
 * A type-safe `typeof` helper.
 * @template {keyof typeof TypeMap} K
 * @param {unknown} object - The value to check.
 * @param {K} type - The type string to compare against.
 * @returns {object is typeof TypeMap[K]} - Returns true if the type matches, narrowing the type.
 */
function IsTypeOf(object, type) {
  return typeof object === type;
}
export {
  IsTypeOf,
  TypeMap
};
