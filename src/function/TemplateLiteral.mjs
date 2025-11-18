// @ts-check

import { IsAsync } from './IsAsync.mjs';

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
 *  (res)=> {
 *    window.body.innerHTML = res
 *  }
 * );
 *
 * html`<div>${`<button>innerButton</button>`}</div>`;
 * // this will set innerHTML of body to '<div><button>innerButton</button></div>'
 */
export function TemplateLiteral(valueHandler, postProcess = undefined) {
	if (IsAsync(valueHandler)) {
		// @ts-expect-error
		return async (strings, ...values) => {
			const result = [];
			for (let i = 0; i < strings.length; i++) {
				result.push(strings[i]);
				if (i < values.length) {
					const value = values[i];
					if (value === undefined) {
						continue;
					}
					result.push(await valueHandler(value));
				}
			}
			const resTrue = result.join('');
			if (!postProcess) {
				return resTrue;
			}
			return postProcess(resTrue);
		};
	}
	// @ts-expect-error
	return (strings, ...values) => {
		const result = [];
		for (let i = 0; i < strings.length; i++) {
			result.push(strings[i]);
			if (i < values.length) {
				const value = values[i];
				if (value === undefined) {
					continue;
				}
				result.push(valueHandler(value));
			}
		}
		const resTrue = result.join('');
		if (!postProcess) {
			return resTrue;
		}
		return postProcess(resTrue);
	};
}
