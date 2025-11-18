/**
 * @description
 * - function helper to create template literal with VALUEhandler to handle each values;
 * @template {(input:any)=>string|Promise<string>} VALUEHANDLER
 * @param {VALUEHANDLER} valueHandler
 * @param {(result:string)=>string} [postProcess]
 * @returns {(strings:TemplateStringsArray,
 * ...values:(Parameters<VALUEHANDLER>[0])[])=>
 * ReturnType<VALUEHANDLER>}
 * @example
 * import { TemplateLiteral } form 'vivth';
 *
 * export const html = TemplateLiteral(
 *  (val) => val,
 *  // optional
 *  (res) => return window.body.innerHTML = res
 * );
 *
 * html`<div>${`<button>innerButton</button>`}</div>`;
 * // this will set innerHTML of body to '<div><button>innerButton</button></div>'
 */
export function TemplateLiteral<VALUEHANDLER extends (input: any) => string | Promise<string>>(valueHandler: VALUEHANDLER, postProcess?: (result: string) => string): (strings: TemplateStringsArray, ...values: (Parameters<VALUEHANDLER>[0])[]) => ReturnType<VALUEHANDLER>;
