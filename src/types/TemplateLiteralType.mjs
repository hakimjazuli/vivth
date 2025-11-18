// @ts-check

/**
 * @description
 * - helper to create custom template literal function;
 * @template {any} INPUTTYPE
 * - custom input;
 * @template {boolean} ISASYNC
 * - wheter async or not;
 * @callback TemplateLiteralType
 * @param {TemplateStringsArray} string
 * @param {...INPUTTYPE} values
 * @returns {ISASYNC extends true ? Promise<string>:
 * string
 * }
 */
