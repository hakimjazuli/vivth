export type TemplateLiteralValueHandler<INPUTTYPE extends any> = (arg0: {
    currentValue: INPUTTYPE;
    index: number;
    templateStringsArray: TemplateStringsArray;
    valuesArrays: INPUTTYPE[];
    inputLength: number;
}) => (string | Promise<string>);
/**
 * - type helper for typing `vivth.TemplateLiteral`;
 * @template {any} INPUTTYPE
 * @callback TemplateLiteralValueHandler
 * @param {Object} arg0
 * @param {INPUTTYPE} arg0.currentValue
 * @param {number} arg0.index
 * @param {TemplateStringsArray} arg0.templateStringsArray
 * @param {INPUTTYPE[]} arg0.valuesArrays
 * @param {number} arg0.inputLength
 * @returns {(string|Promise<string>)}
 */
