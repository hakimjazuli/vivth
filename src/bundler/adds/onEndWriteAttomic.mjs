// @ts-check

import { TryAsync } from '../../function/TryAsync.mjs';
import { FileSafe } from '../../class/FileSafe.mjs';
import { Preferrence } from '../../common/Preferrence.mjs';

/**
 * @type {(result: import('esbuild').BuildResult) => Promise<boolean>}
 */
export const onEndWriteAttomic = async (result) => {
	if (result.errors.length > 0) {
		console.error('Build failed with errors. Skipping write.');
		return false;
	}

	if (!result.outputFiles) {
		return false;
	}
	const [, err] = await TryAsync(async () => {
		const writePromises = result.outputFiles?.map(async (file) => {
			const [err] = await FileSafe.write(
				file.path,
				file.text,
				{ encoding: Preferrence.encoding },
				true,
				'atomic',
			);
			if (err) {
				throw err;
			}
		});
		await Promise.all(
			// @ts-expect-error
			writePromises,
		);
		console.log(
			`[${new Date().toLocaleTimeString()}] Rebuild complete: All files written atomically.`,
		);
	});
	if (!err) {
		return true;
	}
	console.error('Atomic write failed during rebuild:', err);
	return false;
};
