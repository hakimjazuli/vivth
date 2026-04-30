/**
 * - type helper for typing `vivth.TemplateLiteral`;
 */
export type TemplateLiteralValueHandler<INPUTTYPE extends unknown> = (arg0: {
    currentValue: INPUTTYPE;
    index: number;
    templateStringsArray: TemplateStringsArray;
    valuesArrays: INPUTTYPE[];
    inputLength: number;
}) => (string | Promise<string>);
