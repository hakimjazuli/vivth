/**
 * @description
 * - function helper to create template literal with valueHandler to handle each values;
 * @template {any} INPUTTYPE
 * @param {import('../typehints/TemplateLiteralValueHandler.mjs').TemplateLiteralValueHandler<INPUTTYPE>} valueHandler
 * @param {(result:string)=>(string|Promise<string>)} [postProcess]
 * @returns {(strings:TemplateStringsArray,
 * ...values:(INPUTTYPE)[])=>
 * ReturnType<Parameters<typeof TemplateLiteral>[0]>}
 * @example
 * import { TemplateLiteral } form 'vivth';
 *
 * export const html = TemplateLiteral(
 *  ({ ...datas }) => `my string`,
 *  // optional
 *  (res) => return window.body.innerHTML = res
 * );
 *
 * html`<div>${`<button>innerButton</button>`}</div>`;
 * // this will set innerHTML of body to '<div><button>innerButton</button></div>'
 */
export function TemplateLiteral<INPUTTYPE extends unknown>(valueHandler: import("../typehints/TemplateLiteralValueHandler.mjs").TemplateLiteralValueHandler<INPUTTYPE>, postProcess?: (result: string) => (string | Promise<string>)): (strings: TemplateStringsArray, ...values: (INPUTTYPE)[]) => ReturnType<Parameters<typeof TemplateLiteral>[0]>;
