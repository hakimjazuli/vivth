// @ts-check

import { IsAsync } from './IsAsync.mjs';

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
export function TemplateLiteral(valueHandler, postProcess = undefined) {
	if (IsAsync(valueHandler)) {
		// @ts-expect-error
		return async (templateStringsArray, ...valuesArrays) => {
			const result = [];
			const inputLength = templateStringsArray.length;
			for (let index = 0; index < templateStringsArray.length; index++) {
				result.push(templateStringsArray[index]);
				if (index < valuesArrays.length) {
					const currentValue = valuesArrays[index];
					if (currentValue === undefined) {
						continue;
					}
					result.push(
						await valueHandler({
							index,
							currentValue,
							valuesArrays,
							templateStringsArray,
							inputLength,
						}),
					);
				}
			}
			const resTrue = result.join('');
			if (!postProcess) {
				return resTrue;
			}
			return await postProcess(resTrue);
		};
	}
	// @ts-expect-error
	return (templateStringsArray, ...valuesArrays) => {
		const result = [];
		const inputLength = templateStringsArray.length;
		for (let index = 0; index < templateStringsArray.length; index++) {
			result.push(templateStringsArray[index]);
			if (index < valuesArrays.length) {
				const currentValue = valuesArrays[index];
				if (currentValue === undefined) {
					continue;
				}
				result.push(
					valueHandler({
						index,
						currentValue,
						valuesArrays,
						templateStringsArray,
						inputLength,
					}),
				);
			}
		}
		const resTrue = result.join('');
		if (!postProcess) {
			return resTrue;
		}
		return postProcess(resTrue);
	};
}
