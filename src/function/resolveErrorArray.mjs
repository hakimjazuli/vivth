// @ts-check

/**
 * @param {unknown} unknown
 * @returns {[undefined, Error]}
 */
export const resolveErrorArray = (unknown) => {
	if (unknown instanceof Error) {
		return [undefined, unknown];
	}
	let message;
	try {
		message = JSON.stringify(unknown);
	} catch {
		try {
			message = String(unknown);
		} catch {
			message = '[Unstringifiable value]';
		}
	}
	const err = new Error(message);
	return [undefined, err];
};
