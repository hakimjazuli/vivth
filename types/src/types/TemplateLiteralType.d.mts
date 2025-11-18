export type TemplateLiteralType<INPUTTYPE extends unknown, ISASYNC extends boolean> = (string: TemplateStringsArray, ...values: INPUTTYPE[]) => ISASYNC extends true ? Promise<string> : string;
