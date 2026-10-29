// @ts-check

import { basename, dirname, join } from 'node:path';
import { Paths } from '../class/Paths.mjs';
import { TrySync } from '../function/TrySync.mjs';
import { Preferrence } from '../common/Preferrence.mjs';
import { execFileSync } from 'node:child_process';
import { ParseSQLFile } from '../function/ParseSQLFile.mjs';
import { TryAsync } from '../function/TryAsync.mjs';
import { FileSafe } from '../class/FileSafe.mjs';
import { JSONFileHandler } from '../class/JSONFileHandler.mjs';
import { Console } from '../class/Console.mjs';
import { ForOfSync } from '../function/ForOfSync.mjs';
import { ForInSync } from '../function/ForInSync.mjs';

export class wailsUtils {
	/**
	 * @returns {string}
	 */
	static getProjectName = () => {
		return basename(dirname(Paths.root));
	};
	/**
	 * @param {string} projectName
	 * @returns {boolean}
	 */
	static checkGoProjectName = (projectName) => {
		const regex = /^[a-zA-Z][a-zA-Z0-9]*$/;
		return regex.test(projectName);
	};
	/**
	 * @param {string} str
	 * @returns {string}
	 */
	static toPascal = (str = '') => {
		return str.replace(/(^|_|-)+([a-z0-9])/g, (_, __, char) => char.toUpperCase());
	};
	/**
	 * Formats a Go file using gofumpt in-place (-w)
	 * @param {string} filePath
	 * @param {string} unformattedCode
	 * @returns {string}
	 */
	static formatGoCodeString = (filePath, unformattedCode) => {
		const [res, error] = TrySync(() => {
			// Use goimports to handle both formatting and import organization
			const args = filePath ? ['-srcdir', filePath] : [];

			return execFileSync('goimports', args, {
				input: unformattedCode,
				encoding: Preferrence.encoding,
			});
		});

		if (!error) {
			return res;
		}

		// Fallback: If goimports fails (e.g., syntax error), log and return unformatted code
		console.error('Failed to format & organize Go imports:', error.message);
		return unformattedCode;
	};
	/**
	 * @type {(
	 * 	obj:Record<string, string>,
	 * )=>string}
	 */
	static buildFields = (obj = {}) => {
		return Object.entries(obj)
			.map(([field, type]) => `\t${wailsUtils.toPascal(field)} ${type} \`json:"${field}"\``)
			.join('\n');
	};
	/**
	 * @param {2 | 3} version
	 * @param {string[]} datas
	 * @returns {string}
	 */
	static #emitter = (version, ...datas) => {
		datas[0] = `"${datas[0]}"`;
		switch (version) {
			case 2:
				datas.unshift('appCtx');
				return `runtime.EventsEmit(${datas.join(', ')})`;
			case 3:
				return `appGet.Event.Emit(${datas.join(', ')})`;
		}
	};
	/**
	 * @param {string} functionName
	 * @param {string} trueInput
	 * @param {string} trueOutput
	 * @param {string} safeSql
	 * @param {boolean} isReadQuery
	 * @param {string} namedQueryArgs
	 * @param {string} scanTargets
	 * @param {2 | 3} wailsVersion
	 * @returns {string}
	 */
	static fileContentSQLGoGenerator = (
		functionName,
		trueInput,
		trueOutput,
		safeSql,
		isReadQuery,
		namedQueryArgs,
		scanTargets,
		wailsVersion,
	) => {
		return `package sql

${
	wailsVersion === 2
		? `import (
	'github.com/wailsapp/wails/v2/pkg/runtime'
)`
		: `import (
	"github.com/wailsapp/wails/v3/pkg/application"
)`
}

type ${functionName}InputStruct struct {
${trueInput}
}
type ${functionName}OutputStruct struct {
${trueOutput}
}

func ${functionName}(${wailsVersion === 2 ? 'appCtx context.Context, ' : ''}connection *sql.DB, input *${functionName}InputStruct) ([]*${functionName}OutputStruct, error) {
	${wailsVersion === 3 ? 'appGet := application.Get()' : ''}
	if connection == nil {
		err := fmt.Errorf("database connection is nil")
		${wailsUtils.#emitter(wailsVersion, 'Log', 'err')}
		fmt.Println(err)
		return nil, err
	}

	tx, err := connection.BeginTx(context.Background(), nil)
	if err != nil {
		err = fmt.Errorf("${functionName}: failed to begin transaction: %w", err)
		${wailsUtils.#emitter(wailsVersion, 'Log', 'err')}
		fmt.Println(err)
		return nil, err
	}
	defer tx.Rollback()

	query := \`${safeSql}\`

	stmt, err := tx.PrepareContext(context.Background(), query)
	if err != nil {
		err = fmt.Errorf("${functionName}: failed to prepare statement: %w", err)
		${wailsUtils.#emitter(wailsVersion, 'Log', 'err')}
		fmt.Println(err)
		return nil, err
	}
	defer stmt.Close()

${
	isReadQuery
		? `\trows, err := stmt.QueryContext(
		context.Background()${namedQueryArgs ? `,\n\t\t${namedQueryArgs}` : ''},
	)
	if err != nil {
		err = fmt.Errorf("${functionName}: query execution failed: %w", err)
		${wailsUtils.#emitter(wailsVersion, 'Log', 'err')}
		fmt.Println(err)
		return nil, err
	}
	defer rows.Close()

	var results []*${functionName}OutputStruct

	for rows.Next() {
		item := &${functionName}OutputStruct{}
		if err := rows.Scan(${scanTargets}); err != nil {
			err = fmt.Errorf("${functionName}: failed to scan row: %w", err)
		${wailsUtils.#emitter(wailsVersion, 'Log', 'err')}
			fmt.Println(err)
			return nil, err
		}
		results = append(results, item)
	}

	if err := rows.Err(); err != nil {
		err = fmt.Errorf("${functionName}: row iteration error: %w", err)
		${wailsUtils.#emitter(wailsVersion, 'Log', 'err')}
		fmt.Println(err)
		return nil, err
	}

	if err := tx.Commit(); err != nil {
		err = fmt.Errorf("${functionName}: transaction commit failed: %w", err)
		${wailsUtils.#emitter(wailsVersion, 'Log', 'err')}
		fmt.Println(err)
		return nil, err
	}

	return results, nil
}`
		: `\t_, err = stmt.ExecContext(
		context.Background()${namedQueryArgs ? `,\n\t\t${namedQueryArgs}` : ''},
	)
	if err != nil {
		err = fmt.Errorf("${functionName}: statement execution failed: %w", err)
		${wailsUtils.#emitter(wailsVersion, 'Log', 'err')}
		fmt.Println(err)
		return nil, err
	}

	if err := tx.Commit(); err != nil {
		err = fmt.Errorf("${functionName}: transaction commit failed: %w", err)
		${wailsUtils.#emitter(wailsVersion, 'Log', 'err')}
		fmt.Println(err)
		return nil, err
	}
	${wailsUtils.#emitter(wailsVersion, 'Updated', 'nil')}
	${wailsUtils.#emitter(
		wailsVersion,
		'Log',
		/** is a string therefore is quoted */
		'"database is connected"',
	)}
	return []*${functionName}OutputStruct{}, nil
}`
}
`;
	};
	/**
	 * - parse sql file into typed go function, in same dir;
	 * - package is always sql, so dirname should be sql;
	 * - type are self closing, it recogninse go native types;
	 * - `:` prefix is for input field;
	 * - type then no `:` prefix means it is an output field;
	 * @param {string} path
	 * @param {2|3} wailsVersion
	 * @returns {ReturnType<typeof TryAsync<boolean>>}
	 */
	static pathToSQLHandler = (path, wailsVersion) => {
		return ParseSQLFile(path, async ({ input, output, sqlString, path: fullPath }) => {
			// Extract base file name without extension
			const fileName = fullPath.split(/[/\\]/).pop() || '';
			const baseName = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;

			// Convert to PascalCase for Go identifiers (e.g., "create_ref" -> "CreateRef")
			const functionName = baseName.replace(/(^|_|-)+([a-z0-9])/g, (_, __, char) =>
				char.toUpperCase(),
			);

			const inputEntries = Object.entries(input ?? {});
			const outputEntries = Object.entries(output ?? {});

			// Build explicit named SQL parameters: sql.Named("field", input.Field)
			const namedQueryArgs =
				inputEntries.length > 0
					? inputEntries
							.map(
								([field]) =>
									`sql.Named("${field.toLowerCase()}", input.${wailsUtils.toPascal(field)})`,
							)
							.join(',\n\t\t')
					: '';

			// Build row scan targets: &item.Field1, &item.Field2
			const scanTargets =
				outputEntries.length > 0
					? outputEntries.map(([field]) => `&item.${wailsUtils.toPascal(field)}`).join(', ')
					: '';

			// Clean comments, strip transaction controls (BEGIN/COMMIT), and escape backticks
			const cleanSql = sqlString
				.replace(/\/\*[\s\S]*?\*\//g, '')
				.replace(/\b(BEGIN\s+(TRANSACTION|WORK)?|COMMIT|ROLLBACK)\s*;/gi, '')
				.trim();

			const safeSql = cleanSql.replace(/`/g, '` + "`" + `');

			// Determine if query returns rows (SELECT or RETURNING clause)
			const isReadQuery = /^\s*SELECT/i.test(cleanSql) || /\bRETURNING\b/i.test(cleanSql);
			const trueInput = wailsUtils.buildFields(input);
			const trueOutput = wailsUtils.buildFields(output);
			const content = wailsUtils.fileContentSQLGoGenerator(
				functionName,
				trueInput,
				trueOutput,
				safeSql,
				isReadQuery,
				namedQueryArgs,
				scanTargets,
				wailsVersion,
			);
			return {
				ext: 'go',
				content: wailsUtils.formatGoCodeString(`${fullPath}.go`, content),
			};
		});
	};
	/**
	 * @param {Object[]} snippets
	 * @param {string[]} pathToJoin
	 */
	static jsonPrepare = (snippets, pathToJoin) => {
		const jsonPath = Paths.diskAbsolute(join(...pathToJoin));
		FileSafe.exist(jsonPath).then(async (isExist) => {
			const obj = {};
			ForOfSync(snippets, (objType) => {
				ForInSync(objType, (key) => {
					// @ts-expect-error
					obj[key] = objType[key];
				});
			});
			const projectJSONHandler = new JSONFileHandler(jsonPath);
			if (!isExist) {
				const [, errorWritingJSON] = await projectJSONHandler.write(obj);
				if (errorWritingJSON) {
					Console.error({ errorWritingJSON, jsonPath }, { now: true });
				}
			} else {
				const [, errorAsigningJSON] = await projectJSONHandler.assign(obj);
				if (errorAsigningJSON) {
					Console.error({ errorAsigningJSON, jsonPath }, { now: true });
				}
			}
		});
	};
	/**
	 * @param {string} content
	 * @param {string[]} pathToJoin
	 */
	static writeFileContent = (content, pathToJoin) => {
		let filePath = Paths.diskAbsolute(join(...pathToJoin));
		if (!filePath.endsWith('.go')) {
			filePath = `${filePath}.go`;
		}
		const exampleNested = filePath.replace(/\.go$/g, '.md').toLowerCase();
		FileSafe.exist(exampleNested).then(async (isExist) => {
			if (isExist) {
				return;
			}
			await FileSafe.write(
				exampleNested,
				`markdown to nest one level for '${basename(filePath)}'\nyou can change this file`,
				{ encoding: Preferrence.encoding },
			);
		});
		FileSafe.write(filePath, wailsUtils.formatGoCodeString(filePath, content), {
			encoding: Preferrence.encoding,
		}).then(([, errorCopyFile]) => {
			if (errorCopyFile) {
				Console.error({ errorCopyFile }, { now: true });
			}
		});
	};
	/**
	 * @param {Set<string>} packages
	 * @param {string[]} services
	 * @returns {string}
	 */
	static generateAppServiceContent = (packages, services) => {
		/**
		 * @type {string[]}
		 */
		const pacakges_ = [];
		ForOfSync(packages, (val) => {
			pacakges_.push(`"${val}"`);
		});
		return `package main

import (
	${Array.from(pacakges_).join('\n\t')}

	"github.com/wailsapp/wails/v3/pkg/application"
)

// register Vivth_Auto_Services to main function
var Vivth_Auto_Services = []application.Service{	
	${services.length ? `${services.join(',\n\t')},` : ''}
}
`;
	};
}
