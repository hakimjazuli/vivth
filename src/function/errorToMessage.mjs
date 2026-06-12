// @ts-check

/**
 * @param {Error} err
 * @returns {import('esbuild').Message}
 */
export function errorToMessage(err) {
	return {
		id: '', // Add this line to satisfy the interface requirement
		text: err.message,
		location: null,
		notes: [
			{
				text: err.stack || '',
				location: null,
			},
		],
		pluginName: 'my-plugin',
		detail: err,
	};
}
