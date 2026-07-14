/**
 * @description
 * - function helper to create template literal with valueHandler to handle each values;
 * @template {any} INPUTTYPE
 * @template {string|Promise<string>} RET
 * @param {import('../typehints/TemplateLiteralValueHandler.mjs').TemplateLiteralValueHandler<INPUTTYPE>} valueHandler
 * @param {(result:string)=>(RET)} [postProcess]
 * @returns {(strings:TemplateStringsArray,
 * ...values:(INPUTTYPE)[])=>
 * RET}
 * @example
 * import { TemplateLiteral } from 'vivth/neutral';
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
export declare function TemplateLiteral<INPUTTYPE extends any, RET extends string | Promise<string>>(valueHandler: import('../typehints/TemplateLiteralValueHandler.mjs').TemplateLiteralValueHandler<INPUTTYPE>, postProcess?: (result: string) => (RET)): (strings: TemplateStringsArray, ...values: (INPUTTYPE)[]) => RET;
