// @ts-check

import { Console } from '../../class/Console.mjs';
import { IsStringLooksLikeAPath } from '../../function/IsStringLooksLikeAPath.mjs';

/**
 * @param {import('esbuild').Message[]} errorData
 * @returns { void }
 */
export const onEndEsBuildErrorLogger = (errorData) => {
	const errorLog = {
		...errorData[0],
		suggestion: ['modify `FileSelfMapper` constructor `argument[1].esbuild`'],
	};
	const errorText = errorData[0]?.text;
	const match = errorText?.toLocaleLowerCase().match(/could not resolve\s+"([^"]+)"/i);
	if (match) {
		const [, lib] = match;
		if (IsStringLooksLikeAPath(lib ?? '')) {
			Object.assign(errorLog, {
				message: `'${lib}' doesn't exist`,
			});
		} else {
			Object.assign(errorLog, {
				platformSuggestion: {
					node: `add esbuild.platform:'node' AND add '${lib}' into esbuild.external`,
					browser: `add esbuild.platform:'browser'`,
				},
			});
		}
	}
	Console.error(errorLog, { now: true });
	return;
};
