// @ts-check

import { dirname } from 'node:path';

import { build } from 'esbuild';

import { ForOfSync } from './ForOfSync.mjs';
import { Paths } from '../class/Paths.mjs';
import { TryAsync } from './TryAsync.mjs';
import { SafeImport } from './SafeImport.mjs';
import { Console } from '../class/Console.mjs';

/**
 * @param {Set<string>} platforms
 * @param {string} path
 * @returns {Promise<void>}
 */
const checkByImportWithoutCache = async (platforms, path) => {
	const [, errorCheckingNodePlatform] = await SafeImport(path);
	if (errorCheckingNodePlatform) {
		return;
	}
	platforms.add('node');
};

/**
 * @param {Set<string>} platforms
 * @param {string} path
 * @returns {Promise<void>}
 */
const browserBuilder = async (platforms, path) => {
	await build({
		entryPoints: [path],
		platform: 'browser',
		bundle: true,
		write: false,
		mainFields: ['module', 'main'],
		logLevel: 'silent',
		target: 'esnext',
		format: 'esm',
		absWorkingDir: dirname(path),
	});
	platforms.add('browser');
};

/**
 * @type {Set<string>}
 */
const errorsSet = new Set();

/**
 * @description
 * - get valid esbuild platform name for a module path;
 * @param { string } path
 * @returns { Promise<'browser'|'node'|'neutral'|'unsupported'> }
 * @example
 * // D://lib-root/myModule.mjs
 * import process from 'node:process'; // lookupA;
 * import { GetModuleEsbuildPlatform } from "vivth/node";
 *
 * await GetModuleEsbuildPlatform('./myModule.mjs'); // 'node'; caused of lookupA;
 */
export async function GetModuleEsbuildPlatform(path) {
	path = Paths.normalize(path);
	/**
	 * @type { Set<string> }
	 */
	const platforms = new Set();

	await Promise.all(
		ForOfSync(
			[
				async () => {
					await browserBuilder(platforms, path);
				},
				async () => {
					await checkByImportWithoutCache(platforms, path);
				},
			],
			async (cb) => {
				return await TryAsync(cb);
			},
		)[0],
	);
	if (platforms.has('node') && platforms.has('browser')) {
		if (errorsSet.has(path)) {
			errorsSet.delete(path);
			Console.info(
				{ path, message: 'GetModuleEsbuildPlatform platform issue has been fixed' },
				{ now: true },
			);
		}
		return 'neutral';
	}
	if (platforms.has('browser')) {
		if (errorsSet.has(path)) {
			errorsSet.delete(path);
			Console.info(
				{ path, message: 'GetModuleEsbuildPlatform platform issue has been fixed' },
				{ now: true },
			);
		}
		return 'browser';
	}
	if (platforms.has('node')) {
		if (errorsSet.has(path)) {
			errorsSet.delete(path);
			Console.info(
				{ path, message: 'GetModuleEsbuildPlatform platform issue has been fixed' },
				{ now: true },
			);
		}
		return 'node';
	}
	errorsSet.add(path);
	Console.error({ GetModuleEsbuildPlatformErrorsSet: errorsSet }, { now: true });
	return 'unsupported';
}
