// @ts-check

import { Console } from '../class/Console.mjs';

/**
 * @description
 * - regex helper for:
 * >- get named import; OR
 * >- alias of named import;
 * @param {string} content
 * @param {string} moduleName
 * @param {string} packageName
 * @returns {string|undefined}
 * @example
 * import { GetNamedImportAlias } from 'vivth';
 *
 * const checkNoAlias = `
 * import { something } from 'packageName';
 * `
 * const checkAlias = `
 * import { something as somethingElse } from 'packageName';
 * `
 * GetNamedImportAlias(checkNoAlias, 'something', 'packageName'); // 'something'
 * GetNamedImportAlias(checkAlias, 'something', 'packageName'); // 'somethingElse'
 */
export function GetNamedImportAlias(content, moduleName, packageName) {
	const checkIfImportingFromVivthRegex = new RegExp(
		`(import\\s+{\\s*[\\s\\S]*(?<imported>${moduleName})\\s+as\\s+(?<alias>[a-zA-Z0-9]+)[\\s\\S]*\\s*}\\s+from\\s+['"]${packageName}['"])|(import\\s+{\\s*[\\s\\S]*(?<imported>${moduleName})[\\s\\S]*\\s*}\\s+from\\s+['"]${packageName}['"])`,
		'g'
	);
	const matched = checkIfImportingFromVivthRegex.exec(content);
	if (!matched || !matched.groups) {
		return;
	}
	const { imported, alias } = matched.groups;
	return alias ?? imported;
}
