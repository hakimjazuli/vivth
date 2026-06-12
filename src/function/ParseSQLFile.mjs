// @ts-check

import { basename, extname } from 'node:path';

import { FileSafe } from '../class/FileSafe.mjs';
import { TryAsync } from './TryAsync.mjs';
import { readFile } from 'node:fs/promises';
import { Preferrence } from '../common/Preferrence.mjs';
import { LitExp } from '../class/LitExp.mjs';
import { LazyFactory } from './LazyFactory.mjs';
import { TrySync } from './TrySync.mjs';
import { FactoryKey } from '../common/FactoryKey.mjs';
import { ForOfSync } from './ForOfSync.mjs';
import { Paths } from '../class/Paths.mjs';
import { Console } from '../class/Console.mjs';

const templater = LazyFactory(() => {
	return TrySync(() => {
		const temp = LitExp.prepare({
			typeBrace0: /\/\*\s+/,
			type: /[\w]+/,
			typeBrace1: /\s+\*\/\s*?/,
			name: /(?:\:|)[\w]+/,
			closing: /[,\s;]/,
		});
		const [literalSQLTemplate, errorTemplating] = temp;
		if (errorTemplating) {
			throw errorTemplating;
		}
		return literalSQLTemplate`${'typeBrace0'}${'type'}${'typeBrace1'}${'name'}`;
	});
});

/**
 * @description
 * - parse then generate file right next to said sql file;
 * - this function assume `Paths` already instantiated;s
 * @param {string} path
 * @param {(
 *  arg0:{input:Record<string, string>,output:Record<string, string>, sqlString:string}
 * )=>
 *  {ext:string, content:string}
 * } [fileGenerator]
 * - file string generator;
 * - the default will generate mjs callback type, and sql string;
 * >- `callback` type: basename + 'CBType';
 * >- `sql` string: basename + 'SQL';
 * @returns {ReturnType<typeof TryAsync<boolean>>}
 */
export async function ParseSQLFile(
	path,
	fileGenerator = ({ input, output, sqlString }) => {
		const exportname = basename(path).replace(/\./g, '').replace(/sql$/, '');
		const content = `// @ts-check
/**
 * @typedef {${JSON.stringify(input).replace(/"/g, '')}} INPUT
 * @typedef {${JSON.stringify(output).replace(/"/g, '')}[]} RESPONSE
 */
/**
 * @callback ${exportname}CBType
 * @param {INPUT} input
 * @returns {Promise<RESPONSE>} 
 */
export const ${exportname}SQL = \`${sqlString.replace(/\`/g, '\\`')}\`;
`;
		return { ext: '.mjs', content };
	},
) {
	return await TryAsync(async () => {
		path = Paths.diskAbsolute(path);
		if (extname(path) !== '.sql') {
			Console.warn(`'${path}' not an sql file`);
			return false;
		}
		if (!(await FileSafe.exist(path))) {
			throw `'${!(await FileSafe.exist(path))}' doesn't exist`;
		}
		templater[FactoryKey];
		const [templateHandler, errorTemplating] = templater;
		if (errorTemplating) {
			throw { errorTemplating };
		}
		const sqlString = (await readFile(path, { encoding: Preferrence.encoding })).replace(
			/\s+/g,
			' ',
		);
		const [matchedAndGrouped, errorMatching] = templateHandler.evaluate.matchedAllAndGrouped(
			sqlString,
			{
				flags: 'g',
				whiteSpaceSensitive: false,
			},
		);
		if (errorMatching) {
			throw { errorMatching };
		}
		const {
			result: { named },
		} = matchedAndGrouped;
		if (!Object.keys(named).length) {
			throw { path, message: 'detected no input nor output' };
		}
		const res = { input: {}, output: {} };
		ForOfSync(named, ({ type, name }) => {
			if (name.startsWith(':')) {
				name = name.replace(':', '').toString();
				// @ts-expect-error
				res.input[name] = type;
			} else {
				// @ts-expect-error
				res.output[name] = type;
			}
		});
		const { content, ext } = fileGenerator({ input: res.input, output: res.output, sqlString });
		let extTrue = ext;
		if (!ext.startsWith('.')) {
			extTrue = `.${ext}`;
		}
		const pathMJS = `${path}${extTrue}`;
		const [, errorWrite] = await FileSafe.write(pathMJS, content, {
			encoding: Preferrence.encoding,
		});
		if (errorWrite) {
			throw { errorWrite };
		}
		Console.info(`✅ Successfully generate type from '${path}' to '${pathMJS}'`);
		return true;
	});
}
