// @ts-check

import { readFile, writeFile } from 'node:fs/promises';
import { basename } from 'node:path';

import { TryAsync } from '../function/TryAsync.mjs';
import { Console } from '../class/Console.mjs';
import { Timeout } from '../function/Timeout.mjs';
import { LitExp } from '../class/LitExp.mjs';

/**
 * @typedef {'shouldProceedNextCheck'|'waitForRewrite'|'doNotProcess'} RetType
 */

/**
 * @param {string} path
 * @param {BufferEncoding} [encoding]
 * @returns {Promise<RetType>}
 */
export const correctBeforeParse = async (path, encoding = 'utf-8') => {
	const validExportName = basename(path).split('.')[0] ?? '';
	const firstLetter = validExportName[0];
	const isStartWithCapital = firstLetter?.toUpperCase() === firstLetter;
	if (validExportName === '' || isStartWithCapital === false) {
		return 'doNotProcess';
	}
	const content = (await readFile(path, { encoding: 'utf-8' })).toString();
	const [resFunctionCheck, errorFunctionCheck] = await checkIsFunction(
		content,
		validExportName,
		path,
		encoding
	);
	if (errorFunctionCheck) {
		return 'doNotProcess';
	}
	if (resFunctionCheck === 'waitForRewrite') {
		return 'waitForRewrite';
	}
	const [resClassCheck, errorClassCheck] = await checkIsClass(
		content,
		validExportName,
		path,
		encoding
	);
	if (errorClassCheck) {
		return 'doNotProcess';
	}
	return resClassCheck;
};

/**
 * @type {(content:string,
 * validExportName:string,
 * ...options:Parameters<correctBeforeParse>)=>
 * ReturnType<typeof TryAsync<RetType>>}
 */
const checkIsFunction = async (content, validExportName, path, encoding) => {
	return await TryAsync(async () => {
		const regexConst = new RegExp(
			`export\\s+const\\s+${validExportName}\\s+\\=\\s*?(?:async|)\\s*?\\(([\\s\\S]*?)\\)\\s*?\=\>`,
			'g'
		);
		const matches = content.matchAll(regexConst).toArray()[0];
		const useConst = regexConst.test(content);
		if (useConst && matches) {
			const [fullString, parameters] = matches;
			const declaratorReplaceMent = `export function ${validExportName}(${parameters})`;
			const newContent = content.replace(fullString, declaratorReplaceMent);
			await Timeout(100); // to wait for pretify on autoSave;
			await writeFile(path, newContent, { encoding });
			Console.info({
				vivthJSAutoDoc: `successfully modify '${path}' exported function to regullar function declaration, for correct type emition;`,
			});
			return 'waitForRewrite';
		}
		return 'shouldProceedNextCheck';
	});
};

/**
 * @type {(content:string,
 * validExportName:string,
 * ...options:Parameters<correctBeforeParse>)=>
 * ReturnType<typeof TryAsync<RetType>>}
 */
const checkIsClass = async (content, validExportName, path, encoding) => {
	return await TryAsync(
		/**
		 * @returns {Promise<RetType>}
		 */
		async () => {
			const isAClassRegex = new RegExp(`export\\s+class\\s+${validExportName}`, 'g');
			if (isAClassRegex.test(content) === false) {
				return 'shouldProceedNextCheck';
			}
			let rewrite = false;
			const jsdocCommentBlockRegex = /\/\*\*[\s\S]*?\*\//g;
			content
				.match(jsdocCommentBlockRegex)
				?.filter((val) => {
					return val.includes('@template');
				})
				.forEach((val) => {
					const check = new RegExp(
						`(?<opening>${LitExp.escape(val).replace(
							/\s+/g,
							`\\\s*`
						)}\\\s*?(?:static\\\s+|))(?<funcname>(?:\#|)[a-zA-Z0-9]*)\\\s*?\\\=\\\s*?(?<async_>async\\\s*?|)\\\((?<parameters>[\\\s\\\S]*?)\\\)\\\s*?=>`,
						'g'
					);
					const [checkContent] = content.matchAll(check).toArray();
					if (checkContent === undefined) {
						return;
					}
					const fullCaptured = checkContent[0];
					const grouped = checkContent.groups;
					if (grouped === undefined) {
						return;
					}
					const { opening, funcname, async_, parameters } = grouped;
					rewrite = true;
					const modifiedFuncDeclaration = `${opening}${
						async_ ? 'async ' : ''
					}${funcname}(${parameters})`;
					content = content.replace(fullCaptured, modifiedFuncDeclaration);
				});
			if (rewrite) {
				await Timeout(100); // to wait for pretify on autoSave;
				await writeFile(path, content, { encoding });
				Console.info({
					vivthJSAutoDoc: `successfully modify '${path}' class/instance method(s), that has generic template, for correct type emition;`,
				});
				return 'waitForRewrite';
			}
			return 'shouldProceedNextCheck';
		}
	);
};
